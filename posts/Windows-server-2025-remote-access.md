---
title: Windows Server 2025 多用户远程连接
published: 2026-01-25
description: '在不购买密钥的情况下，实现多用户远程连接到 Windows Server 2025 的方法。'
tags: [Windows Server, 远程连接]
category: '教程'
draft: false 
lang: 'zh-CN'
---

## 背景

前段时间在PVE里面开了个Windows 11的虚拟机用啦作为开发环境，在和朋友炫耀了一下，朋友也表示想要，我想着那就也开一台给朋友吧，当我给虚拟机分配了32GB内存之后发现启动不了，一看是我PVE的128GB的内存被吃满了，于是就想到了Windows Server不是可以多用户用一台机器吗？然后我就部署了一台Windows Server准备试试水，结果发现并不行

## 解决方案

### 配置远程桌面服务许可证服务器

1. 使用管理员帐户登录待配置的远程桌面服务许可证服务器。
2. 在服务器管理器>仪表板界面，单击“添加角色和功能”。
![](https://tuchuang.goodnightan.com/PicGo/20260125214009.png)
3. 在弹出的“添加角色和功能向导”窗口单击“下一步”。
![](https://tuchuang.goodnightan.com/PicGo/20260125214046.png)
4. “安装类型”选择“基于角色或基于功能的安装”，并单击“下一步”。
![](https://tuchuang.goodnightan.com/PicGo/20260125214149.png)
5. 选择待配置的远程桌面服务许可证服务器。（如为单台服务器按默认就行）
![](https://tuchuang.goodnightan.com/PicGo/20260125214305.png)
6. 点选“远程桌面服务”，然后连续单击“下一步”，直至“角色服务”页面。
![](https://tuchuang.goodnightan.com/PicGo/20260125214426.png)
7. 在“角色服务”页面，点选“远程桌面授权”和“远程桌面会话主机”，并单击“下一步”。注：如果当前服务器不提供远程桌面服务时不点选“远程桌面会话主机”
![](https://tuchuang.goodnightan.com/PicGo/20260125214615.png)
8. 单击“安装”，等待几分钟完成安装并重启服务器
![](https://tuchuang.goodnightan.com/PicGo/20260125214711.png)
![](https://tuchuang.goodnightan.com/PicGo/20260125214744.png)

### 激活远程桌面服务许可证服务器并安装许可证

1. 重启完系统之后打开“远程桌面授权管理器”
![](https://tuchuang.goodnightan.com/PicGo/20260125215051.png)
2. 右键单击待安装许可证的服务器，然后单击“激活服务器”
![](https://tuchuang.goodnightan.com/PicGo/20260125215133.png)
3. 在弹出的“服务器激活向导”页面上单击“下一步”
![](https://tuchuang.goodnightan.com/PicGo/20260125215238.png)
4. 选择“web 浏览器”，然后单击“下一步”
![](https://tuchuang.goodnightan.com/PicGo/20260125215341.png)
5. 打开[https://thecatontheceiling.github.io/LyssaRDSGen/](https://thecatontheceiling.github.io/LyssaRDSGen/)网站，将“服务器激活向导”中显示的 `产品ID` 复制到网站中的 `Product ID (PID):` 下面的输入框中
![](https://tuchuang.goodnightan.com/PicGo/20260125215757.png)
6. 然后点击网页中的 `Generate License Server ID (SPK)` 并将 `Output:` 中的值复制到“服务器激活向导”显示的 `许可证服务器ID` 输入框中，单击“下一步”
![](https://tuchuang.goodnightan.com/PicGo/20260125220025.png)
7. 单击“下一步”完成激活并启动许可证安装
![](https://tuchuang.goodnightan.com/PicGo/20260125220108.png)
8. 单击“下一步”开始许可证安装
![](https://tuchuang.goodnightan.com/PicGo/20260125220155.png)
9. 在网页中的 `License Count:` 随意输入一个数字，在 `License Version and Type:` 中选择服务器对应的版本（如 Windows Server 2025 选择 `Windows Server 2025 Per Device`），然后点击 `Generate License Key Pack(LKP)` 按钮,然后将 `Output:` 中的值复制到“许可证密钥包 ID”下面的输入框中，单击“下一步”
![](https://tuchuang.goodnightan.com/PicGo/20260125220755.png)
10. 单击“完成”以完成许可证安装
![](https://tuchuang.goodnightan.com/PicGo/20260125220840.png)
11. 再次打开“远程桌面授权管理器”，可以看到远程桌面服务许可证服务器已激活
![](https://tuchuang.goodnightan.com/PicGo/20260125220922.png)

### 配置远程桌面会话主机服务器

1. 打开“远程桌面授权诊断程序”，查看当前服务器授权状态如下，可以看到此时并未配置完成，远程桌面会话主机服务器并未指向许可证服务器
![](https://tuchuang.goodnightan.com/PicGo/20260125223625.png)
![](https://tuchuang.goodnightan.com/PicGo/20260125223706.png)
2. 在系统运行窗口输入“gpedit.msc”，打开计算机本地组策略。
3. 展开“本地计算机策略>计算机配置>管理模板>windows组件>远程桌面服务>远程桌面会话主机>授权”，在右侧找到 “使用指定的远程桌面许可服务器”和“设置远程桌面授权模式”两项策略。
![](https://tuchuang.goodnightan.com/PicGo/20260125224048.png)
![](https://tuchuang.goodnightan.com/PicGo/20260125224205.png)
4. 双击打开“使用指定的远程桌面许可证服务器”，并点选“已启用”，在“要使用的许可证服务器”中输入之前激活的许可证服务器主机名或IP。(如远程桌面会话主机服务器与许可证服务器为同一台服务器，直接输入本机的IP或者主机名即可。）
![](https://tuchuang.goodnightan.com/PicGo/20260125224351.png)
![](https://tuchuang.goodnightan.com/PicGo/20260125224507.png)
5. 在系统运行窗口里输入”gpupdate /force”,强制执行本地组策略
6. 再次打开“远程桌面授权诊断程序”，如无任何报错信息，则对于许可证服务器未加域情况且基于用户的授权模式(基于设备的授权模式步骤一样)，整个配置过程完成
![](https://tuchuang.goodnightan.com/PicGo/20260125224558.png)

### 配置多用户

1. 在系统运行窗口输入“lusrmgr.msc”，打开本地用户管理
2. 在“用户”中右键单击空白处，选择“新用户”，创建多个用户用于远程连接
![](https://tuchuang.goodnightan.com/PicGo/20260125225224.png)
3. 打开“设置”选择“系统”，找到“远程桌面”，将“远程桌面”开关打开
4. 点选“远程桌面用户”，点击“添加”，点击“高级”，再点击“立即查找”，在“搜索结构”中选择需要开放的用户，最后连续点击三次“确定”即可
![](https://tuchuang.goodnightan.com/PicGo/20260125225850.png)

## 结语

至此，Windows Server 2025 多用户远程连接配置完成，可以通过远程桌面连接多用户登录到同一台 Windows Server 2025 服务器上进行操作。

## 参考资料

1.[Windows Server 2025远程桌面服务(RDS)许可证服务器配置与客户端访问许可证(CAL)激活步骤](https://www.sohu.com/a/913614805_120111500)
2.[新版 RDS 远程桌面服务激活指南](https://onmyodev.com/2025/11/%E6%96%B0%E7%89%88-rds-%E6%BF%80%E6%B4%BB%E6%8C%87%E5%8D%97/)
