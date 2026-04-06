---
title: 'EdgeOne实现随机图搭建'
published: 2025-09-01
update: 2026-04-07
description: '随机图片API的搭建指南'
image: '/images/posts/api.png'
tags: [API, 随机图片]
category: '开发'
draft: false
lang: 'zh-CN'
---

## 背景介绍
想用EdgeOne搭建随机图是因为我阿里云4-4的机器最近到期了，随着搭建的服务越来越多，4G内存的机器已经不能满足我的需求了，所以就趁着阿里云的机器到期和雨云7周年的活动，买了台雨云 4-8的机器；众所周知的，雨云的机器都是有流量限制的，为了避免流量用超了，加上最近EdgeOne特别火，所以就有了这篇博客。

## 准备工作
1. 一个GitHub账号
2. 一个域名
3. EdgeOne的免费激活码  
ps：EdgeOne不建议付费购买，能白嫖就白嫖；国际站测速分享一下就有2个了，国内站的话好像要购买机器才行，具体的怎么样我也没试过，我国内站的激活码是在官方Discord上抽奖抽的

## 项目地址
- 原始项目：[https://github.com/H2O-ME/EdgeOne-Random-Picture](https://github.com/H2O-ME/EdgeOne-Random-Picture)
![](https://tuchuang.goodnightan.com/PicGo/20260407052507285.png)
- 我修改的：[https://github.com/nulijiazaizhong/EdgeOne-Random-Picture](https://github.com/nulijiazaizhong/EdgeOne-Random-Picture)
![](https://tuchuang.goodnightan.com/PicGo/20260407052525382.png)

## 部署过程
### 1. fork 仓库
前往博客中的链接，fork仓库

### 2. 克隆并修改仓库
将仓库克隆到本地，并将你的图片放到仓库下的 `\public\images` 这个文件夹下，然后将仓库推送到GitHub

### 3. EdgeOne部署
在[腾讯云EdgeOne Pages控制台](https://console.cloud.tencent.com/edgeone/pages) 选择 `新建项目 -> 导入 git 仓库 -> 选择仓库` ，然后修改 `项目名称、加速区域、生产分支` ，检查 `构建设置` 是否与下图一致，最后点击 `开始部署`
![](https://tuchuang.goodnightan.com/PicGo/20260407053224433.png)

### 4. 绑定自定义域名
在部署完成之后EO 会给一个测试域名，这个测试域名是有时长限制的，所以我们需要绑定自己的域名；点击 `项目设置` ，在 `域名管理` 中绑定自己的域名并按要求完成解析

至此使用 **EdgeOne Pages 实现随机图搭建**就全部完成了。

### 3. API
- **随机图片重定向**: `GET /api/random`
- **指定类型**:
  - PC 端: `/api/random?type=pc`
  - 移动端: `/api/random?type=mobile`
- **JSON 格式**: `/api/random?redirect=false` (返回图片 URL 路径)
- **图库预览**: `GET /gallery`