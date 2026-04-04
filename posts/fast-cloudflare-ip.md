---
title: cloudflare 优选ip
published: 2026-02-06
description: '通过 Saas 实现优选ip，提高访问速度'
image: '/images/posts/fast-cloudflare-ip.png'
tags: [Cloudflare, ip, 优选]
category: '教程,运维,开发'
draft: false 
lang: 'zh-CN'
---


## 背景

最近在cf上使用worker搭了一个随机图，但是国内访问有点满，尝试套上EO国内，发现速度还是比较慢，所以就想着能不能优选ip，提高访问速度。

## 准备工作

- 一个cf账号
- 两个绑定到cf域名
- visa卡或绑定了银行卡的paypal账号

## 日常使用

### 示例

1. 我这边有两个域名，9910.site，61616.top，其中9910.site作为访问域名，61616.top作为加速域名；一个 komari 服务需要使用到优选ip，我打算访问的域名是 `komari.9910.site`，正常步骤应该是将域名 `komari.9910.site` 使用 `A` 记录解析到我的服务器ip上并开启小黄云，但是我们不能这样干，我们将 `komair-fast.61616.top` 使用 `A` 记录解析到我的服务器ip上并开启小黄云
![](https://tuchuang.goodnightan.com/PicGo/20260206212925.png)
2. 在 `61616.top`下面的 `SSL/TLS` 下选择 `自定义主机名`，`自定义主机名`选项需绑定支付方式才能打开，将 `komair-fast.61616.top` 这个域名添加为 `回退源`
![](https://tuchuang.goodnightan.com/PicGo/20260206213148.png)
3. 然后点击添加 `自定义主机名` ，这里就需要填 `komari.9910.site` 这个作为访问入口访问的域名，其余保持默认，然后点击 `添加自定义主机名`
![](https://tuchuang.goodnightan.com/PicGo/20260206213452.png)
4. 根据提示验证域名所有权
![](https://tuchuang.goodnightan.com/PicGo/20260206213600.png)
5. 然后我们引入一个新的域名 `cdn.61616.top` 作为加速域名，将 `cdn.61616.top` 使用 `CNAME` 记录解析到 `cf.090227.xyz` 上同时不要开启小黄云
![](https://tuchuang.goodnightan.com/PicGo/20260206215158.png)

:::tip
`cf.090227.xyz` 这个域名是可以在 [CloudFlare 优选域名汇总](https://cf.090227.xyz/) 上找到，网站上还有别的都可以使用
:::

1. 将 `komari.9910.site` 使用 `CNAME` 记录解析到 `cdn.61616.top` 上并且关闭小黄云即可实现优选ip

## worker

1. worker 部分就很简单了，直接在worker里面添加一个路由，比如是 api.9910.site/*(路由一定要带 /*)
2. 直接将 `api.9910.site` 使用 `cname` 解析到 `cdn.61616.top` 上并且关闭小黄云即可
