---
title: docker部署open-webui
published: 2026-04-02
description: '使用docker部署open-webui'
image: '/images/posts/open-webui.png'
tags: [Docker,ai]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 前言
前面不是用SGLang在本地部署了Qwen3.5-35B-A3B，于是就想着能不能用前端来使用api，最后我找到了open-webui

## 相关地址
1. GitHub：[https://github.com/open-webui/open-webui](https://github.com/open-webui/open-webui)
2. 官网：[https://openwebui.com/](https://openwebui.com/)

## 部署
还是话不多说，直接上compose文件
```
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    volumes:
      - ./open-webui:/app/backend/data
    ports:
      - "8080:8080"
    environment:
      ENABLE_OLLAMA_API: "false"
      ENABLE_OPENAI_API: "true"
      OPENAI_API_BASE_URL: "https://127.0.0.1:30000/v1"
      OPENAI_API_KEY: "openwebui123456"
      DATABASE_URL: "postgresql://postgres:openwebui123456@db:5432/openwebui"
      REDIS_URL: "redis://:openwebui123456@redis:6379/0"
      ENABLE_WEBSOCKET_SUPPORT: "true"
      WEBSOCKET_MANAGER: "redis"
      WEBSOCKET_REDIS_URL: "redis://:openwebui123456@redis:6379/0"
      GLOBAL_LOG_LEVEL: "INFO"
      UVICORN_WORKERS: "1"
      ENV: "prod"
      ENABLE_API_KEY: "true"
      OFFLINE_MODE: "false"
    extra_hosts:
      - host.docker.internal:host-gateway
    restart: unless-stopped
    depends_on:
      - db
      - redis
  db:
    image: postgres:15-alpine
    restart: always
    environment:
      TZ: Asia/Shanghai
      POSTGRES_PASSWORD: "openwebui123456"
      POSTGRES_DB: "openwebui"
    volumes:
      - ./db/data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD", "pg_isready"]
      interval: 1s
      timeout: 3s
      retries: 30
  redis:
    image: valkey/valkey:8-alpine
    restart: always
    volumes:
      - ./redis/data:/data
    command: ["valkey-server", "--requirepass", "openwebui123456"]
    healthcheck:
      test: ["CMD", "valkey-cli", "-a", "openwebui123456", "ping"]
      start_period: 5s
      interval: 1s
      timeout: 3s
      retries: 5
```
:::tip
因为open-webui需要从huggingfance上下载模型，所以推荐最好在有魔法的环境下进行部署，这样可以减少很多报错；当然，也可以现在本地配置完，然后在把整个文件上传到云服务器上
:::

## 使用
因为我也是刚部署，还没体验多久，所以暂时没什么好的可以分享


## 参考文章
1. [适用于生产环境部署 open-webui 的 docker compose 配置](http://butui.me/posts/production-docker-compose-configuration-for-open-webui/)