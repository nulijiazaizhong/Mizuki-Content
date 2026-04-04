---
title: Easytier+Astral实现虚拟组网
published: 2025-09-22
description: 'Easytier+Astral的优雅组网方式'
image: '/images/posts/easytier-astral.png'
tags: [Docker,组网]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 1. 介绍
Easytier+Astral是一种基于Easytier和Astral Game的虚拟组网方案，它可以帮助用户在不同的网络环境中实现安全、稳定的通信。

## 2. 项目地址
### GitHub：
- [Easytier](https://github.com/easytier/easytier)
- [Astral Game](https://github.com/ldoubil/astral)

### 官网
- [Easytier](https://easytier.cn/)
- [Astral Game](https://astral.fan/)

## 3. docker部署Easytier
docker-compose.yml文件
```
services:
  easytier:
    container_name: easytier            # 容器名称
    image: easytier/easytier:latest     # 使用的镜像（latest 标签）
    restart: always                     # 设置容器自动重启策略
    privileged: true                    # 启用特权模式，允许容器执行更多系统操作
    network_mode: host                  # 使用主机网络模式（共享主机网络）
    hostname: easytier                  # 设置容器的主机名
    volumes:
      - ./config:/root             # 挂载主机目录 ./config 到容器内 /root
    environment:
      - TZ=Asia/Shanghai                # 设置容器时区为上海
    command: -c /root/config.toml       # 从config.yaml配置文件启动
```
需要在 `docker-compose.yml` 同级目录下创建一个 config文件夹，在config文件夹内创建 `config.toml` 文件

config.toml文件
```
hostname = "随意填写" #更改想要的服务器名称,留空将随机生成
dhcp = true
listeners = [
    "tcp://0.0.0.0:11010",
    "udp://0.0.0.0:11010",
]
rpc_portal = "127.0.0.1:15888"

#启用私人模式，需配置[network_identity]；开启私人模式后只有按照配置文件中的填写才能创建房间，否则无法创建房间
private_mode = false

[network_identity]
network_name = ""
network_secret = ""

[flags]
enable_kcp_proxy = true
enable_quic_proxy = true
latency_first = true

```

## 4. Astral Game
1. 前往[官方网站](https://astral.fan/quick-start/download-install/)下载适合自己的客户端
2. 软件设置
	1. 设置-网络设置-延迟优先勾选上
	   ![](https://tuchuang.goodnightan.com/PicGo/20250925161948.png)
	2. 在服务器页面添加上服务器信息（确保服务器以启用）
	   ![](https://tuchuang.goodnightan.com/PicGo/20250925162056.png)
	3. 创建房间（取消勾选 `是否保护` ，并填写配置信息，如果你开Easytier中启用了私人模式，则内容应与配置信息相对应）
	   ![](https://tuchuang.goodnightan.com/PicGo/20250925162226.png)
	4. 主页-防火墙关闭掉，然后连接即可
	   ![](https://tuchuang.goodnightan.com/PicGo/20250925162312.png)