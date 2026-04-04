---
title: Easytier+webui+istore实现子网代理
published: 2026-03-31
description: '使用Easytier+自建web控制台配合istore实现子网代理为异地访问提供方便'
image: '/images/posts/Easytier+webui.png'
tags: [Docker,组网]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 前言
前面已经通过部署Easytier+Astral实现了组网，但是这种方式需要给每台链接的机器都安装Astral，windows还好一点，但是Ubuntu一直有ui闪烁的bug，所以用着不是很爽，然后我大部分Ubuntu都是通过ssh连接，不装desktop就需要使用frp来实现，但是公网访问始终不是很安全，前几天逛Easytier的交流群看到有群友说可以用子网代理，于是就想着试试看，但是当我想进行部署的时候发现官方的web控制台已经关闭了，所以只能自建web控制台了

## 相关地址
1. GitHub：[https://github.com/EasyTier/EasyTier](https://github.com/EasyTier/EasyTier)
2. 官网：[https://easytier.cn/guide/introduction.html](https://easytier.cn/guide/introduction.html)

## 部署
还是和之前一样直接一个compose文件完成部署
docker-compose.yml文件
```
services:
  easytier-web:
    image: easytier/easytier:latest
    container_name: easytier-web
    restart: always
    network_mode: host  # 使用主机网络，注意：host模式下ports映射不生效
    labels:
      com.centurylinklabs.watchtower.enable: 'true'  # 启用watchtower自动更新
    entrypoint: easytier-web-embed
    command:
      - "-a"
      - "12121"    # web网页打开端口
      - "-l"
      - "12121"    # web网页里面的api端口，注册和验证码需要
      - "-c"
      - "21212"    # web服务端给设备下发信息用的端口，也是设备连接web用的端口，使用方式看最后一段

  watchtower:  # 用于自动更新easytier镜像，若不需要请删除这部分
    image: containrrr/watchtower
    container_name: watchtower
    restart: unless-stopped
    environment:
      - TZ=Asia/Shanghai
      - WATCHTOWER_NO_STARTUP_MESSAGE
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
    command: --interval 3600 --cleanup --label-enable

  easytier:
    image: easytier/easytier:latest  # 国内用户可以使用 m.daocloud.io/docker.io/easytier/easytier:latest
    hostname: "aliyun-vm"  # web端显示的设备名字，可自行修改
    container_name: easytier
    labels:
      com.centurylinklabs.watchtower.enable: 'true'  # 启用watchtower自动更新
    restart: unless-stopped
    network_mode: host
    cap_add:
      - NET_ADMIN
      - NET_RAW
    environment:
      - TZ=Asia/Shanghai
    devices:
      - /dev/net/tun:/dev/net/tun
    volumes:
      - /etc/easytier:/root
      - /etc/machine-id:/etc/machine-id:ro  # 映射宿主机机器码
    command: --config-server udp://127.0.0.1:21212/admin  # 修改为自己的IP地址和注册账号
```
部署完成之后访问 ip:12121 打开web控制台，首次进入控制台需要注册账号，之后添加网络就行了
具体添加方式和Easytier-gui一样，等有时间再补；

## istore
我在Easytier的GitHub仓库里面发现了可以用来安装在openwrt上的包，然后我就想istore是根据openwrt魔改而来的，是不是也能用呢，于是我这抱着试一试的态度，结果还真让安装我成功了
:::tip
istore安装之后要重新打开网页并且等待一段时间，然后就会出现VPN的选项卡，在里面配置就行了，最重要的就是要在 `子网代理` 那一栏里面填写 `x.x.x.0/24` 

## windows
一开始我windows是用的Easytier-gui，但是每次当我需要用的时候才发现我没有打开，于是我就想着能不能开机自启，在[官方文档](https://easytier.cn/guide/network/install-as-a-windows-service.html)里面找到了方法

## 总结
综上我就基本实现了Easytier的无感使用了

## 参考文献
1. [Easytier官网](https://easytier.cn/guide/introduction.html)