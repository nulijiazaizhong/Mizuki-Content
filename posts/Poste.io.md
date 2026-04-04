---
title: 使用Poste.io搭建邮件服务器
published: 2025-10-31
description: '使用Poste.io搭建邮件服务器的教程'
image: '/images/posts/posteio.png'
tags: [poste.io, 邮件服务器]
category: '教程'
draft: false 
lang: 'zh-CN'
---

1. 背景：
因为一些服务需要使用到邮件来进行消息（通知）的收发，所以就想着搭建一个自己的邮件服务器来满足需求，前面也使用过别的服务，但是占用都普遍较高，并且部署过程也相对来说比较复杂，所以这回选用Poste.io也是因为其可以直接使用docker部署

## 2. 相关链接
官网地址：[Poste.io \~ complete mail server](https://poste.io/)
官方文档：[Poste.io documentation](https://poste.io/doc/)

## 3. 部署

### 3.1 确认机器可以部署
通过 ssh 连接到机器之后输入一下命令
```
apt update
apt install telnet # 安装必要包

telnet smtp.qq.com 25 # 
```
如果出现如下图所示极为开通了25 端口
![](https://tuchuang.goodnightan.com/PicGo/20251031231331.png)

### 3.2 反向解析
反向解析即rDNS，具体是否支持需要向你的服务提供商咨询，目前我已知[CloudCone](https://cloudcone.com/) 是可以直接在机器的管理面板上配置的

### 3.3 域名解析
在开始部署之前，建议先完成域名的解析。比如这里我使用的域名邮箱后缀为 `@goodnightan.email` ，那么需要解析的内容如下表（替换必要的域名为自己的域名）

|                名称                | 记录类型 |                      记录值                      |       优先级/说明        |
| :------------------------------: | :--: | :-------------------------------------------: | :-----------------: |
|                @                 |  MX  |            mail.goodnightan.email             |  优先级 `10`，邮件服务器域名   |
|               mail               |  A   |                   邮件服务器的IP                    |      邮件服务器的IP       |
|                @                 | TXT  |           v=spf1 ip4:邮件服务器的IP ~all            | SPF 记录，指定允许发送邮件的服务器 |
|              _dmarc              | TXT  | v=DMARC1; p=none; rua=mailto:dmarc@imoe.email | DMARC 记录，处理验证失败的邮件  |
| sXX._domainkey.goodnightan.email | TXT  |               k=rsa; p=MIIBI...               |  DKIM 公钥记录，确保邮件真实性  |

:::tip
最后一个 `sXX._domainkey.goodnightan.email` 的解析需要在配置中获取，具体可看4.3
:::

### 3.4 协议解析
协议解析可以使用A记录，也可以使用CNAME记录，解析名称都是一样的，只有记录值存在区别，A记录直接在记录值上填服务器IP，CNAME记录在记录值上填 邮箱域名，我这里就填mail.goodnightan.email

A记录

|  名称  | 记录类型 |   记录值    |
| :--: | :--: | :------: |
| imap |  A   | 邮件服务器的IP |
| smtp |  A   | 邮件服务器的IP |
| pop  |  A   | 邮件服务器的IP |

CNAME记录
|  名称  | 记录类型  |          记录值           |
| :--: | :---: | :--------------------: |
| imap | CNAME | mail.goodnightan.email |
| smtp | CNAME | mail.goodnightan.email |
| pop  | CNAME | mail.goodnightan.email |

### 3.5 compose文件
```
services:
  mailserver:
    image: analogic/poste.io
    hostname: mail.goodnightan.email # 修改此处域名为你自己的域名
    ports:
      - "25:25"
      - "110:110"
      - "143:143"
      - "587:587"
      - "993:993"
      - "995:995"
      - "4190:4190" # webui端口
      - "465:465"
      - "80:80"      # 添加 80 端口，用于 Let's Encrypt 验证
      - "443:443"    # 启用 HTTPS
    environment:
      - LETSENCRYPT_EMAIL=admin@9910.site
      - LETSENCRYPT_HOST=mail.9910.site
      - VIRTUAL_HOST=mail.9910.site
   #   - DISABLE_CLAMAV=TRUE    # 反病毒，根据需求禁用
   #   - DISABLE_RSPAMD=TRUE    # 反垃圾邮件，根据需求禁用
      - TZ=Asia/Shanghai
      - HTTPS=ON               # 启用 HTTPS
    volumes:
      - /etc/localtime:/etc/localtime:ro
      - ./mail-data:/data      # 确保持久化数据卷
    restart: unless-stopped    # 自动重启策略
```
:::tip
因使用到的端口较多，推荐使用单独的机器部署
:::

## 4. 使用
### 4.1 注册 
注册管理员用户:
![](https://tuchuang.goodnightan.com/PicGo/20251031222347.png)
注册完成之后就可以看到管理员界面了
![](https://tuchuang.goodnightan.com/PicGo/20251031222438.png)
### 4.2 配置 `Let’s encrypt` 证书
在管理员界面点击 `System setting` ，在点击 `TLS certificate` ，点击绿色的 `issue free letsencrypt.org certificate`  按钮 
![](https://tuchuang.goodnightan.com/PicGo/20251031222752.png)
在 `Emable` 前面的方框勾选上，在 `Common name` 中填入主域名，在 `Alternative names` 中将之前解析过的 imap、smtp、pop的完整域名也填写上，然后点击 `Save changes` 并稍作等待，等待证书完成签发
![](https://tuchuang.goodnightan.com/PicGo/20251031223710.png)

:::warning
一定要先完成域名解析，在配置SSL证书，不然证书签发可能会卡住
:::

证书签发完成之后我们就可以用域名访问后台了，而不是继续使用ip+端口的方式了
### 4.3 创建 DKIM 密钥
点击 `Virtual domains` ，然后在点击账户
![](https://tuchuang.goodnightan.com/PicGo/20251031224447.png)
进去之后在 `DKIM key` 处点击 `creat a new key` 
![[Pasted image 20251031224602.png]]
出现这样的内容及表示 key 创建好了，现在我们要对照着创建的 key 来设置 DNS 解析
- 示例：
  我这里创建的 key 是这样的
  ```
  s20251031862._domainkey.goodnightan.email. IN TXT "**k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtMR8r/Inj1r795IAtl479SccuZHnHhj+pbWxUxK/w86PfWb7D2xkLZZqq4nQ6OuKc3+SRG/fOZXaKPJll+VOf7jhVuxo5/9pXLVdDTTef8pq/eKiS5g8aqDNFRj96i0FvFY9Hp3qmeiPDu3w4WyvFCxT7AhT+jviv5E0ocjg9vdR09umkpLIpY640hlDhZpqTOBWAQn+ItAOUhtg88khTkqSzNNtYiRxzf30qJRX0kmoiqhrkCLo3L/Rn7QEX73tvnFEeV+0X1GBrTlKDnBYDnN6rg1Y08GaKVxjU01nSE6WKS4Rvv8fp+Eygz0Huzs+GKclu+Y/vtgPhhLFfUBkKQIDAQAB**"
  ```
  那么我们的解析就这样设置
- 名称：s20251031862._domainkey
- 记录类型：TXT
- 记录值：k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtMR8r/Inj1r795IAtl479SccuZHnHhj+pbWxUxK/w86PfWb7D2xkLZZqq4nQ6OuKc3+SRG/fOZXaKPJll+VOf7jhVuxo5/9pXLVdDTTef8pq/eKiS5g8aqDNFRj96i0FvFY9Hp3qmeiPDu3w4WyvFCxT7AhT+jviv5E0ocjg9vdR09umkpLIpY640hlDhZpqTOBWAQn+ItAOUhtg88khTkqSzNNtYiRxzf30qJRX0kmoiqhrkCLo3L/Rn7QEX73tvnFEeV+0X1GBrTlKDnBYDnN6rg1Y08GaKVxjU01nSE6WKS4Rvv8fp+Eygz0Huzs+GKclu+Y/vtgPhhLFfUBkKQIDAQAB
### 4.4 解析总结
至此，所有解析也就结束，一共是8条解析记录，可以查看图片核对自己的解析有没有遗漏
![](https://tuchuang.goodnightan.com/PicGo/20251031225840.png)

## 5. webmail使用
在浏览器地址栏中输入域名，默认即可进入到webui的页面，或者也可通过管理后台的 `Webmail` 按钮进入

:::note
不建议直接使用 管理员账号 登录webmail，推荐新建一个用户使用
:::

## 6. 使用outlook添加账户
在outlook中点击添加账户，在弹出的对话框中输入 邮箱地址
![](https://tuchuang.goodnightan.com/PicGo/20251031230747.png)
输入密码即可完成添加
## 7. 结束语
至此，整个 Poste.io的部署就此结束，你可以访问 [Newsletters spam test by mail-tester.com](https://www.mail-tester.com/) 来测试你的邮箱评级

## 8. 参考资料
- [邮局系列教程 \| 使用poste.io部署自己的邮局 – 夜梦星尘の折腾日记](https://tech.yemengstar.com/mailseries-starter-deploy-your-own-mailbox-posteio/)
- [使用Poste自建邮局-少年听雨的博客](https://blog.snty.de/archives/shi-yong-postezi-jian-you-ju)