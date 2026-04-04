---
title: OpenClaw docker部署
published: 2026-03-02
description: '在Ubuntu-25.10-Desktop 系统上使用docker安装 OpenClaw 全流程'
image: '/images/posts/openclaw-install.png'
tags: [Openclaw, AI, 个人助理]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 相关地址
1. 官方：[OpenClaw — Personal AI Assistant](https://openclaw.ai/)
2. GitHub仓库：[GitHub - openclaw/openclaw: Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞](https://github.com/openclaw/openclaw)


## 部署
docker-compose.yml
```
services:
  openclaw:
    image: ghcr.nju.edu.cn/openclaw/openclaw:latest
    container_name: openclaw-1
    restart: always
    user: "0:0"
    ports:
      - "3000:3000"
      - "18789:18789"
    volumes:
      - ./config:/root/.openclaw
      - ./logs:/app/logs
      - /home/wenjian:/app/data
    environment:
      # 使用生产模式运行openclaw
      - NODE_ENV=production
    shm_size: "1gb"
    ulimits:
      nproc: 65535
      nofile:
        soft: 65535
        hard: 65535
```
:::tip
所有以openclaw 开头的命令都需要在容器内执行，且在执行到需要重启网关的命令时会自动退出容器，所以该方法不建议使用
:::