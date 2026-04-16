---
title: 'Hermes 的安装'
published: 2026-04-16
#updated: 2026-02-12
description: '在Ubuntu 25.10 中安装 Hermes 并对接飞书'
image: '/images/posts/Hermes-install.png'
tags: [Hermes, AI, 个人助理]
category: '教程'
draft: false
lang: 'zh-CN'
---

## 1. 前言
这几天刷B站，全是这个项目的，趁着今天有空，所以来玩玩看怎么个事。

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
## 4. 部署
### 4.1 安装git
在SSH软件中使用下面的命令来安装 git
```
sudo apt update && sudo apt install git -y
```
![](https://tuchuang.goodnightan.com/PicGo/20260416205840335.png)
### 4.2 安装 Hermes
打开 [官网](https://hermes-agent.nousresearch.com/) 获取到安装命令 `curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash` ，将安装命令输入到SSH软件中,脚本会自动安装各种依赖，只需要等待即可（命令太长了，就不截图了）。
### 4.3 初始化 Hermes
#### 4.3.1设置方式
等安装的进度条跑完之后会自动来到初始化界面，这里选择 `Quick setup` 
![](https://tuchuang.goodnightan.com/PicGo/20260416210557480.png)
#### 4.3.2 选择模型
到了模型选择这里，因为我有minimax的coding plan，所以我选择了**MiniMax China**，接着输入api key就行了，URL选择默认的就行
![](https://tuchuang.goodnightan.com/PicGo/20260416210816919.png)
:::tip
有些SSH软件在输入api key的时候不会显示，只要确保复制了就行`
:::

#### 4.3.3 平台对接
我这边以飞书为例进行对接
![](https://tuchuang.goodnightan.com/PicGo/20260416211129417.png)
平台里面选择 **Feishu / Lark** 
![](https://tuchuang.goodnightan.com/PicGo/20260416211301314.png)
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
最后在输入 `source ~/.bashrc` 来刷新配置
:::tip
更多平台可查看[官方文档](https://hermes-agent.nousresearch.com/docs/user-guide/messaging/)
:::

## 5. 优化
### 5.1 飞书
当与机器人发送消息时机器人会要求你进行鉴权，我们只要直接把鉴权指令输入到里面即可
![](https://tuchuang.goodnightan.com/PicGo/20260416213019918.png)
![](https://tuchuang.goodnightan.com/PicGo/20260416213000366.png)

### 5.2 Web UI
官方推荐的Web UI 启动命令是 `hermes  dashboard`，但是使用这个命令有个问题就是只能在本机访问，不能在局域网内访问，要想在局域网内访问，我们需要使用 `hermes dashboard --host 0.0.0.0 --insecure` 这样的指令来打开Web UI
```
hermes dashboard --host 0.0.0.0 --insecure
```
![](https://tuchuang.goodnightan.com/PicGo/20260416213722410.png)
![](https://tuchuang.goodnightan.com/PicGo/20260416213755461.png)