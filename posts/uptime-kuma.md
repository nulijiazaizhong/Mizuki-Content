---
title: 'uptime-kuma 搭建教程'
published: 2025-09-04
description: 'uptime-kuma的搭建和美化过程'
image: '/images/posts/uptime-kuma.png'
tags: ['uptime-kuma', '搭建', '美化',Docker]
category: '开发'
draft: false
lang: 'zh-CN'
---

## 部署uptime-kuma
还是简单粗暴的直接使用docker部署，docker-compose.yml文件如下：
```
services:
  uptime-kuma:
    container_name: uptime-kuma
    image: louislam/uptime-kuma:1
    volumes:
      - ./data:/app/data
    ports:
      - "3001:3001"
    restart: unless-stopped
```
然后执行`docker-compose up -d`即可部署。
部署完成后，访问`http://ip:3001`即可进入uptime-kuma的界面。

先创建账号，然后在添加服务监控，最后创建仪表盘

## 美化
提供2套美化方案，一套是从[腾讯云开发者社区](https://cloud.tencent.com/developer/article/2398652)薅过来的方案，一套是我自己写的方案。

1. 我自己写的
- 演示：[https://uptime.ets2la.cn/status/goodnightan](https://uptime.ets2la.cn/status/goodnightan)
- 源码：
```
/* ============================
   1. 字体引入（字体换成自己的地址）
============================ */
/* 标题字体 */
@font-face {
    font-family: "TitleFont";
    src: url("https://cdn.jsdelivr.net/gh/nulijiazaizhong/fonts/harmonyOS/HarmonyOS_Sans.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
}

/* 正文字体 */
@font-face {
    font-family: "BodyFont";
    src: url("https://cdn.jsdelivr.net/gh/nulijiazaizhong/fonts/saye/saye.woff2") format("woff2");
    font-weight: normal;
    font-style: normal;
}

/* ============================
   2. 全局字体设置
============================ */
body, p, span, div {
    font-family: "BodyFont", sans-serif;
}

#app {
    font-family: '1666963922', BlinkMacSystemFont, 'segoe ui', Roboto, 'helvetica neue',
                 Arial, 'noto sans', sans-serif, 'apple color emoji', 'segoe ui emoji',
                 'segoe ui symbol', 'noto color emoji' !important;
}

/* ============================
   3. 背景设置(随机图换成自己的地址)
============================ */
body {
    background: url("https://cf-api.goodnightan.com") no-repeat center center fixed;
    background-size: cover;
}

/* ============================
   4. 标题字体应用
============================ */
/* 分组标题 */
.group-title span[data-v-f71ca08e],
h1, h2, h3, h4, h5, h6 {
    font-family: "TitleFont", sans-serif;
    font-weight: 700;
}

/* 全局状态栏 */
.overall-status[data-v-b8247e57],
h1.page-title {
    font-family: "TitleFont", sans-serif !important;
    font-weight: 800;
    font-size: 2.5rem;
    text-align: center;
    margin: 20px 0;
}

/* 页面主标题（带 logo） */
h1.title-flex,
h1.title-flex span[data-v-7d4a7f28] {
    font-family: "TitleFont", sans-serif !important;
    font-weight: 800;
    font-size: 2.5rem;
    text-align: center;
    display: block;
    margin: 20px auto;
    background-image: linear-gradient(
        90deg, #07c160, #fb6bea 25%, #3aedff 50%, #fb6bea 75%, #28d079
    );
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 400% 100%;
    animation: wzw 10s linear infinite;
}

/* 页面主标题 Logo */
h1.title-flex .logo-wrapper img {
    width: 40px;
    height: 40px;
    display: inline-block;
    vertical-align: middle;
    margin-right: 10px;
}

/* ============================
   5. 渐变动画定义
============================ */
h1, h2, h3, .h1, .h2, .h3, 
.group-title span, 
.alert-heading.p-2 > h1, 
.alert-heading.p-2 > h2 {
    background-image: linear-gradient(
        90deg, #07c160, #fb6bea 25%, #3aedff 50%, #fb6bea 75%, #28d079
    );
    font-family: '1666963922', sans-serif;
    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
    background-clip: text;
    background-size: 400% 100%;
    animation: wzw 10s linear infinite;
}

@keyframes wzw {
    0%   { background-position: 0% 50%; }
    50%  { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

/* ============================
   6. 网格布局（监控项容器）
============================ */
.monitor-list > .monitor-list {
    display: grid;
    grid-template-columns: repeat(3, minmax(300px, 1fr));
    grid-gap: 1rem;
    justify-content: center;
}

/* 响应式布局 */
@media (max-width: 900px) {
    .monitor-list > .monitor-list {
        grid-template-columns: repeat(1, 1fr);
    }
}
@media (min-width: 901px) and (max-width: 1400px) {
    .monitor-list > .monitor-list {
        grid-template-columns: repeat(2, 1fr);
    }
}
@media (min-width: 1401px) {
    .monitor-list > .monitor-list {
        grid-template-columns: repeat(3, 1fr);
    }
}

/* ============================
   7. 卡片样式（监控项）
============================ */
/* 明亮主题 */
.shadow-box {
    background-color: rgba(255, 255, 255, 0.65);
    padding: 10px;
    margin: 5px;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    text-decoration: none;
}

/* 暗色主题 */
.dark .shadow-box:not(.alert) {
    background-color: rgba(0, 0, 0, 0.35);
    padding: 20px;
    margin: 10px;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* 边框 + Hover 效果 */
.monitor-list .item,
.shadow-box {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    overflow: hidden;
    transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.dark .monitor-list .item,
.dark .shadow-box {
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.monitor-list .item:hover,
.shadow-box:hover {
    border-color: rgba(0, 123, 255, 0.8);
    box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

/* ============================
   8. 侧边栏样式
============================ */
.sidebar {
    background-color: rgba(255, 255, 255, 0.9);
    padding: 20px;
    margin: 10px;
    border-radius: 12px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

/* ============================
   9. 服务文字样式
============================ */
/* 服务名称 */
.item-name {
    font-family: "BodyFont", sans-serif;
}

/* 服务描述 */
.description {
    font-family: "BodyFont", sans-serif;
}

/* 刷新信息 */
.refresh-info[data-v-b8247e57] {
    font-family: "BodyFont", sans-serif;
}
```


2. 薅过来的：
- 演示：[https://uptime.ets2la.cn/status/ets2la](https://uptime.ets2la.cn/status/ets2la)
- 源码
```
/* 自定义字体定义 */  
@font-face {  
    font-family: '1666963922';  
    src: url('https://jsd.cdn.zzko.cn/gh/54ayao/ACG@main/static/fonts/1666963922.woff') format('woff');  
    font-weight: normal;  
    font-style: normal;  
}  
  
/* 全局样式 */  
body {  
    font-family: '1666963922', sans-serif; /* 使用自定义字体 */  
    color: #333;  
    margin: 0;  
    padding: 0;  
    background-image: url('https://api.goodnightan.com'); /* 自适应背景图片API */  
    background-attachment: fixed;  
    background-size: cover;  
    background-position: center center;  
    background-repeat: no-repeat;  
}  
  
/* 导航栏链接悬停样式 */  
.navbar a:hover {  
    text-decoration: underline;  
}  
  
/* 卡片样式 */  
.card {  
    background-color: #fff;  
    border-radius: 5px;  
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
    margin-bottom: 20px;  
    padding: 20px;  
}  
  
/* 卡片标题样式 */  
.card-title {  
    font-size: 18px;  
    font-weight: bold;  
    margin-bottom: 10px;  
}  
  

/* 在明亮主题下，应用不同的背景色及75%透明度 */   
.shadow-box {  
    background-color: rgba(255, 255, 255, 0.75);  
    padding: 10px;  
    margin: 5px;  
    border-radius: 10px;  
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
  text-decoration: none; 
 
}  
/* 在暗色主题下，应用不同的背景色及65%透明度 */  
.dark .shadow-box:not(.alert) {  
    background-color: rgba(0, 0, 0, 0.65); 
     padding: 20px;  
    margin: 10px;  
    border-radius: 5px;  
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
}
/* 侧边栏样式 */  
.sidebar {  
    background-color: rgba(255, 255, 255, 0.9);  
    padding: 20px;  
    margin: 10px;  
    border-radius: 5px;  
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);  
}  
  
/* 特定元素和类的样式 */     
span[data-v-7d4a7f28],  
.item-name,  
div.description[data-v-7d4a7f28][data-v-b8247e57][contenteditable="true"],  
div[data-v-7d4a7f28][data-v-b8247e57].alert-heading.p-2,  
.refresh-info > div,  
.alert-heading.p-2 > div,  
.alert-heading.p-2 > p, 
.alert-heading.p-2 > h1 {  
    background-image: linear-gradient(90deg, #07c160, #fb6bea 25%, #3aedff 50%, #fb6bea 75%, #28d079);  
    font-family: '1666963922', sans-serif;  
    -webkit-text-fill-color: transparent;  
    -webkit-background-clip: text;  
    background-size: 400% 100%;  
    animation: wzw 10s linear infinite;  
}  
  
/* 动画关键帧定义 */  
@keyframes wzw {  
    0% {  
        background-position: 0% 50%;  
    }  
    50% {  
        background-position: 100% 50%;  
    }  
    100% {  
        background-position: 0% 50%;  
    }  
}
  #app {  
font-family: '1666963922', BlinkMacSystemFont, 'segoe ui', Roboto, 'helvetica neue', Arial, 'noto sans', sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol', 'noto color emoji' !important;
}
```