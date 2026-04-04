---
title: 'QQ 机器人'
published: 2025-08-27
updated: 2026-02-12
description: 'QQ 机器人搭建教程'
image: '/images/posts/qqbot.png'
tags: [QQ, Bot, Docker]
category: '教程'
draft: false
lang: 'zh-CN'
---

## 开源项目

Astrbot项目地址：[GitHub - AstrBotDevs/AstrBot: ✨ 易上手的多平台 LLM 聊天机器人及开发框架 ✨ 支持 QQ、QQ频道、Telegram、企微、飞书、钉钉 \| 知识库、MCP 服务器、OpenAI、DeepSeek、Gemini、硅基流动、月之暗面、Ollama、OneAPI、Dify](https://github.com/AstrBotDevs/AstrBot)  
napcat项目地址：[GitHub - NapNeko/NapCatQQ: Modern protocol-side framework based on NTQQ](https://github.com/NapNeko/NapCatQQ)

## 准备工作

安装docker以及docker-compose
可以使用  docker 官方命令，也可以使用1panel命令

 docker 官方命令（需要特殊环境）

```
curl -fsSL https://get.docker.com | bash
```

使用1panel安装命令一键完成docker的安装

```
bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
```

具体安装过程

```
root@web:~# bash -c "$(curl -sSL https://resource.fit2cloud.com/1panel/package/v2/quick_start.sh)"
开始下载 1Panel v2.0.9 版本在线安装包
安装包下载地址： https://resource.fit2cloud.com/1panel/package/v2/stable/v2.0.9/release/1panel-v2.0.9-linux-amd64.tar.gz
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
100 41.9M  100 41.9M    0     0  2372k      0  0:00:18  0:00:18 --:--:-- 2276k
Warning: Got more output options than URLs
1panel-v2.0.9-linux-amd64/1panel-agent.service
1panel-v2.0.9-linux-amd64/1panel-core.service
1panel-v2.0.9-linux-amd64/1pctl
1panel-v2.0.9-linux-amd64/GeoIP.mmdb
1panel-v2.0.9-linux-amd64/install.sh
1panel-v2.0.9-linux-amd64/lang/en.sh
1panel-v2.0.9-linux-amd64/lang/fa.sh
1panel-v2.0.9-linux-amd64/lang/pt-BR.sh
1panel-v2.0.9-linux-amd64/lang/ru.sh
1panel-v2.0.9-linux-amd64/lang/zh.sh
1panel-v2.0.9-linux-amd64/1panel-agent
1panel-v2.0.9-linux-amd64/1panel-core
Select a language:
1. English
2. Chinese  中文(简体)
3. Persian
4. Português (Brasil)
5. Русский
Enter the number corresponding to your language choice: 2
```

在这里输入 2

```
 ██╗    ██████╗  █████╗ ███╗   ██╗███████╗██╗     
███║    ██╔══██╗██╔══██╗████╗  ██║██╔════╝██║     
╚██║    ██████╔╝███████║██╔██╗ ██║█████╗  ██║     
 ██║    ██╔═══╝ ██╔══██║██║╚██╗██║██╔══╝  ██║     
 ██║    ██║     ██║  ██║██║ ╚████║███████╗███████╗
 ╚═╝    ╚═╝     ╚═╝  ╚═╝╚═╝  ╚═══╝╚══════╝╚══════╝
[1Panel Log]: ======================= 开始安装 ======================= 
设置 1Panel 安装目录 (默认为 /opt): 
[1Panel Log]: 您选择的安装路径是 /opt 
检测到未安装 Docker，是否安装 [y/n]: y
[1Panel Log]: ... 在线安装 Docker 
[1Panel Log]: 无需更改源 
# Executing docker install script, commit: bedc5d6b3e782a5e50d3d2a870f5e1f1b5a38d5c
+ sh -c apt-get -qq update >/dev/null
+ sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install ca-certificates curl >/dev/null
+ sh -c install -m 0755 -d /etc/apt/keyrings
+ sh -c curl -fsSL "https://download.docker.com/linux/debian/gpg" -o /etc/apt/keyrings/docker.asc
+ sh -c chmod a+r /etc/apt/keyrings/docker.asc
+ sh -c echo "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/debian bookworm stable" > /etc/apt/sources.list.d/docker.list
+ sh -c apt-get -qq update >/dev/null
+ sh -c DEBIAN_FRONTEND=noninteractive apt-get -y -qq install docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-ce-rootless-extras docker-buildx-plugin docker-model-plugin >/dev/null
+ sh -c docker version
Client: Docker Engine - Community
 Version:           28.3.3
 API version:       1.51
 Go version:        go1.24.5
 Git commit:        980b856
 Built:             Fri Jul 25 11:34:00 2025
 OS/Arch:           linux/amd64
 Context:           default

Server: Docker Engine - Community
 Engine:
  Version:          28.3.3
  API version:      1.51 (minimum version 1.24)
  Go version:       go1.24.5
  Git commit:       bea959c
  Built:            Fri Jul 25 11:34:00 2025
  OS/Arch:          linux/amd64
  Experimental:     false
 containerd:
  Version:          1.7.27
  GitCommit:        05044ec0a9a75232cad458027ca83437aae3f4da
 runc:
  Version:          1.2.5
  GitCommit:        v1.2.5-0-g59923ef
 docker-init:
  Version:          0.19.0
  GitCommit:        de40ad0

================================================================================

To run Docker as a non-privileged user, consider setting up the
Docker daemon in rootless mode for your user:

    dockerd-rootless-setuptool.sh install

Visit https://docs.docker.com/go/rootless/ to learn about rootless mode.


To run the Docker daemon as a fully privileged service, but granting non-root
users access, refer to https://docs.docker.com/go/daemon-access/

WARNING: Access to the remote API on a privileged Docker daemon is equivalent
         to root access on the host. Refer to the 'Docker daemon attack surface'
         documentation for details: https://docs.docker.com/go/attack-surface/

================================================================================

[1Panel Log]: ... 启动 Docker 
Synchronizing state of docker.service with SysV service script with /lib/systemd/systemd-sysv-install.
Executing: /lib/systemd/systemd-sysv-install enable docker
[1Panel Log]: Docker 安装成功 
设置 1Panel 端口 (默认是 29597): 
```

设置端口，如果你需要使用1panel则继续，如果不需要则直接 `ctrl+c` 退出即可

## 安装

进入任意目录，这里以home目录为例

```
cd /home
```

创建文件夹以及进入到文件夹中

```
cd /home
mkdir qqbot
cd qqbot
```

创建docker-compose.yml文件

```
nano docker-compose.yml
```

会跳转一个新的页面，复制下面的内容，然后按 `ctrl+x` 退出，按 `y` 保存，最后按回车确定即可

```
# docker-compose.yml
# NAPCAT_UID=$(id -u) NAPCAT_GID=$(id -g) docker-compose -f ./compose/astrbot.yml up -d
services:
  napcat:
    environment:
      - NAPCAT_UID=${NAPCAT_UID:-1000}
      - NAPCAT_GID=${NAPCAT_GID:-1000}
      - MODE=astrbot
    ports:
      - 6099:6099
    container_name: napcat
    restart: always
    image: mlikiowa/napcat-docker:latest
    volumes:
      - ./data:/AstrBot/data
      - ./ntqq:/app/.config/QQ
    networks:
      - astrbot_network
    mac_address: "02:42:ac:11:00:02"
  astrbot:
    environment:
      - TZ=Asia/Shanghai
    image: soulter/astrbot:latest
    container_name: astrbot
    restart: always
    ports:
      - "6185:6185"
      - "6195:6195"
      - "6199:6199"
    volumes:
      - ./data:/AstrBot/data
      - ./napcat/config:/app/napcat/config
      - ./ntqq:/app/.config/QQ
    networks:
      - astrbot_network
networks:
  astrbot_network:
    driver: bridge
```

最后运行docker compose up -d

![](https://tuchuang.goodnightan.com/PicGo/20250819195844.png)

出现最后的 `Crearted` 和 `started` 就表明运行起来了

## 配置机器人

### 配置napcat

输入 `docker logs -f napcat` 来获取token

```
02-12 21:45:55 [info] [FFmpeg] 检查 Native Addon 可用性...
02-12 21:45:55 [info] [FFmpeg] ✓ 使用 Native Addon 适配器
prepare write and writev hooks
02-12 21:45:56 [info] [PacketHandler] 加载成功
02-12 21:45:56 [info] [PacketHandler] 初始化成功
02-12 21:45:56 [info] [NapCat] [Core] NapCat.Core Version: 4.16.0
02-12 21:45:56 [info] 等待网络连接...
02-12 21:45:56 [info] [NapCat] [WebUi] WebUi Token: 15e97279f990
02-12 21:45:56 [info] [NapCat] [WebUi] WebUi User Panel Url: http://127.0.0.1:6099/webui?token=15e97279f990
02-12 21:45:56 [info] [NapCat] [WebUi] WebUi User Panel Url: http://[::]:6099/webui?token=15e97279f990
02-12 21:45:56 [info] 网络已连接
02-12 21:45:56 [info] 没有 -q 指令指定快速登录，将使用二维码登录方式
02-12 21:45:56 [warn] 请扫描下面的二维码，然后在手Q上授权登录：
```

看到 `WebUi Token` 就将冒号后面的复制出来

打开浏览器，在浏览器中输入ip:6099之后，输入刚刚复制出来的token就可以看到让我们登录qq了，第一次我们使用扫码的方式登录，登录之后除了密码之外什么都不要改；

### 配置Astrbot

接着我们在浏览器中输入ip:6185,就能看到Astrbot的控制台，默认账户密码均为：astrbot，进去之后我们点击`机器人`，点击`创建机器人`

![](https://tuchuang.goodnightan.com/PicGo/20260212215620.png)

选择`OneBot v11`，将启用的开关打开，修改第三个`反向 Websocket 主机`，将`0.0.0.0`修改为`astrbot`，6199与docker-compose.yml中的6199对应，如果你修改了，这里也要修改为一样的

![](https://tuchuang.goodnightan.com/PicGo/20260212215738.png)

然后点击左侧的控制台，应该就能看到连接成功了，这时我们可以想作为机器人的qq发送 /help指令来检查

Astrbot 默认账户密码均为：astrbot
