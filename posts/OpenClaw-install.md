---
title: OpenClaw 全流程部署指南
published: 2026-03-01
description: '在Ubuntu-25.10-Desktop 系统上安装 OpenClaw 全流程'
image: '/images/posts/openclaw-install.png'
tags: [OpenClaw, AI, 个人助理]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 前言

最近OpenClaw很火，说是可以当成数字工具人使用，本着好奇的态度，决定试一试看看怎么个事，经过我三天的折腾和看了一堆教程之后我终于折腾出了一套可以量化的流程，接下来就分享给大家。

## 相关地址

OpenClaw：

1. 官方：[OpenClaw — Personal AI Assistant](https://openclaw.ai/)
2. GitHub仓库：[GitHub - openclaw/openclaw: Your own personal AI assistant. Any OS. Any Platform. The lobster way. 🦞](https://github.com/openclaw/openclaw)

Homebrew：

1. 官网：[Homebrew — The Missing Package Manager for macOS (or Linux)](https://brew.sh/)
2. GitHub仓库：[GitHub - Homebrew/brew: 🍺 The missing package manager for macOS (or Linux)](https://github.com/Homebrew/brew)

模型提供商：

1. 火山引擎（火山方舟）：[火山引擎-你的AI云](https://activity.volcengine.com/2026/newyear-referral?ac=MMADFCCYM3WJ&rc=DNKAR8BK)
2. 阿里百炼：[大模型服务平台百炼控制台](https://bailian.console.aliyun.com/cn-beijing/?tab=model#/model-market)
3. 月之暗面（Kimi）：[Moonshot AI](https://www.moonshot.cn/)
4. 智谱AI（GLM）：[智谱AI开放平台](https://bigmodel.cn/)
5. DMXAPI：[dmxapi.cn/register?aff=pKcR](https://www.dmxapi.cn/register?aff=pKcR)
6. 硅基流动：[硅基流动统一登录](https://cloud.siliconflow.cn/i/mOaBXDjd)

qq插件:[GitHub - constansino/openclaw\_qq: Standalone QQ extension for Moltbot using OneBot v11 protocol](https://github.com/constansino/openclaw_qq)

系统信息：  
系统：Ubuntu-25.10-Desktop  
系统用户名：OpenClaw-test  
CPU：# Intel Xeon Platinum 8171M @ 2.60GHz （8 Virtual Core）  
内存：8GB  
虚拟化平台：PVE
虚拟化类型：KVM  

## 1. 介绍

**OpenClaw** 是一款 2026 年初推出的开源个人 AI 助手与智能体框架，前身为 Clawdbot、Moltbot，由奥地利开发者 Peter Steinberger（PSPDFKit 创始人）主导开发，核心定位为 “能做事的数字员工”。
**Homebrew** 是一款以 macOS 为主要适配平台、同时兼容 Linux 系统的开源命令行包管理器

## 2. 安装

### 2.1. 准备工作

因为OpenhClaw需要的权限比较高，所以会向我们索要密码，每次都要输入密码就会很麻烦，所以直接一劳永逸，直接配置让sudo 命令不需要米娜，下面是具体的实践方式
输入  `sudo visudo` ，在打开的文件中的最下方输入 `用户名 ALL=(ALL) NOPASSWD: ALL` ，我的用户名是 openclaw-test，所以我这里的命令就应该填 `openclaw-test ALL=(ALL) NOPASSWD: ALL`
![](https://tuchuang.goodnightan.com/PicGo/20260228224641.png)

:::warning
由于OpenClaw 需要的权限很高，非常不建议直接在自己的主力机上使用 CLI 的方式安装，如需在主力机上安装，推荐使用docker进行安装，具体安装方法请查看[官方文档](https://docs.openclaw.ai/zh-CN/install/docker)
:::

### 2.2. 安装 Homebrew

OpenClaw在安装skils时推荐使用 Homebrew 来解决依赖问题，，所以我们先提前给安装上，不安装的话后续装skills可以会出现以来错误
![](https://tuchuang.goodnightan.com/PicGo/20260228215919.png)
![](https://tuchuang.goodnightan.com/PicGo/20260228220027.png)
要安装 Homebrew 需要先安装 git，如果不安装 git 的话 Homebrew 会安装失败

```
sudo apt install git -y
```

git 安装完成之后就可以安装 Homebrew

```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

Homebrew 在安装过程中会需要按一下回车键
:::tip
如果不安装 git 而直接安装 Homebrew会直接出现下面的情况
![](https://tuchuang.goodnightan.com/PicGo/20260228222213.png)
同时 Homebrew 不能用 root 身份直接运行
![](https://tuchuang.goodnightan.com/PicGo/20260228222422.png)
:::

### 2.3 设置环境变量

#### 2.3.1 单次生效

直接在终端中输入

```
export OPENAI_API_KEY="sk-xxxxxxxxxxxxx"
```

其中 `OPENAI_API_KEY` 可以设置为自己想要的，但是要注意是大写字母，`sk-xxxxxxxxxxxxx` 部分替换为自己实际的key

#### 2.3.2 永久生效

输入 `nano ~/.bashrc` 在打开的文件的最下方输入 `export OPENAI_API_KEY="sk-xxxxxxxxxxxxx"` 然后 ctrl+x 退出并保存，再输入 Y 回车来确认，最后在终端中输入 `source ~/.bashrc` 即可
命令总结

```
nano ~/.bashrc

export OPENAI_API_KEY="sk-xxxxxxxxxxxxx"

source ~/.bashrc
```

其中 `OPENAI_API_KEY` 可以设置为自己想要的，但是要注意是大写字母，`sk-xxxxxxxxxxxxx` 部分替换为自己实际的key

### 2.4. 安装 OpenClaw

```
curl -fsSL https://openclaw.ai/install.sh | bash
```

OpenClaw 会自动安装需要的依赖，一开始只要耐心等待即可
![](https://tuchuang.goodnightan.com/PicGo/20260228225759.png)

#### 2.3.1 详细安装流程

在弹出的

```
I understand this is personal-by-default and shared/multi-user use requires lock-down. Continue？
│  ● Yes / ○ No
````

问题中选择 `Yes` 然后按回车
在弹出的

```
◆  Onboarding mode
│  ● QuickStart (Configure details later via openclaw configure.)
│  ○ Manual
```

中选择 `QuickStart (Configure details later via openclaw configure.)` 然后回车
接下来就是模型选择
这部分各位有什么就选那个，我这边主要讲一下**如何添加里面没有**的模型

选择 `Custom Provider` ，`API Base URL` 输入模型提供商的api地址（具体是什么查看各提供商的文档），我这里以**火山 coding** 为例，我就是要填 `https://ark.cn-beijing.volces.com/api/coding/v3` ，
`How do you want to provide this API key?·` 选择是以明文还是环境变量的方式存储key，这边推荐使用 `环境变量` 的方式即选择 `Use secret reference` ，
`Where is this API key stored?` 时选择 `Environment variable`
然后在 `Environment variable name`  中输入变量名即可
`Endpoint compatibility` 选择 `OpenAI-compatible`
`Model ID` 输入模型名称
`Endpoint ID` 你要修改，就使用获取到的值
`Model alias (optional)` 可以自己随便起个名字，我这边就叫 `huoshan-coding`
整个配置自定义模型就是这样的一个添加法
![](https://tuchuang.goodnightan.com/PicGo/20260301092145.png)

:::tip
变量需要提前输入，在 OpenClaw 安装的过程中是不能输入变量的，如果前面忘记输入则可以先 ctrl+c退出，设置完变量之后运行 `openclaw config` 进行重新设置
:::

模型添加好之后就是频道接入了（就是使用什么软件和 OpenClaw聊天），各个频道的接入方法可查看[官方文档](https://docs.openclaw.ai/zh-CN/channels) ，我这里只讲一下 qq机器人（非开放平台）的接入方法

如果你想使用 QQ-Bot（非开放平台），可以在出现 `Select channel (QuickStart)` 时选择 `Skip for now`，等 快速设置 结束之后再配置

在弹出的

```
◆  Configure skills now? (recommended)
│  ● Yes / ○ No
```

时候按需要选择，如果选择是下面是所有的skills，各位按需选择，选择完之后回车会安装选择的skills（按空格进行选择）
![](https://tuchuang.goodnightan.com/PicGo/20260301094442.png)

skills 安装完成之后会询问是否需要设置一些 key，这边按需选择即可
然后就是 hooks 的选择了，这边建议全勾选上
![](https://tuchuang.goodnightan.com/PicGo/20260301094946.png)

至此基于快速设置的 OpenClaw 就安装完成了

## 3. 调教 OpenClaw

### 3.1 开启局域网访问

修改 OpenClaw 的的配置文件 `openclaw.json` 在 `gateway` 中将

```
"gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "loopback",
    "auth": {
      "mode": "token",
      "token": "c9a81263a0c584b009fdb4fe0cc7fd0c3ec6400d92b72da3"
    },
```

修改为

```
"gateway": {
    "port": 18789,
    "mode": "local",
    "bind": "lan",
    "controlUi": {
      "dangerouslyAllowHostHeaderOriginFallback": true,
      "allowInsecureAuth": true,
      "dangerouslyDisableDeviceAuth": true
    },
    "auth": {
      "mode": "token",
      "token": "c9a81263a0c584b009fdb4fe0cc7fd0c3ec6400d92b72da3"
    },
```

其实主要就修改了一个字段的值，将 `bind` 字段从 `loopback` 修改为了 `lan`，然后有添加了几个字段

```
"controlUi": {
      "dangerouslyAllowHostHeaderOriginFallback": true,
      "allowInsecureAuth": true,
      "dangerouslyDisableDeviceAuth": true
    },
```

将上面的添加到 `gateway` 中就行了，然后在终端中输入 `openclaw gateway restart`

### 3.2 安装 skills

skills 安装命令以及所有skills：[GitHub - VoltAgent/awesome-openclaw-skills: The awesome collection of OpenClaw skills. 5,400+ skills filtered and categorized from the official OpenClaw Skills Registry.🦞](https://github.com/VoltAgent/awesome-openclaw-skills)

## 4. OpenClaw 目录说明

1. 非root用户

- 配置路径：~/.openclaw
- 数据路径：~/.npm-global/lib/node_modules/openclaw

1. root用户

- 配置路径：/root/.openclaw/openclaw.json`
- 数据路径：/root/.npm-global/lib/node_modules/openclaw

## 5. 接入 QQ-Bot （非开放平台）

使用项目地址：
napcat：[GitHub - NapNeko/NapCatQQ: Modern protocol-side framework based on NTQQ](https://github.com/NapNeko/NapCatQQ)
napcat-docker：[GitHub - NapNeko/NapCat-Docker: NapCat-Docker](https://github.com/NapNeko/NapCat-Docker)
插件：[GitHub - constansino/openclaw\_qq: Standalone QQ extension for Moltbot using OneBot v11 protocol](https://github.com/constansino/openclaw_qq)

### 5.1 部署napcat

我喜欢使用docker 部署，和部署其他程序一样，都是创建compose文件

```
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
      - ./napcat/config:/app/napcat/config
      - ./ntqq:/app/.config/QQ
```

如果你之前使用napcat部署过机器人，只需要添加一个 **WebSocket服务端** 即可
![](https://tuchuang.goodnightan.com/PicGo/20260301102317.png)

### 5.2 下载文件

进入数据路径下的 `extensions` 文件夹

```
cd ~/.npm-global/lib/node_modules/openclaw/extensions
```

克隆仓库

```
git clone https://github.com/constansino/openclaw_qq.git qq
```

进入仓库内

```
cd qq
```

安装依赖

```
npm install
```

### 5.3 填写配置

打开 OpenClaw 的配置文件

```
nano ~/.openclaw/openclaw.json
```

在 channels 字段下添加如下内容，如没有 `channels` 字段则直接复制整段，如有 `channels` 字段，自行修改

```
{
  "channels": {
    "qq": {
      "wsUrl": "ws://127.0.0.1:3001",
      "accessToken": "你的Token",
      "admins": "12345678,87654321",
      "adminOnlyChat": false,
      "notifyNonAdminBlocked": false,
      "nonAdminBlockedMessage": "当前仅管理员可触发机器人。\n如需使用请联系管理员。",
      "blockedNotifyCooldownMs": 10000,
      "showProcessingStatus": true,
      "processingStatusDelayMs": 500,
      "processingStatusText": "输入中",
      "allowedGroups": "10001,10002",
      "blockedUsers": "999999",
      "systemPrompt": "你是一个名为“人工智障”的QQ机器人，说话风格要风趣幽默。",
      "historyLimit": 0,
      "keywordTriggers": "小助手, 帮助",
      "autoApproveRequests": true,
      "enableGuilds": true,
      "enableTTS": false,
      "sharedMediaHostDir": "/Users/yourname/openclaw_qq/deploy/napcat/shared_media",
      "sharedMediaContainerDir": "/openclaw_media",
      "rateLimitMs": 1000,
      "formatMarkdown": true,
      "antiRiskMode": false,
      "maxMessageLength": 4000
    }
  },
  "plugins": {
    "entries": {
      "qq": { "enabled": true }
    }
  },
  "session": {
    "dmScope": "per-channel-peer"
  }
}
```

然后输入 `openclaw geteway restart` 重启网关，之后就可以在qq中使用openclaw了
整个流程图
![](https://tuchuang.goodnightan.com/PicGo/20260301112055.png)
