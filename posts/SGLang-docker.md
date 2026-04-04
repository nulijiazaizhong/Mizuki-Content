---
title: 使用docker部署 SGLang并在本地部署 Qwen3.5-35B-A3B
published: 2026-03-15
description: '使用docker部署 SGLang并在本地部署 Qwen3.5-35B-A3B'
image: '/images/posts/SGLang.png'
tags: [SGLang, AI, 本地模型]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 前言
前面不管是直接在本地环境还是使用docker部署了openclaw，一开始使用的是火山的coding plan，不知道因为我使用的是minimax模型的原因，速度很慢，所以就想着本地部署一下，正好朋友那边有2张4090，他也想让我试试看，所以就选择了用SGLang来部署

## 相关地址
1. GitHub：[https://github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
2. 文档：[https://docs.sglang.io/](https://docs.sglang.io/)

## compose文件
```
services:
  sglang:
    image: lmsysorg/sglang:latest
    container_name: sglang
    volumes:
      - ./cache/huggingface:/root/.cache/huggingface
    restart: always
    network_mode: host
    privileged: true
    gpus: all
    environment:
      - HF_TOKEN=<secret>
      - NVIDIA_VISIBLE_DEVICES=all
    entrypoint: python3 -m sglang.launch_server
    command: >
      --model-path Qwen/Qwen3.5-35B-A3B
      --host 0.0.0.0
      --port 30000
      --tp 2
      --trust-remote-code
      --tool-call-parser qwen3_coder
      --context-length 262144
      --max-total-tokens 262144
    ulimits:
      memlock: -1
      stack: 67108864
    ipc: host
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:30000/health || exit 1"]
```
### 注释
```
# ================= SGLang 推理服务部署配置 =================
# 用于在本地或服务器上快速部署 SGLang LLM 推理服务
# 目标模型：Qwen/Qwen3.5-35B-A3B (需确保显存足够)

services:
  # 服务名称
  sglang:
    # Docker 镜像名称及标签
    image: lmsysorg/sglang:latest
    # 指定容器名称，便于管理
    container_name: sglang

    # 卷挂载：将 HuggingFace 模型缓存目录挂载到宿主机
    # 避免每次容器重启都重新下载几十 GB 的模型文件
    volumes:
      - ./cache/huggingface:/root/.cache/huggingface

    # 容器重启策略：如果容器意外退出或宿主机重启，自动重启
    restart: always

    # 网络模式：使用 host 网络
    # 效果：容器端口直接暴露给宿主机，无需端口映射，性能更好
    network_mode: host

    # 特权模式：给予容器更高的权限
    # 注意：通常用于访问底层硬件或需要特定内核功能（此处建议仅在实际需要时开启）
    privileged: true

    # GPU 分配：使用所有可用的 NVIDIA GPU
    gpus: all

    # 环境变量配置
    environment:
      # HuggingFace 访问令牌 (需替换为真实 Token)
      # 用于下载私有模型或大文件
      - HF_TOKEN=<secret>
      # 限制容器可见的 GPU 设备 (通常与 gpus: all 配合，确保驱动可见)
      - NVIDIA_VISIBLE_DEVICES=all

    # 容器启动入口：执行 Python 模块模式启动 SGLang
    entrypoint: python3 -m sglang.launch_server

    # 启动命令参数：详细配置推理服务
    command: >
      # 模型路径 (HuggingFace 上的模型 ID)
      --model-path Qwen/Qwen3.5-35B-A3B

      # 监听地址 (0.0.0.0 允许外部访问)
      --host 0.0.0.0
      
      # 服务端口
      --port 30000

      # 张量并行度 (TP)
      # 如果有多张卡，建议设置 TP 等于卡数 (例如 2 卡则 TP 2)
      # 请确保 TP 数值不超过实际 GPU 数量
      --tp 2

      # 信任远程代码 (HuggingFace 模型常需此参数)
      --trust-remote-code

      # 工具调用解析器 (配合 Qwen 的特定格式)
      --tool-call-parser qwen3_coder

      # 上下文长度 (Token 数量)
      # 35B 模型通常能处理较长的上下文，但消耗显存巨大
      --context-length 262144
      
      # 最大总 Token 数
      --max-total-tokens 262144

    # 系统资源限制 (System Limits)
    # LLM 推理通常需要共享内存和较大的栈空间
    ulimits:
      # 共享内存限制：不限制，防止 PyTorch/CUDA 共享内存报错
      memlock: -1
      # 栈大小：64MB (默认通常较小，LLM 需更大栈空间)
      stack: 67108864

    # 进程间通信 (IPC)：使用宿主机命名空间
    # 关键配置：多进程或分布式推理时，确保 IPC 正确共享
    ipc: host

    # 健康检查配置
    healthcheck:
      # 检查脚本：每秒/每 5 秒尝试 curl 请求健康端点
      # 如果返回非 200 状态码，标记为 unhealthy
      test: ["CMD-SHELL", "curl -f http://localhost:30000/health || exit 1"]
      # 可选配置：启动前等待时间、重试次数、失败阈值等
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 60s

# ================= 注意事项 =================
# 1. 显存要求：Qwen3.5-35B-A3B 精度通常较大，建议至少 4 张 24G 或 2 张 48G A100/H800
# 2. TP 设置：请根据实际 GPU 数量修改 command 中的 --tp 参数
# 3. 权限问题：宿主机需要安装 NVIDIA Container Toolkit 才能正确识别 gpus: all
# 4. 缓存目录：确保宿主机 ./cache/huggingface 目录存在且有权写入
```
:::warning
该注释都本地部署的 Qwen3.5-35B-A3B 生成，如有不对欢迎指正
:::

## 参考资料
1. [SGLang文档](https://docs.sglang.io/)