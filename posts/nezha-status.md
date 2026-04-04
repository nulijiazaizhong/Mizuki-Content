---
title: 哪吒监控的使用
published: 2025-10-15
description: '哪吒监控的使用方法'
image: '/images/posts/nezha.png'
tags: [nezha, 监控]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 1. 相关地址
- 项目地址：[https://github.com/nezhahq/nezha](https://github.com/nezhahq/nezha)
- 文档地址：[https://nezha.wiki/](https://nezha.wiki/)
- json生成器地址：[哪吒监控 JSON 工具合集](https://nezhajson.goodnightan.com/)

## 2. 准备工作
- 购买服务器（不是强制要求，机器少的话可以直接在现有机器上部署，机器多的话建议购买一台新的机器专门用于监控的搭建）
- 安装docker

### 3. 搭建
#### 面板端（dashboard）
##### compose文件
```
services:
  dashboard:
    image: registry.cn-shanghai.aliyuncs.com/naibahq/nezha-dashboard
    container_name: nezha-dashboard
    restart: always
    volumes:
      - ./data:/dashboard/data
    ports:
      - 8264:8264

```
##### 一键脚本
- 国际：
```
curl -L https://raw.githubusercontent.com/nezhahq/scripts/refs/heads/main/install.sh -o nezha.sh && chmod +x nezha.sh && sudo ./nezha.sh
```
- 大陆优化 ：
```
curl -L https://gitee.com/naibahq/scripts/raw/main/install.sh -o nezha.sh && chmod +x nezha.sh && sudo CN=true ./nezha.sh
```

#### 面板配置
使用 `compose文件` 部署的需要在面板后台`系统设置` 里面填写 `gaent对接地址` 
:::info
使用 `ip+端口` 的不要开启 `Agent使用TLS连接`
:::


#### 监控端（agent）
在面板后台选择类型，复制命令到被监控机器直接安装即可

### 4. 美化
#### 1. 前台美化
示例：[https://node.goodnightan.com/](https://node.goodnightan.com/)
```
<!-- 自定义设置 -->
<script>
  window.CustomBackgroundImage = "https://cf-api.goodnightan.com/p/wolp";
  window.DisableAnimatedMan = "true";
  window.CustomIllustration = 'https://img.028029.xyz/1734592545615.png';
  window.ShowNetTransfer = "true";
  window.CustomDesc = "欢迎查看晚安的服务器监控.";
</script>

<!-- 状态和进度条逻辑 -->
<script>
  function applyCardStyles() {
    const cards = document.querySelectorAll('div.rounded-lg.border.text-card-foreground');

    cards.forEach(card => {
      // 跳过无 section.grid 的卡片（例如统计卡片）
      if (!card.querySelector('section.grid')) return;

      // 1️⃣ 获取剩余天数
      const remarkEls = card.querySelectorAll('[class*="text-muted-foreground"]');
      let daysLeft = null;
      remarkEls.forEach(el => {
        const m = el.innerText.match(/剩余天数[:：]?\s*(\d+)\s*天/);
        if (m) daysLeft = parseInt(m[1]);
      });

      // 2️⃣ 设置进度条颜色
      const bar = card.querySelector('[aria-label="Server Usage Bar"] > div');
      if (bar) {
        if (daysLeft !== null) {
          if (daysLeft <= 10) {
            bar.style.backgroundColor = "#ef4444"; // 红色
          } else if (daysLeft > 30) {
            bar.style.backgroundColor = "#22c55e"; // 绿色
          } else {
            bar.style.backgroundColor = "#ffffff"; // 白色
          }
        } else {
          bar.style.backgroundColor = "#ffffff"; // 默认白色
        }
      }

      // 3️⃣ 判断状态（是否在线/过期）
      const statusDot = card.querySelector('section.grid span.h-2.w-2');
      card.classList.remove('expired-offline', 'expired-online');
      if (!statusDot) return;

      const isOnline = statusDot.classList.contains('bg-green-500');
      const expiredEl = [...card.querySelectorAll('*')].find(el =>
        el.textContent.includes('已过期')
      );
      const isExpired = !!expiredEl;

      if (isExpired && isOnline) {
        card.classList.add('expired-online');
      } else if (!isOnline) {
        card.classList.add('expired-offline');
      }
    });
  }

  // 启动时监听 DOM
  const observer = new MutationObserver(() => applyCardStyles());

  window.addEventListener("load", () => {
    const target = document.querySelector("main") || document.body;
    if (target) {
      observer.observe(target, { childList: true, subtree: true });
      applyCardStyles();
    }
  });
</script>

<!-- 样式控制 -->
<style>
  /* 上传字体颜色：红 */
  [class*="上传"] > .text-xs.font-semibold,
  [class*="上传"] + div > .text-xs.font-semibold {
    color: #ef4444 !important;
  }

  /* 下载字体颜色：绿 */
  [class*="下载"] > .text-xs.font-semibold,
  [class*="下载"] + div > .text-xs.font-semibold {
    color: #22c55e !important;
  }

  /* 左边上传统计条颜色 */
  section.flex.items-center.w-full.justify-between.gap-1 > div:first-child {
    color: #ef4444 !important;
    border-color: #ef444433 !important;
  }

  /* 右边下载统计条颜色 */
  section.flex.items-center.w-full.justify-between.gap-1 > div:last-child {
    color: #22c55e !important;
    border-color: #22c55e33 !important;
  }

  /* 🚫 删除进度条默认强制样式，改为 JS 控制 */
  /* [aria-label="Server Usage Bar"] > div {
    background-color: hsl(var(--primary)) !important;
    background-image: none !important;
  } */

  /* 过期但离线或离线未过期：红色背景 + 红边 */
  .expired-offline {
    background-color: rgba(255, 86, 86, 0.15) !important;
    border-color: #ef4444 !important;
    color: inherit !important;
  }

  /* 过期但在线：黄色背景 + 黄边 */
  .expired-online {
    background-color: rgba(255, 221, 86, 0.15) !important;
    border-color: rgb(228, 239, 68) !important;
    color: inherit !important;
  }
</style>
```
:::tip
以上代码填写在面板后台 `系统设置-自定义代码` 里面，主题选择为 `Office` 
:::

#### 2. 机器显示美化（公开代码）
使用json格式的代码并填写到每个机器的 `公开备注` 中
示例：
```
{
    "billingDataMod": {
        "startDate": "2025-03-30 11:38:52+08:00",
        "endDate": "2025-11-16 11:38:52+08:00",
        "autorenewal": "0",
        "cycle": "年",
        "amount": "200USD"
    },
    "planDataMod": {
        "bandwidth": "1Gbps",
        "trafficVol": "3TB/月",
        "trafficType": "2",
        "IPv4": "1",
        "IPv6": "0",
        "networkRoute": "4837,163,CMI",
        "extra": "搬瓦工"
    }
}
```
解释：

|  startDate   |            计费开始时间             |
| :----------: | :---------------------------: |
|   endDate    |            计费结束时间             |
| autoRenewal  |        是否自动续费；是为1,否为0         |
|    cycle     |             计费周期              |
|    amount    |              金额               |
|  bandwidth   |            机器带宽大小             |
|  trafficVol  |            机器流量大小             |
| trafficType  | 流量计费类型；单出流量（上行）为1,双向为2，双向最值为3 |
|     IPv4     |           IPv4地址数量            |
|     IPv6     |           IPv6地址数量            |
| networkRoute |         网络路由类型；例：CN2          |
|    extra     |           额外信息，支持中文           |

### 5. 高级配置
#### 机器单月内流量监控
##### 1. 配置通知
具体配置方法参考官方wiki:[通知设置 \| 哪吒服务器监控](https://nezha.wiki/guide/notifications.html)
###### Matrix
搭建查看：[https://blog.goodnightan.com/posts/nezha-status/](https://blog.goodnightan.com/posts/nezha-status/)
接入方法
1. 获取Token，将获取token命令中的变量替换为已知内容，在机器上执行，复制输出的token值
2. 配置通知，遵循下面的来写
- **名称** ：Matrix
- **URL**：`https://$YOUR_HOME_SERVER/_matrix/client/r0/rooms/$ROOM_ID/send/m.room.message`
- **请求方式**：`POST`
-  **请求类型**：`JSON`
- **Header**：
```
{
  "Authorization": "Bearer $YOUR_MATRIX_TOKEN"
}
```
**Body**：
```
{
  "msgtype": "m.text",
  "format": "org.matrix.custom.html",
  "formatted_body": "<h1><a href=\"$YOUR_NEZHA_URL\" target=\"_blank\">Nezha Dashboard</a></h1><ul><li>时间：#DATETIME#</li><li>消息：#NEZHA#</li></ul>",
  "body": "#NEZHA#"
}
```
- **变量替换**：将以下变量替换为实际值
    - `$YOUR_HOME_SERVER`：Matrix 服务器地址
    - `$YOUR_NEZHA_URL`：你的哪吒面板 URL
    - `$YOUR_MATRIX_USERNAME`：Matrix 用户名
    - `$YOUR_MATRIX_PASSWD`：Matrix 用户密码
    - `$YOUR_MATRIX_TOKEN`：Matrix 访问令牌
    - `$ROOM_ID`：Matrix 房间 ID
:::nfo
房间ID可以通过复制房间链接来获取，链接中 #/后面到?前面的就是房间ID
:::

##### 2. 报警设置
具体配置方法参考官方wiki:[通知设置 \| 哪吒服务器监控](https://nezha.wiki/guide/notifications.html#%E7%89%B9%E6%AE%8A%E8%A7%84%E5%88%99-%E4%BB%BB%E6%84%8F%E5%91%A8%E6%9C%9F%E6%B5%81%E9%87%8F%E9%80%9A%E7%9F%A5)

#### 报警规则
具体配置方法参考官方wiki:[通知设置 \| 哪吒服务器监控](https://nezha.wiki/guide/notifications.html#%E5%9F%BA%E6%9C%AC%E8%A7%84%E5%88%99)
:::note
警报格式不会写的可以使用[生成器](https://nezhajson.goodnightan.com/)进行生成
:::
