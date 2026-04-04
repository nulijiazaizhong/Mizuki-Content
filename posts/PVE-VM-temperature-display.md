---
title: 将PVE的温度与公告信息添加到Linux虚拟机中
published: 2025-11-14
description: '在PVE虚拟机中显示温度信息并给Astrbot插件调用'
image: ''
tags: [PVE, Astrbot]
category: '运维'
draft: false 
lang: 'zh-CN'
---

## 1. 在PVEwebui的系统概要中显示温度
使用脚本一键完成
```
wget -O /root/showtempcpufreq.sh https://raw.githubusercontent.com/a904055262/PVE-manager-status/main/showtempcpufreq.sh && chmod +x /root/showtempcpufreq.sh && /root/showtempcpufreq.sh
```

参考资料：[GitHub - a904055262/PVE-manager-status](https://github.com/a904055262/PVE-manager-status)

## 2. 将PVE的温度信息同步到Linux虚拟机中
### 2.1. 前提提要
PVE版本：9.0.5
虚拟机系统：Ubuntu server 24.04.3 LTS
虚拟机机型：q35（为必须，否则将无法挂载温度文件到虚拟机）

### 2.2 在 PVE 宿主机上定时获取 CPU 温度

#### 2.2.1. 创建共享目录并设置权限
在 PVE 主机上执行：
```
# 创建目录（按需修改路径）
mkdir -p /srv/virtfs/sharedtemp

# 设置所有者与权限（允许宿主写、虚拟机读）
chown root:root /srv/virtfs/sharedtemp
chmod 755 /srv/virtfs/sharedtemp
```
各位可以自行修改目录的位置，记得这里修改了，后面关于位置的信息也要进行修改
#### 2.2.2. 安装并启动sensors
```
apt update
apt install lm-sensors -y
sensors-detect --auto
sensors
```
执行完 `sensors` 命令之后应该可以看到这样的输出
```
root@pve:~# sensors
coretemp-isa-0000
Adapter: ISA adapter
Package id 0:  +32.0°C  (high = +90.0°C, crit = +100.0°C)
Core 0:        +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 1:        +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 2:        +32.0°C  (high = +90.0°C, crit = +100.0°C)
Core 3:        +32.0°C  (high = +90.0°C, crit = +100.0°C)
Core 4:        +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 5:        +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 6:        +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 8:        +29.0°C  (high = +90.0°C, crit = +100.0°C)
Core 9:        +32.0°C  (high = +90.0°C, crit = +100.0°C)
Core 10:       +31.0°C  (high = +90.0°C, crit = +100.0°C)
Core 11:       +32.0°C  (high = +90.0°C, crit = +100.0°C)
Core 12:       +32.0°C  (high = +90.0°C, crit = +100.0°C)
Core 13:       +29.0°C  (high = +90.0°C, crit = +100.0°C)
Core 16:       +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 17:       +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 18:       +31.0°C  (high = +90.0°C, crit = +100.0°C)
Core 19:       +31.0°C  (high = +90.0°C, crit = +100.0°C)
Core 20:       +29.0°C  (high = +90.0°C, crit = +100.0°C)
Core 21:       +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 22:       +29.0°C  (high = +90.0°C, crit = +100.0°C)
Core 24:       +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 25:       +29.0°C  (high = +90.0°C, crit = +100.0°C)
Core 26:       +30.0°C  (high = +90.0°C, crit = +100.0°C)
Core 27:       +31.0°C  (high = +90.0°C, crit = +100.0°C)
Core 28:       +31.0°C  (high = +90.0°C, crit = +100.0°C)
Core 29:       +32.0°C  (high = +90.0°C, crit = +100.0°C)

pch_lewisburg-virtual-0
Adapter: Virtual device
temp1:        +45.0°C  

coretemp-isa-0001
Adapter: ISA adapter
Package id 1:  +37.0°C  (high = +90.0°C, crit = +100.0°C)
Core 0:        +37.0°C  (high = +90.0°C, crit = +100.0°C)
Core 1:        +37.0°C  (high = +90.0°C, crit = +100.0°C)
Core 2:        +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 3:        +34.0°C  (high = +90.0°C, crit = +100.0°C)
Core 4:        +34.0°C  (high = +90.0°C, crit = +100.0°C)
Core 5:        +36.0°C  (high = +90.0°C, crit = +100.0°C)
Core 6:        +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 8:        +34.0°C  (high = +90.0°C, crit = +100.0°C)
Core 9:        +36.0°C  (high = +90.0°C, crit = +100.0°C)
Core 10:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 11:       +36.0°C  (high = +90.0°C, crit = +100.0°C)
Core 12:       +36.0°C  (high = +90.0°C, crit = +100.0°C)
Core 13:       +37.0°C  (high = +90.0°C, crit = +100.0°C)
Core 16:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 17:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 18:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 19:       +38.0°C  (high = +90.0°C, crit = +100.0°C)
Core 20:       +36.0°C  (high = +90.0°C, crit = +100.0°C)
Core 21:       +34.0°C  (high = +90.0°C, crit = +100.0°C)
Core 22:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 24:       +33.0°C  (high = +90.0°C, crit = +100.0°C)
Core 25:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 26:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 27:       +36.0°C  (high = +90.0°C, crit = +100.0°C)
Core 28:       +35.0°C  (high = +90.0°C, crit = +100.0°C)
Core 29:       +35.0°C  (high = +90.0°C, crit = +100.0°C)

power_meter-acpi-0
Adapter: ACPI interface
power1:      288.00 W  (interval =   1.00 s)
```

#### 2.2.3. 编写采集脚本
创建脚本 `/usr/local/bin/update_cpu_temp.sh`
```
#!/bin/bash

# 可调校正值
CORRECTION=0

# 获取 CPU Package 温度
TEMP=$(sensors 2>/dev/null | grep -m1 -E "Package id|Package" | awk '{print $4}')
if [ -z "$TEMP" ]; then
  TEMP=$(sensors 2>/dev/null | grep -m1 'Core 0' | awk '{print $3}')
fi
TEMP_NUM=$(echo "$TEMP" | sed 's/[^0-9.]//g')
if [ -z "$TEMP_NUM" ]; then TEMP_NUM=0; fi
ADJUSTED_TEMP=$(echo "$TEMP_NUM + $CORRECTION" | bc)
ADJUSTED_TEMP_FMT=$(printf "%.1f°C" "$ADJUSTED_TEMP")

# 获取功率
POWER=$(sensors 2>/dev/null | grep -m1 'power1' | awk '{print $2}')
POWER_NUM=$(echo "$POWER" | sed 's/[^0-9.]//g')
if [ -z "$POWER_NUM" ]; then POWER_NUM=0; fi
POWER_FMT=$(printf "%.1fW" "$POWER_NUM")

# 时间戳
DATE=$(date -Is)

# 写入文件
echo "$DATE CPU:$ADJUSTED_TEMP_FMT POWER:$POWER_FMT" > /srv/virtfs/sharedtemp/cpu_temp.txt
echo "$DATE CPU:$ADJUSTED_TEMP_FMT POWER:$POWER_FMT" >> /srv/virtfs/sharedtemp/cpu_temp.log
```
给权限
```
chmod +x /usr/local/bin/update_cpu_temp.sh
```
创建写入目录
```
mkdir -p /srv/virtfs/sharedtemp
chmod 777 /srv/virtfs/sharedtemp
```
定期执行脚本（使用 systemd timer）
创建 service 单元 `/etc/systemd/system/update-cpu-temp.service`
```
[Unit]
Description=Update CPU temp file

[Service]
Type=oneshot
ExecStart=/usr/local/bin/update_cpu_temp.sh
```
创建 timer `/etc/systemd/system/update-cpu-temp.timer
```
[Unit]
Description=Run update-cpu-temp every minute

[Timer]
OnCalendar=*:0/1
Persistent=true
Unit=update-cpu-temp.service

[Install]
WantedBy=timers.target
```
启动并启用定期执行：
```
systemctl daemon-reload
systemctl enable --now update-cpu-temp.timer
```
验证宿主机端写入是否正常
```
# 等几秒后查看文件
cat /srv/virtfs/sharedtemp/cpu_temp.txt
tail -n 20 /srv/virtfs/sharedtemp/cpu_temp.log
```
### 2.3 创建并挂载
#### 2.3.1 创建并添加VirtIO FS
1. 在PVEwebui中选择 `数据中心` ，找到 `存储` ，`添加` 一个 `目录`；`ID` 可以随意填写， `目录` 为 在PVE中创建共享目录所使用的文件夹（我这里就是 `/srv/virtfs/sharedtemp` 这个目录）
2. 点击虚拟机，现将**虚拟机关机**，再选择 `硬件` ，点击 `添加` ，选择 `VirtIofs` ，点击 `目录ID` 之后会让选择，这里我们选择刚才填写的ID， 然后点击添加即可；再点击虚拟机下的 `选项`，将 `QEMU Guest Agent` 设为启用
3. 打开虚拟机，依次执行一下命令，安装 `QEMU Guest Agent` 
```
apt-get install qemu-guest-agent
sudo systemctl start qemu-guest-agent
sudo systemctl enable qemu-guest-agent
```
#### 2.3.2 在虚拟机中添加挂载点
```
sudo mkdir -p /mnt/sharedtemp
sudo mount -t virtiofs sharedtemp /mnt/sharedtemp
```
挂载后可以测试：
```
cat /mnt/sharedtemp/cpu_temp.txt
```
你应该能看到这样的输出
```
2025-11-14T00:04:35+08:00 CPU:32.0°C POWER:283.0W
```
至此，整个过程就这样结束了