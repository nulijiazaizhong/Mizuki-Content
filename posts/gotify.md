---
title: 使用Gotify搭建消息推送服务器
published: 2025-11-01
description: '使用Gotify搭建消息推送服务器的教程'
image: '/images/posts/gotify.png'
tags: [gotify, 消息推送服务器]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 1. 背景
前面我部署了Element的核心 matrix，但是最近使用中我发现手机端并不能即使的收到通知，哪怕是锁定后台，手动调整电池策略也不行，所以我就有了更换的打算，正好在B站刷到了up [秦曱凧](https://space.bilibili.com/17547201) 的 [nas上使用docker部署知名消息推送服务gotify中文版](https://www.bilibili.com/video/BV12vxQz6E3M/) 这期视频，我发现 [gotify](https://gotify.net/) 真好可以解决Element的不足，于是便有了部署的打算

## 2. 相关链接
官网：[Gotify · a simple server for sending and receiving messages](https://gotify.net/)
官方文档：[Intro · Gotify](https://gotify.net/docs/)
GitHub：[Gotify · GitHub](https://github.com/gotify/)

## 3. 部署
### compose文件
```
services:
  gotify:
    image: gotify/server
    container_name: gotify
    ports:
      - "8080:80"  # 如果8080端口已被占用，可改成其它空闲端口，例如 8081:80
    environment:
      # Gotify 默认管理员用户名（首次启动时生效）
      - GOTIFY_DEFAULTUSER_NAME=goodnightan

      # Gotify 默认管理员密码（首次启动时生效）
      - GOTIFY_DEFAULTUSER_PASS=goodnightan
    volumes:
      - "./data:/app/data"  # 将数据持久化到本地目录 ./gotify_data
    restart: unless-stopped  # 除非手动停止，否则容器会自动重启
    # 如果希望以特定用户身份运行（可选）
    # 先执行：sudo chown -R 1234:1234 ./gotify_data
    # user: "1234:1234"
```

:::tip
默认管理员用户名和密码只在首次启动容器时生效，后续再启动将不再生效
:::

## 4. 使用
容器启动之后通过反向代理来实现域名访问，在登录界面输入用户名和密码之后优先修改密码，然后点击到app中创建 app