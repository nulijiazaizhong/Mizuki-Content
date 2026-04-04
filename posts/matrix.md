---
title: Matrix(synapse)的搭建
published: 2025-10-15
description: '配合哪吒监控时间通知'
image: '/images/posts/matrix.png'
tags: [matrix, 通知]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## compose文件
```
services:
  db:
    image: postgres:15
    restart: unless-stopped
    environment:
      POSTGRES_USER: synapse
      POSTGRES_PASSWORD: synapse_password
      POSTGRES_DB: synapse
      POSTGRES_INITDB_ARGS: "--encoding=UTF8 --locale=C"
    volumes:
      - ./data/postgres:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U synapse"]
      interval: 5s
      timeout: 15s
      retries: 5

  synapse:
    image: matrixdotorg/synapse:latest
    container_name: matrix_synapse
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      SYNAPSE_SERVER_NAME: test.goodnightan.com
      SYNAPSE_REPORT_STATS: yes
      SYNAPSE_ENABLE_REGISTRATION: yes
    volumes:
      - ./data:/data
    ports:
      - "8008:8008"  # 内部服务端口，如果用反向代理可以注释掉

```

## 生成配置文件
```
docker run -it --rm \
  -v $(pwd)/data:/data \
  -e SYNAPSE_SERVER_NAME=matrix.example.com \  # 修改为自己的域名
  -e SYNAPSE_REPORT_STATS=yes \ # 收否向官方发送 **匿名统计信息**
  matrixdotorg/synapse:latest generate
```

## 修改配置文件
打开 matrix 文件夹下面的 `homeserver.yml` 文件，检查 `server_name` 是否为你想要设置的域名，修改 `database` 的内容为以下内容
```
database:
  name: psycopg2
  args:
    user: synapse
    password: synapse_password 
    database: synapse
    host: db
    port: 5432
```
:::warning
user、password、database 字段分别与compose中的 POSTGRES_USER、POSTGRES_PASSWORD、POSTGRES_DB 一一对应
:::

## 启动
启动服务
```
docker compose up -d
```
查看数据库日志
```
docker compose logs -f db
```
查看容器日志
```
docker compose logs -f synapse
```
