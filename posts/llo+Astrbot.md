---
title: 'LLBot+Astrbot'
published: 2026-04-03
#updated: 2026-02-12
description: '使用LLBot+Astrbot完成QQ 机器人搭建教程'
image: '/images/posts/LLBot.png'
tags: [QQ, Bot, Docker]
category: '教程'
draft: false
lang: 'zh-CN'
---

## 前言
前面使用 `napcat+Astral` 实现了QQ机器人的搭建，但是最近机器人账号经常出现掉线/需要身份验证的情况（不知道是不是 OpenClaw 热度带来的影响），在朋友的建议下我接触到了LLBot这个框架，所以就来试试看。

## 相关地址：
- LLBot：
1. GitHub：[https://github.com/LLOneBot/LuckyLilliaBot](https://github.com/LLOneBot/LuckyLilliaBot)
2. 官网：[https://luckylillia.com/](https://luckylillia.com/)

- Astrbot
1. GitHub：[https://github.com/AstrBotDevs/AstrBot](https://github.com/AstrBotDevs/AstrBot)
2. 官网：[https://astrbot.app/](https://astrbot.app/)

## 部署
还是一样，直接就是compose文件
```
services:
  pmhq:
    image: linyuchen/pmhq:latest
    privileged: true
    environment:
      - ENABLE_HEADLESS=false
    networks:
      - app_network
    volumes:
      - ./qq_data:/root/.config/QQ
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:13000/health"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  llbot:
    image: linyuchen/llbot:latest
    container_name: llbot
    ports:
      - "3001:3001"
    extra_hosts:
      - "host.docker.internal:host-gateway"
    environment:
      - PMHQ_HOST=pmhq
      - WEBUI_PORT=3001
    networks:
      - app_network
    volumes:
      - ./qq_data:/root/.config/QQ
      - ./llbot_config:/app/llbot/data
    depends_on:
      - pmhq
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "sh", "-c", "ps | grep '[n]ode'"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 40s

  astrbot:
    image: soulter/astrbot:latest
    container_name: astrbot
    restart: always
    ports:
      - "6185:6185"
      - "6199:6199"
    environment:
      - TZ=Asia/Shanghai
    networks:
      - app_network
    volumes:
      - ./astrbot_data:/AstrBot/data

networks:
  app_network:
    driver: bridge
```

## 配置
### LLbot
1. docker运行完成之后先打开 ip:3001，先设置一下webui的访问密钥
![](https://tuchuang.goodnightan.com/PicGo/20260404100358786.png)

2. 然后使用机器人QQ扫码进行登录
![](https://tuchuang.goodnightan.com/PicGo/20260404100449275.png)

3. 然后进入到 `OneBot 11` ，并选择 `WebSocket反向`
![](https://tuchuang.goodnightan.com/PicGo/20260404100559719.png)

4. 将 `启用此适配器` 后面的开关打开，在 `连接地址` 中输入 `ws://astrbot:6199/ws` ，其余保持不变并点击保存
![](https://tuchuang.goodnightan.com/PicGo/20260404100713702.png)

### Astrbot
1. LLbot设置完成之后打开 ip:6185，先修改密码

2.点击 `机器人` ，再点击 `创建机器人` ，`消息类别平台` 选择 OneBot v11，将 `反向 Websocket 主机 ` 修改为 **astrbot** 即可
![](https://tuchuang.goodnightan.com/PicGo/20260404101057255.png)

## 总结
LLbot相对于Napcat，配置相对更复杂一些，对新手不是很友好