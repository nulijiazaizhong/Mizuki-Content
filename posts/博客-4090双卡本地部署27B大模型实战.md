---
title: 两张 4090、一条 PCIe：本地部署 27B 大模型的全记录
published: 2026-09-20
description: "两张 4090、一条 PCIe：本地部署 27B 大模型的全记录"
image: "/images/posts/beautify.png"
tags: [AI, 本地模型]
category: "教程"
draft: false
lang: "zh-CN"
---

# 两张 4090、一条 PCIe：本地部署 27B 大模型的全记录

> 30 tok/s 的 sglang、一条被证伪的 MTP 优化、一个 1.75-bit 三元量化的 27B 模型，以及一张 48GB 显存的账单。

如果你有一台带 GPU 的服务器，大概率和我一样，第一反应是"本地跑个大模型吧"。然后你就会发现，**把模型跑起来是最容易的部分，把它跑快、跑省、跑明白，才是真正的工程**。

这篇文章记录了我在一台 KVM 虚拟机上部署 Qwen3.8-27B 的全过程：从一条 `NCCL_P2P_DISABLE=1` 引发的 30 tok/s 惨案，到 MTP 投机解码上线后不升反降 40%，再到用 1.75-bit 三值化把 27B 模型塞进 5.6GB。所有数据都是实测，所有弯路都没省。

## 一、先交代硬件：一台"不友好"的机器

测试环境没有什么可炫耀的，恰恰是它的"不友好"让所有结论都有参考价值：

| 项   | 配置                                              |
| ---- | ------------------------------------------------- |
| 机型 | KVM 虚拟机（云服务器）                            |
| GPU  | 2 × RTX 4090 48GB（PCIe PIX 拓扑，**无 NVLink**） |
| 互联 | 双卡之间走 PCIe P2P，跨 CPU 插槽                  |
| CPU  | 8 核 × 2 路，16 线程                              |
| 内存 | 62 GB                                             |

两个先天限制，直接决定了后面所有的性能形态：

1. **没有 NVLink**。多卡并行的 allreduce 只能走 PCIe，带宽差一个数量级；
2. **KVM 虚拟化**。GPU 直通（passthrough）在虚拟机里经常降级，P2P 访问可能被虚拟化层屏蔽。

记住这两点，后面看到"单卡 47 tok/s 就是天花板"时会觉得合理。

## 二、惨案现场：48GB 双卡，30 tok/s

最初的部署是最"标准"的：sglang + 双卡张量并行（TP=2）+ FP8 KV cache + 262K 上下文。配置无懈可击，速度一言难尽：**单请求 decode 30 tok/s**。

一台双 4090 的机器，跑 27B 模型只有 30 tok/s？查日志，三条信息把真相钉死了：

```
CustomAllReduceV2 is disabled because your platform lacks GPU P2P
capability or P2P test failed
CustomAllreduce is disabled ...
multimem all-gather disabled (CUDA driver error: invalid device ordinal)
```

组合起来就是：**KVM 屏蔽了 P2P → 双卡之间无法直接通信 → 框架 fallback 到用 CPU 内存做中转 → 每次 allreduce 都要把激活值从 GPU 拷到 CPU 再拷回来**。48GB 的卡，算力闲置，全在等内存总线。

修复方案是把 `NCCL_P2P_DISABLE=1` 之类的变量清掉、让驱动重新探测。但说实话，在 KVM 里 P2P 能恢复到什么程度全看虚拟化层脸色，**真正干净解法是单卡**。

## 三、单卡 + AWQ：48GB 装下 262K 上下文的算术题

单卡路线的关键问题是：**48GB 显存，27B 模型 + 262K 上下文，什么量化能装下？**

这里要先认识 Qwen3.8 的一个特殊架构：它是 **hybrid 架构**——64 层里只有 16 层是标准 full attention（要存 KV cache），另外 48 层是线性注意力（GDN/Mamba 类），状态是**定长**的，不随上下文长度增长。这笔账和普通 Transformer 完全不一样：

| 占用项                              | 大小     |
| ----------------------------------- | -------- |
| Mamba SSM 状态（固定）              | 11.25 GB |
| 16 层 full-attn KV cache，262K，FP8 | 8.59 GB  |
| 权重（AWQ W4A16）                   | 19.5 GB  |
| CUDA graph + 激活 + 开销            | ~3 GB    |

逐项对比候选量化：

| 量化          | 权重大小    | 262K 装得下吗       |
| ------------- | ----------- | ------------------- |
| FP8           | 30.4 GB     | ❌ 超 2.2GB         |
| NVFP4         | 24.7 GB     | ⚠️ 只剩 3.5GB，太险 |
| **AWQ W4A16** | **19.5 GB** | ✅ 余量 8.7GB       |

选 AWQ。最终生效的配置：

```yaml
# 核心参数
--model-path Ar4ikov/Qwen3.8-27B-AWQ-W4A16-ASYM
--quantization awq
--context-length 262144
--max-total-tokens 262144
--kv-cache-dtype fp8_e5m2
--mem-fraction-static 0.9
# 单卡：没有 --tp，没有任何 NCCL 变量
```

**实测结果：单请求 decode 从 30 → 47.6 tok/s（+59%），262K 上下文完整可用，显存占用 42.5/48GB。**

顺便测了 GPU 功耗上限：空载打满 16K FP16 矩阵乘，GPU 能稳定拉到 449W / P0。而 sglang 服务时只有 134W——说明 decode 根本不是被功耗墙卡住的，**是显存带宽的天花板**，加多少电都没用。这是 4090 跑 LLM 的宿命：decode 阶段每生成一个 token 要把全部权重从显存搬一遍，27B 的 19.5GB 权重在 1TB/s 带宽面前，理论上限就在 50 tok/s 附近。

## 四、MTP：一条被数据证伪的优化

Qwen3.8 自带 MTP（Multi-Token Prediction）头，AWQ 仓库里也附了量化的 `model-mtp.safetensors`。投机解码对 Qwen 系列理论上能加速 1.3~1.8 倍，看起来是白捡的优化。上线：

```
--speculative-algorithm EAGLE
--speculative-draft-model-path Ar4ikov/Qwen3.8-27B-AWQ-W4A16-ASYM
--speculative-num-steps 3
--speculative-eagle-topk 1
--speculative-num-draft-tokens 4
```

服务正常起来了，显存也够。然后看日志：

```
accept len: 1.02 ~ 1.23, accept rate: 0.01 ~ 0.07
gen throughput: 27 ~ 35 tok/s
```

**接受率 2%。** 意思是每猜 3 个草稿 token，主模型平均只认 0.06 个。每次验证都是白干，还倒贴 3 步草稿的开销。结果：

|             | 无 MTP     | 开 MTP               |
| ----------- | ---------- | -------------------- |
| 单流 decode | 47.6 tok/s | **28 tok/s（-41%）** |

回滚。

为什么？MTP 草稿头和主模型**都是 AWQ W4A16 量化**的。投机解码的验证靠对比草稿分布和主模型分布，4-bit 量化引入的 logit 漂移让两个"同一个模型"的打分系统性对不齐——草稿头在量化噪声里自嗨，主模型一票否决。**量化模型上叠投机解码，精度损失是复利的。**

但这个故事没有结束，因为第七节会看到：换一个引擎、换一种 MTP 实现，同样的模型 MTP 接受率到了 46%。问题不在 MTP 本身，在对齐方式。

## 五、同台竞技：NInfer、sglang、llama.cpp

为了找"到底谁快"，我在两台卡上同时跑了三套引擎，同一模型（Qwen3.8-27B 系），同一批 prompt，跑了一场完整的并发阶梯压测（1/2/4/8/16 并发 × 短/长上下文）。先报结果：

### 单请求：NInfer 碾压

| 上下文        | sglang (GPU0, AWQ) | NInfer (GPU1)          |
| ------------- | ------------------ | ---------------------- |
| 短（~15 tok） | 53.1 t/s           | **89.4 t/s（1.68×）**  |
| ~4K           | 52.5 t/s           | **101.2 t/s（1.93×）** |
| ~8.8K         | 51.8 t/s           | **85.8 t/s（1.65×）**  |

NInfer 快在哪？拆开看是三层：

1. **MTP 真的在工作**：它用 `--lm-head-draft`——不训练独立草稿模型，直接用主模型的 LM head 给草稿 token 打分。草稿分布和验证分布天然同源，接受率 **35%~55%**，每验证一轮净赚 1.5 个 token。对比 sglang 上 2% 的接受率，这就是第四节"对齐方式"的答案；
2. **权重更小**：它的量化打包更紧，16.67GB vs sglang 的 19.5GB。decode 是带宽瓶颈，权重每小 1%，速度就大 1%；
3. **KV 更省**：`rk4v4-e8` 4-bit KV，同样 262K 容量，KV 内存只有 sglang FP8 的一半。

### 高并发：sglang 反杀

| 并发 | sglang 聚合吞吐 | NInfer 聚合吞吐 |
| ---- | --------------- | --------------- |
| 1    | 53 t/s          | 61 t/s          |
| 4    | 126 t/s         | 100 t/s         |
| 8    | **305 t/s**     | 94 t/s          |
| 16   | **341 t/s**     | 125 t/s         |

差距大到需要解释一下两者的并发模型：

- **sglang 是连续批处理（continuous batching）**：16 个请求的 decode step 拼在一个 batch 里算，权重只读一遍、大家摊。并发越高，单流速度掉得越慢（16 并发只从 53 掉到 39），聚合吞吐近似线性涨。这是"服务器"；
- **NInfer 是固定槽位串行调度**：`max-concurrency 4`，请求进 4 个槽轮流处理，超过就排队。16 并发时 TTFT 从 1.6s 线性膨胀到 **13.3s（p95 到 19.9s）**，最差一路掉到 5.6 t/s。这是"高配单机"。

**结论很干净**：一个人用，NInfer 快 2 倍；一个服务用，sglang 强 2.5 倍。没有赢家，只有场景。

## 六、 Ternary-Bonsai-2-27B-PTQ1_0：1.75-bit 三元量化完整方案

最后一个实验是最反直觉的。PrismML 出了一套 **PTQ 三值化**方案（Ternary-Bonsai-2-27B）：权重只取 {-1, 0, +1} 三档，**1.75 bit/参数**，整个 27B 模型（26.9B 参数）压到 **5.6GB**——比 AWQ 4-bit 还小 3 倍。

1.75 bit 是什么概念？FP16 是 16 bit，INT8 是 8 bit，AWQ 是 4 bit，它直接干到**不到 2 bit**。理论上这已经是"还能不能算模型"的极限附近。

实测（llama.cpp，单卡 48GB，总显存占用仅 23GB）：

| 上下文                | prefill   | decode       |
| --------------------- | --------- | ------------ |
| 短（~130–860 tok）    | ~820 t/s  | 27 ~ 35 t/s  |
| ~5.7K                 | 1,554 t/s | **87.7 t/s** |
| ~32K                  | 1,531 t/s | 75 t/s       |
| ~40K（拉满 64K slot） | 1,377 t/s | 72 t/s       |

两个结论有点拧巴：

**短上下文，它比 4-bit 还慢。** 27~35 t/s，连 sglang 的 AWQ（53 t/s）都不如。原因在带宽路径：三值权重要么走专门的 ternary kernel，要么先解包成常规格式再算，反量化/重打包的开销在小 batch 下摊不薄。4-bit 至少还有成熟的 `awq_marlin` 这类融合 kernel。

**长上下文，它追上来了。** 上下文越长，decode 的耗时从"读权重"转向"读 KV"，量化格式的影响被稀释，75 t/s @32K 和 NInfer 的 86 t/s 差距收敛到 15%。而 prefill 是它的舒适区——1,500+ t/s 的 prompt 处理，40K 上下文 TTFT 最低 6 秒（KV 命中时）。

还发现一个部署层面的坑：compose 里写了 `-c 262144` 想要 262K 上下文，llama.cpp 默默降到了 **64K**（`n_ctx_slot = 65536`）——4 个并发 slot × 64K 的 KV 预算在 48GB 里刚好到顶。不报错、不警告，`/props` 里看着才发现问题。**"你要的"和"你得到的"之间，永远要自己核对一次。**

另外 llama.cpp 的"并发"值得单独说：`--parallel 4` 是 4 个独立 slot，每个独占 64K KV，新请求来了按 LRU 抢占最老的 slot，**被抢的请求从头重算**。压测里一路 5.7K 的请求被后来的 32K 请求踢掉，decode 从 88 t/s 掉到 8 t/s。这和 sglang 的连续批处理是两种哲学：前者是"公平排队"，后者是"拼车顺风车"，混规模负载下尾延迟差一个数量级。

### 部署方案（可直接复制）

镜像基于 NVIDIA CUDA，从 PrismML 的 llama.cpp 分支编译（该分支带 PTQ 三值 kernel，主线 llama.cpp 认不了这个 gguf）：

```dockerfile
FROM nvidia/cuda:12.8.1-devel-ubuntu22.04

RUN apt-get update && apt-get install -y git cmake build-essential \
    libcurl4-openssl-dev pkg-config ca-certificates \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /opt
RUN git clone --depth 1 https://github.com/PrismML-Eng/llama.cpp.git

WORKDIR /opt/llama.cpp
RUN cmake -B build -DGGML_CUDA=ON -DCMAKE_CUDA_ARCHITECTURES=89 \
        -DCMAKE_BUILD_TYPE=Release \
    && cmake --build build -j$(nproc) --target llama-server llama-cli

EXPOSE 30000
ENTRYPOINT ["/opt/llama.cpp/build/bin/llama-server"]
```

```yaml
services:
  bonsai:
    image: bonsai-2-27b:prismml
    restart: always
    ports:
      - "8188:30000"
    volumes:
      - /path/to/Ternary-Bonsai-2-27B:/models:ro # 5.6GB 的 .gguf
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              device_ids: ["1"] # 挑一张卡
              capabilities: [gpu]
    command:
      - -m
      - /models/Ternary-Bonsai-2-27B-PTQ1_0.gguf
      - --host
      - 0.0.0.0
      - --port
      - "30000"
      - -ngl
      - "99" # 全量上 GPU
      - -c
      - "262144" # 目标 262K（实际生效值看下文"64K 的坑"）
      - -fa
      - "on" # Flash Attention
      - -np
      - "4" # 4 个并发 slot
      - --temp
      - "0.7"
      - --top-p
      - "0.95"
      - --top-k
      - "20"
      - --alias
      - Ternary-Bonsai-2-27B-PTQ1_0
    ulimits:
      memlock: -1
      stack: 67108864
    ipc: host
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:30000/health || exit 1"]
```

三个参数是调优旋钮：

| 参数                   | 默认（本文配置） | 怎么调                                                                                                                                |
| ---------------------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `-np`（slot 数）       | 4                | 想给单请求更大上下文就降：`-np 1` 时全部 KV 预算归一个 slot，单请求才能吃到接近 262K；`-np 4` 换的是 4 路并发，代价是单 slot 只有 64K |
| `-c`（单 slot 上下文） | 262144           | 和 `-np` 联动：`-np × -c` 就是全服务 KV 预算，48GB 卡上 `4 × 64K` 是上限                                                              |
| `-fa`                  | on               | 保持 on，长上下文显存占用差很多                                                                                                       |

### 它适合谁（选型建议）

**选 Ternary-Bonsai 的场景**：

- **同卡混布**：这张卡同时还要跑 ComfyUI、embedding、reranker，只剩 25GB 给你——5.6GB 权重 + 17GB KV，它是唯一能和高显存邻居共存的 27B；
- **长文档单用户分析**：RAG 把几百 K 的语料切成 40K 的块喂给它，prefill 1,500 t/s + decode 72 t/s，单用户完全可用；
- **显存优先于速度**：对延迟不敏感（离线批处理、夜间跑报告），但对显存占用敏感的管道。

**不选它的场景**：

- **高频短对话**：27~35 t/s 的短上下文 decode 是硬伤，同卡 NInfer 快 3 倍；
- **多用户服务**：4 个 LRU slot 的抢占机制扛不住混规模负载的尾延迟，这种活给 sglang；
- **对质量极致敏感**：1.75-bit 是激进的 bit 数，结构化任务实测无退化，但开放式创作、数学推理这类对精度敏感的负载，建议先用你自己的业务数据抽检再上。

一句话定位：**它是"显存维度的方案"，不是"速度维度的方案"。** 23GB 总占用换来 27B 能力 + 64K 上下文，这台机器上所有部署里它最省，短对话场景下它最慢。

## 七、一张 48GB 的账单

把所有数字摆在一起：

| 部署                            | 权重   | 总显存 | 单流 decode | 16 并发聚合 | 最大上下文 |
| ------------------------------- | ------ | ------ | ----------- | ----------- | ---------- |
| sglang + AWQ 4-bit              | 19.5GB | 42.5GB | 53 t/s      | **341 t/s** | 262K       |
| NInfer + 自研量化               | 16.7GB | 23.5GB | **101 t/s** | 125 t/s     | 262K       |
| Ternary-Bonsai（三元 1.75-bit） | 5.6GB  | 23GB   | 35~88 t/s   | 4 slot 上限 | 64K        |

回到最初的问题：这台机器到底能跑多快？**单用户 47~100 tok/s，多用户聚合 340 tok/s，262K 上下文可用。** 对一台 PCIe 互联的 KVM 虚拟机来说，这就是物理天花板了——再往上只有两条路：换有 NVLink 的卡，或者接受更狠的量化。

## 八、如果重来，我会这么做

1. **KVM + 多卡，默认怀疑 P2P**。先看日志里 allreduce 走了哪条路，再谈优化。一条 `NCCL_P2P_DISABLE` 能偷走你 50% 的速度；
2. **单卡 + 4-bit AWQ 是 48GB 卡跑 27B 的甜点**：262K 上下文、47 t/s、42GB 占用，质量损失可忽略；
3. **量化模型上慎开 MTP**。2% 的接受率不是调参问题，是量化噪声问题。除非引擎用 LM head 同源打分（如 NInfer 的 `--lm-head-draft`）；
4. **按场景选引擎，而不是选"最快的"**：个人用选 NInfer 这类高单流引擎，服务化选 sglang 这类连续批处理引擎，极端省显存（同卡还要跑绘图/embedding）选 Ternary-Bonsai 这类 1.75-bit 三元方案；
5. **配置要核对实际生效值**。`-c 262144` 变成 64K 这种事，不会有任何人通知你。

---

_所有数据来自 2026 年 9 月的实测，测试脚本和完整日志留档。模型：Qwen3.8-27B（hybrid 架构，16 层 full-attn + 48 层线性注意力 + MTP 头）。_
