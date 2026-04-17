---
title: '使用 docker 部署 Hermes'
published: 2026-04-17
#updated: 2026-02-12
description: '在Ubuntu 25.10 中用 docker 安装 Hermes 并对接飞书'
image: '/images/posts/Hermes-docker-install.png'
tags: [Hermes, docker, AI, 个人助理]
category: '教程'
draft: false
lang: 'zh-CN'
---

## 前言
前一篇文章讲了如何在ubuntu上进行部署，今天就来讲一下用docker怎么部署
## 2. 相关地址：
GitHub仓库：[GitHub - NousResearch/hermes-agent: The agent that grows with you · GitHub](https://github.com/NousResearch/hermes-agent)
官网：[Hermes Agent — An Agent That Grows With You \| Nous Research](https://hermes-agent.nousresearch.com/)

## 3. 环境
这里简单介绍一下我使用的环境
- PVE 9.1.4（虚拟化平台）
- istoreOS 24.10.5 2025123110（软路由）
- Ubuntu 25.10 minstall（系统）
- ip：HK（归属地）
- HexHub（SSH软件）
- root（登录用户）
- Docker version 29.4.0, build 9d7ad9f
- Docker Compose version v5.1.3
## 4. 部署
### 4.1 compose文件
1. 无Web UI 
```
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes
    restart: unless-stopped
    command: gateway run
    volumes:
      - ./data:/opt/data
    networks:
      - hermes-net
    # 环境变量（取消注释并按需填写）
    # environment:
    #   - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    #   - OPENAI_API_KEY=${OPENAI_API_KEY}
    #   - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"
    privileged: false
    security_opt:
      - "no-new-privileges=true"
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "3"

networks:
  hermes-net:
    driver: bridge
```
2. 有 Web UI
```
services:
  hermes:
    image: nousresearch/hermes-agent:latest
    container_name: hermes
    restart: unless-stopped
    command: gateway run
    ports:
      - "8642:8642"
    volumes:
      - ./data:/opt/data
    networks:
      - hermes-net
    # 环境变量（取消注释并按需填写）
    # environment:
    #   - ANTHROPIC_API_KEY=${ANTHROPIC_API_KEY}
    #   - OPENAI_API_KEY=${OPENAI_API_KEY}
    #   - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
    deploy:
      resources:
        limits:
          memory: 4G
          cpus: "2.0"
    privileged: false
    security_opt:
      - "no-new-privileges=true"
    logging:
      driver: "json-file"
      options:
        max-size: "100m"
        max-file: "3"

  dashboard:
    image: nousresearch/hermes-agent:latest
    container_name: hermes-dashboard
    restart: unless-stopped
    command: dashboard --host 0.0.0.0 --insecure 
    ports:
      - "9119:9119"
    volumes:
      - ./data:/opt/data
    environment:
      - GATEWAY_HEALTH_URL=http://hermes:8642
    networks:
      - hermes-net
    depends_on:
      - hermes
    deploy:
      resources:
        limits:
          memory: 512M
          cpus: "0.5"

networks:
  hermes-net:
    driver: bridge
```
输入 `docker compose up -d` 运行容器
### 4.2 初始化 Hermes
使用下面的命令进入到容器内并进行初始化
```
docker exec -it hermes /bin/bash

 ./setup-hermes.sh
```
![](https://tuchuang.goodnightan.com/PicGo/20260417105353126.png)
当出现这样的页面时开始初始化
![](https://tuchuang.goodnightan.com/PicGo/20260417105710400.png)
#### 4.2.1设置方式
等安装的进度条跑完之后会自动来到初始化界面，这里选择 `Quick setup` 
![](https://tuchuang.goodnightan.com/PicGo/20260416210557480.png)
#### 4.2.2 选择模型
到了模型选择这里，因为我有minimax的coding plan，所以我选择了**MiniMax China**，接着输入api key就行了，URL选择默认的就行
![](https://tuchuang.goodnightan.com/PicGo/20260416210816919.png)
:::tip
有些SSH软件在输入api key的时候不会显示，只要确保复制了就行`
:::

#### 4.2.3 平台对接
我这边以飞书为例进行对接
![](https://tuchuang.goodnightan.com/PicGo/20260416211129417.png)
平台里面选择 **Feishu / Lark** 
![](https://tuchuang.goodnightan.com/PicGo/20260417110010856.png)
选择直接扫码
![](https://tuchuang.goodnightan.com/PicGo/20260416211409235.png)
因为缺少依赖，所以会给链接，直接把链接复制到浏览器进行打开
![](https://tuchuang.goodnightan.com/PicGo/20260416211501861.png)
通过网页可以看出来用的还是飞书OpenClaw的接口
![](https://tuchuang.goodnightan.com/PicGo/20260416211531374.png)
然后就来到了 **私信授权** ，出于安全考虑我肯定是推荐选择第一个的，第二个是允许所有用户，第三个就是白名单
![](https://tuchuang.goodnightan.com/PicGo/20260416211707519.png)
接下来就到了群组了，我还是一样选择第一个，只有@机器人时才进行对话，第二个是禁用群组
![800](https://tuchuang.goodnightan.com/PicGo/20260416211823423.png)
然后会问你 Home chat ID，这里直接回车就可以了，后面可以通过指令 `/sethoem` 来进行设置
![](https://tuchuang.goodnightan.com/PicGo/20260416211912140.png)
接着会问你是否将网关注册为系统服务，这边直接输入Y就行
![](https://tuchuang.goodnightan.com/PicGo/20260416212009566.png)
接着就是选择，我这边因为是Ubuntu，所以肯定是选择第二个系统服务，输入用户名
![](https://tuchuang.goodnightan.com/PicGo/20260416212132213.png)
![](https://tuchuang.goodnightan.com/PicGo/20260416212254142.png)
然后会问你是否现在启动服务
![](https://tuchuang.goodnightan.com/PicGo/20260416212326680.png)
最后会问你是否现在就开始对话，输入y会直接打开对话框，输入N就直接结束初始化
![](https://tuchuang.goodnightan.com/PicGo/20260416212407463.png)
初始化完成之后需要先退出并关闭容器，对文件权限进行修改
![](https://tuchuang.goodnightan.com/PicGo/20260417110507452.png)
使用 `chmod 777 /home/123` 给权限 
打开 .env 将 `GATEWAY_ALLOW_ALL_USERS` 从 false 改为 true
```
GATEWAY_ALLOW_ALL_USERS=true
```
::: tip
不想修改 `GATEWAY_ALLOW_ALL_USERS` 需要使用下面的命令
```
source /opt/hermes/.venv/bin/activate

hermes pairing approve feishu XXXXXXX
```
:::