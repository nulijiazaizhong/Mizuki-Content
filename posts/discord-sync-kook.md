---
title: 使用AstrBot将Discord消息同步到Kook
published: 2025-10-08
description: '插件 Discord_sync_to_kook的使用教程'
image: '/images/posts/Discord_sync_to_kook.png'
tags: [Bot,Python]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 准备工作
### 消息平台配置
确保已经在 [Astrbot](https://docs.astrbot.app) 中配置了 [discord](https://docs.astrbot.app/deploy/platform/discord.html) 与 [kook](https://docs.astrbot.app/deploy/platform/kook.html) 的平台适配器并确保机器人正常运行。

### 安装插件
在 [Astrbot](https://docs.astrbot.app) 中安装插件 [Discord_sync_to_kook](https://github.com/nulijiazaizhong/astrbot_plugin_Discord_sync_to_kook) 插件。

## 插件配置
### 1.转发配置
#### 配置简述

|       配置项        |                             作用                             |
| :-----------------: | :----------------------------------------------------------: |
| Discord平台适配器ID | 默认无需单独设置，会自动获取，如有多个适配器可查看日志获取ID |
|  Kook平台适配器ID   | 默认无需单独设置，会自动获取，如有多个适配器可查看日志获取ID |
|  默认Discord频道ID  |                     输入需要转发的频道ID                     |
|   默认Kook频道ID    |                    输入需要转发到的频道ID                    |
|   多频道映射配置    |                  如需转发多个频道请设置这里                  |

#### 具体示例
##### 1. 单适配器单频道转发
只需设置默认Discord频道ID与默认Kook频道ID即可

##### 2. 单适配器多频道转发
设置多频道映射配置即可，具体设置方法为：`Discord频道ID  Kook频道ID`，中间用空格隔开，每行一个

##### 3. 多适配器单频道转发
对应的Discord平台适配器ID与Kook平台适配器ID需要查看日志获取到的ID进行手动设置，然后设置默认Discord频道ID与默认Kook频道ID即可
##### 4. 多适配器多频道转发
对应的Discord平台适配器ID与Kook平台适配器ID需要查看日志获取到的ID进行手动设置，然后设置多频道映射配置即可，具体设置方法为：`Discord频道ID  Kook频道ID`，中间用空格隔开，每行一个  

:::tip
PS：如需转发机器人消息，请打开插件设置中的`是否包含机器人发送的消息`选项
:::

### 2. 翻译配置
#### 配置简述

|       配置项        |                             作用                             |
| :-----------------: | :----------------------------------------------------------: |
|  是否开启翻译功能   |                     是否开启翻译功能，默认关闭                     |
|    翻译服务提供商   |           选择翻译服务提供商，可选`腾讯`、`百度`、`谷歌`等           |
|    翻译服务API密钥   |          输入翻译服务API密钥，具体获取方法请参考各翻译服务文档          |

:::tip
开启翻译之后转发的消息为双语，即默认语言和翻译的语言都会转发，后续可能会推出仅转发翻译语言的选项
:::

:::warning
如需使用腾讯云翻译服务，需在 Astrbot 控制台 安装名为 `tencentcloud-sdk-python` 的pip库

如需添加其他翻译服务提供商，请联系插件作者并提供测试密钥或自行对源码进行修改
:::