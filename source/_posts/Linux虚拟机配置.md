---
title: Linux 虚拟机配置
date: 2026-06-20 10:00:00
categories:
  - 技术
tags:
  - Linux
  - Ubuntu
  - 虚拟机
  - Windows
description: 本篇记录了在windows系统上配置虚拟机的过程。
cover: /img/covers/cover-linux-vm.svg
---
# 从零开始：Windows 11 上配置 Ubuntu 24.04 虚拟机完整指南

**作者：Disboundary**

---

## 前言

作为一名有志于成为技术死宅男（bushi）的大学生，我决定在自己的 Windows 11 电脑上搭建 Linux 开发环境。经过一整天的折腾，我从一个对 Linux 一无所知的小白，成功配置好了 Ubuntu 24.04 虚拟机，并解决了**各种奇奇怪怪的问题**。

这篇文章记录了我完整的配置过程，希望能帮到同样想入门 Linux 的你。

---

## 一、为什么选择虚拟机？

在开始之前，我调研了三种在 Windows 上使用 Linux 的方案：

### 方案对比

| 方案 | 优点 | 缺点 | 适合人群 |
|------|------|------|----------|
| **WSL（Windows 子系统）** | 安装简单、启动快、资源占用少 | 没有图形桌面、某些功能受限 | 只需要命令行的开发者 |
| **双系统** | 性能满血、真实体验 | 有分区风险、只能用一个系统 | 有经验的用户 |
| **虚拟机** | 完整桌面、安全隔离、可随时重装 | 性能有损耗、占用资源较多 | **新手学习首选** ✅ |

### 我的选择：虚拟机

作为新手，我选择了虚拟机方案，原因如下：

```
✅ 安全：搞坏了可以一键重装，不影响 Windows
✅ 完整：有完整的 Linux 桌面体验
✅ 灵活：可以同时使用 Windows 和 Linux
✅ 学习：未来做科研需要熟悉 Linux 环境
```

---

## 二、硬件配置与资源分配

### 我的电脑配置

| 硬件 | 配置 |
|------|------|
| **操作系统** | Windows 11 |
| **内存** | 27.8 GB |
| **CPU** | 8 核 16 线程 |
| **硬盘** | D 盘空间充足 |

### 虚拟机资源分配

| 资源 | 分配给虚拟机 | 留给 Windows |
|------|-------------|--------------|
| **内存** | 8 GB（8192 MB） | 19.8 GB |
| **CPU** | 4 核 | 4 核（8 线程） |
| **硬盘** | 120 GB（动态分配） | 剩余空间 |
| **显存** | 128 MB | - |

**分配原则：** 给虚拟机足够的资源保证流畅运行，同时给 Windows 留足资源避免主机卡顿。

---

## 三、需要下载的软件

### 1. VirtualBox（虚拟机软件）

**下载地址：** https://www.virtualbox.org/wiki/Downloads

**选择：** Windows hosts（约 110 MB）

**说明：** VirtualBox 是 Oracle 开发的开源虚拟机软件，完全免费，功能强大。

### 2. Ubuntu 24.04 LTS ISO 镜像

**下载地址：** https://repo.huaweicloud.com/ubuntu-releases/24.04/ubuntu-24.04.4-desktop-amd64.iso

**文件大小：** 约 6.2 GB

**说明：** 使用华为云镜像下载速度更快。Ubuntu 24.04 LTS 是长期支持版本，支持到 2029 年。

---

## 四、安装 VirtualBox

### 步骤

```
1. 双击下载的 VirtualBox 安装包
2. 如果弹出 UAC 提示，点「是」
3. 进入安装向导，一路点「Next」
4. 警告网络中断时点「Yes」
5. 点击「Install」开始安装
6. 等待安装完成（1-2 分钟）
7. 点击「Finish」完成
```

**可能需要重启电脑。**

---

## 五、创建 Ubuntu 虚拟机

### 步骤 1：创建虚拟机存放目录

```
在 D 盘创建文件夹：
D:\VirtualBox VMs\Ubuntu-Dev
```

### 步骤 2：新建虚拟机

```
1. 打开 VirtualBox
2. 点击左上角「新建」
3. 填写配置：
   ├── 名称：Ubuntu-Dev
   ├── 文件夹：D:\VirtualBox VMs\Ubuntu-Dev
   ├── 类型：Linux
   └── 版本：Ubuntu (64-bit)
4. 点击「下一步」
```

### 步骤 3：配置内存

```
内存大小：8192 MB（8 GB）
说明：根据你的总内存调整，建议虚拟机分配总内存的 1/3 到 1/2
```

### 步骤 4：创建虚拟硬盘

```
1. 选择「现在创建虚拟硬盘」
2. 点击「创建」
3. 文件类型：VDI（VirtualBox 磁盘映像）
4. 存储方式：动态分配
5. 文件位置：D:\VirtualBox VMs\Ubuntu-Dev\Ubuntu-Dev.vdi
6. 大小：120 GB
7. 点击「创建」
```

**为什么选择动态分配？**
```
动态分配 = 用多少占多少
├── 创建时不会立刻占用 120GB 空间
├── 随着使用逐渐增加
└── 节省磁盘空间
```

### 步骤 5：配置虚拟机设置

#### 系统设置
```
设置 → 系统 → 主板
├── 启用 EFI：✅ 勾选（推荐，启动更快更安全）
├── 内存：8192 MB
└── 启动顺序：光驱第一，硬盘第二

设置 → 系统 → 处理器
├── 处理器数量：4 核
└── 执行上限：100%
```

#### 显示设置
```
设置 → 显示 → 屏幕
├── 显存大小：128 MB
├── 图形控制器：VMSVGA（推荐用于 Linux）
└── 启用 3D 加速：尝试勾选（如果可选）
```

#### 存储设置
```
设置 → 存储
├── 点击「控制器：IDE」下的「💿 空」
├── 右侧点击光盘图标 → 「选择虚拟光盘文件」
├── 浏览选择下载的 Ubuntu ISO 文件
└── 点击「确定」
```

#### 网络设置
```
设置 → 网络
├── 连接方式：NAT（网络地址转换）
└── 说明：让虚拟机通过主机上网
```

#### 共享设置
```
设置 → 常规 → 高级
├── 共享剪贴板：双向
└── 拖放：双向
```

---

## 六、安装 Ubuntu 系统

### 步骤 1：启动虚拟机

```
1. 选中「Ubuntu-Dev」虚拟机
2. 点击「启动」按钮 ▶️
3. 等待从 ISO 文件启动
```

### 步骤 2：选择语言

```
建议选择：English（学习资料多，命令行环境常用）
点击「Install Ubuntu」
```

### 步骤 3：键盘布局

```
选择：English (US)
点击「Continue」
```

### 步骤 4：更新和其他软件

```
├── 选择「Normal installation」
├── ☑ Download updates while installing Ubuntu
└── ☑ Install third-party software
点击「Continue」
```

### 步骤 5：安装类型

```
选择：Erase disk and install Ubuntu
⚠️ 这只影响虚拟机，不影响你的 Windows！
点击「Install Now」→「Continue」
```

### 步骤 6：时区

```
点击地图上的中国位置
或输入：Shanghai
点击「Continue」
```

### 步骤 7：设置用户名和密码

```
Your name:        你的名字
Your computer's name: Ubuntu-Dev
Pick a username:  ubuntu（建议小写英文）
Choose a password: 设置一个密码（记住它！）
Confirm password: 再输入一次

选择：Require my password to log in
点击「Continue」
```

### 步骤 8：等待安装

```
安装过程：10-20 分钟
可以去喝杯咖啡 ☕
```

### 步骤 9：重启

```
安装完成后：
1. 点击「Restart Now」
2. 提示移除安装介质时按 Enter
3. 等待重启完成
4. 输入密码登录
```

**恭喜！你已经成功进入 Ubuntu 桌面！** 🎉

---

## 七、安装 VirtualBox 增强功能（重要！）

### 什么是增强功能？

```
VirtualBox 增强功能 = 虚拟机的「驱动程序」
├── ✅ 自动调整分辨率（窗口缩放时）
├── ✅ 共享剪贴板（Windows ↔ Ubuntu 复制粘贴）
├── ✅ 拖拽文件传输
└── ✅ 更好的性能
```

### 安装方法

#### 方法 1：从 ISO 安装（推荐）

```
1. 在虚拟机窗口菜单栏：设备 → 安装增强功能
2. 如果弹出自动运行提示，点击「运行」
3. 如果没有自动运行，打开终端执行：
```

```bash
# 进入光盘目录
cd /media/$USER/VBox_GAs_*

# 安装编译工具和内核头文件（如果提示缺少）
sudo apt install build-essential linux-headers-$(uname -r) -y

# 运行安装脚本
sudo ./VBoxLinuxAdditions.run

# 重启虚拟机
sudo reboot
```

#### 方法 2：从 Ubuntu 软件源安装

```bash
# 更新软件源
sudo apt update

# 安装增强功能
sudo apt install virtualbox-guest-utils virtualbox-guest-x11 -y

# 重启虚拟机
sudo reboot
```

### 安装后验证

```bash
# 检查内核模块是否加载
lsmod | grep vbox

# 预期输出：
# vboxsf                 90112  1
# vboxvideo              36864  1
# vboxguest             454656  6 vboxsf,vboxvideo
```

### 可能遇到的问题

#### 问题 1：提示缺少内核头文件

```bash
# 解决：安装内核头文件
sudo apt install linux-headers-$(uname -r) build-essential -y
sudo ./VBoxLinuxAdditions.run
```

#### 问题 2：找不到 vboxadd-service 服务

```bash
# 手动创建服务文件
sudo nano /etc/systemd/system/vboxadd-service.service
```

**粘贴以下内容：**
```ini
[Unit]
Description=VirtualBox Guest Additions Service
After=systemd-udevd.service vboxadd.service
ConditionVirtualization=oracle

[Service]
Type=forking
ExecStart=/usr/bin/VBoxService
ExecStop=/usr/bin/VBoxService --kill
Restart=on-failure
RestartSec=3

[Install]
WantedBy=multi-user.target
```

**启动服务：**
```bash
sudo systemctl daemon-reload
sudo systemctl enable vboxadd-service
sudo systemctl start vboxadd-service
```

#### 问题 3：virtualbox-guest-dkms 找不到

```bash
# 这个包在 Ubuntu 24.04 中可能不存在
# 使用 ISO 安装或从软件源安装 virtualbox-guest-utils
sudo apt install virtualbox-guest-utils virtualbox-guest-x11 -y
```

---

## 八、解决分辨率和缩放问题

### 问题：图标和文字太小

高分辨率（如 1920x1080）在虚拟机窗口中显示时，图标和文字会显得很小。

### 解决方案

#### 方案 1：调整显示缩放（推荐）

```
1. 打开「设置」→「显示」
2. 找到「缩放」或「Scale」选项
3. 调整到 125% 或 150%
4. 点击「应用」
```

#### 方案 2：启用分数缩放

```bash
# 启用分数缩放选项
gsettings set org.gnome.mutter experimental-features "['scale-monitor-framebuffer']"

# 注销并重新登录
# 然后在「设置」→「显示」中就能看到 125%、150% 等选项
```

#### 方案 3：调整字体大小

```bash
# 临时调整文本缩放比例（立即生效）
gsettings set org.gnome.desktop.interface text-scaling-factor 1.5

# 恢复默认
gsettings set org.gnome.desktop.interface text-scaling-factor 1.0
```

#### 方案 4：安装 GNOME Tweaks

```bash
sudo apt install gnome-tweaks -y
```

**使用 Tweaks 调整：**
```
1. 打开「Tweaks」应用
2. 选择「字体」
3. 调整「缩放比例」为 1.25 或 1.5
```

### 手动设置分辨率

```bash
# 查看当前分辨率
xrandr

# 添加自定义分辨率（如 1920x1080）
cvt 1920 1080 60
xrandr --newmode "1920x1080_60.00"  173.00  1920 2048 2248 2576  1080 1083 1088 1120 -hsync +vsync
xrandr --addmode Virtual1 "1920x1080_60.00"
xrandr --output Virtual1 --mode "1920x1080_60.00"
```

---

## 九、配置代理（可选）

如果你的网络需要代理才能访问外网，可以在 Ubuntu 中配置：

### 方法 1：环境变量代理

```bash
# 编辑 ~/.bashrc
nano ~/.bashrc

# 在文件末尾添加（替换为你的实际代理地址和端口）
export http_proxy="http://10.0.2.2:7890"
export https_proxy="http://10.0.2.2:7890"
export all_proxy="socks5://10.0.2.2:7890"

# 保存退出后使配置生效
source ~/.bashrc
```

**说明：** NAT 模式下，使用 `10.0.2.2` 访问 Windows 主机的代理。

### 方法 2：apt 专用代理

```bash
sudo nano /etc/apt/apt.conf.d/95proxies
```

**添加：**
```
Acquire::http::Proxy "http://10.0.2.2:7890";
Acquire::https::Proxy "http://10.0.2.2:7890";
```

---

## 十、更换软件源（提高下载速度）

### 使用国内镜像源

```bash
# 备份原有源
sudo cp /etc/apt/sources.list /etc/apt/sources.list.backup

# 编辑源文件
sudo nano /etc/apt/sources.list
```

**替换为阿里云源（Ubuntu 24.04）：**
```
deb http://mirrors.aliyun.com/ubuntu/ noble main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ noble main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ noble-security main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ noble-security main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ noble-updates main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ noble-updates main restricted universe multiverse
deb http://mirrors.aliyun.com/ubuntu/ noble-backports main restricted universe multiverse
deb-src http://mirrors.aliyun.com/ubuntu/ noble-backports main restricted universe multiverse
```

**更新软件源：**
```bash
sudo apt update
```

---

## 十一、推荐安装的应用

### 开发工具

```bash
# VS Code（代码编辑器）
sudo snap install code --classic

# Git（版本控制）
sudo apt install git -y

# Python 科学计算环境
sudo apt install python3 python3-pip python3-venv -y
pip3 install numpy pandas matplotlib scipy
```

### 系统工具

```bash
# htop（系统监控）
sudo apt install htop -y

# Neofetch（系统信息）
sudo apt install neofetch -y

# GNOME Tweaks（系统美化）
sudo apt install gnome-tweaks -y

# Terminator（多窗口终端）
sudo apt install terminator -y
```

### 实用工具

```bash
# VLC（媒体播放器）
sudo apt install vlc -y

# GIMP（图像编辑）
sudo apt install gimp -y

# Flameshot（截图工具）
sudo apt install flameshot -y
```

---

## 十二、常用 Linux 命令速查

### 文件和目录操作

| 命令 | 作用 | 示例 |
|------|------|------|
| `pwd` | 显示当前目录 | `pwd` |
| `ls` | 列出文件 | `ls -la` |
| `cd` | 切换目录 | `cd Documents` |
| `mkdir` | 创建目录 | `mkdir my_project` |
| `touch` | 创建文件 | `touch hello.py` |
| `cat` | 查看文件内容 | `cat hello.py` |
| `cp` | 复制文件 | `cp file1.txt file2.txt` |
| `mv` | 移动/重命名 | `mv old.txt new.txt` |
| `rm` | 删除文件 | `rm file.txt` |

### 系统管理

| 命令 | 作用 | 示例 |
|------|------|------|
| `sudo` | 管理员权限 | `sudo apt update` |
| `apt update` | 更新软件源 | `sudo apt update` |
| `apt install` | 安装软件 | `sudo apt install vim` |
| `apt remove` | 卸载软件 | `sudo apt remove vim` |
| `reboot` | 重启系统 | `sudo reboot` |
| `poweroff` | 关机 | `sudo poweroff` |

### 网络工具

| 命令 | 作用 | 示例 |
|------|------|------|
| `ping` | 测试网络连接 | `ping google.com` |
| `curl` | 下载/测试 | `curl -I https://example.com` |
| `wget` | 下载文件 | `wget https://example.com/file` |
| `ip addr` | 查看 IP 地址 | `ip addr show` |

---

## 十三、最终成果

经过一整天的折腾，我终于成功配置好了：

```
✅ Ubuntu 24.04 LTS 虚拟机
✅ VirtualBox 增强功能（分辨率自动调整、剪贴板共享）
✅ 舒适的显示缩放（150%）
✅ 国内镜像源（下载速度快）
✅ 基础开发工具（VS Code、Git、Python）
```

### 虚拟机配置总结

| 配置项 | 设置值 |
|--------|--------|
| **内存** | 8 GB |
| **CPU** | 4 核 |
| **硬盘** | 120 GB（动态分配） |
| **显存** | 128 MB |
| **图形控制器** | VMSVGA |
| **固件** | EFI |
| **网络** | NAT |
| **共享剪贴板** | 双向 |

---

## 十四、踩坑记录与经验总结

### 踩坑 1：ISO 文件需要手动加载到虚拟光驱

**问题：** 创建虚拟机后，ISO 文件没有自动加载。

**解决：** 在虚拟机设置 → 存储中，手动将 ISO 文件分配给 IDE 控制器。

### 踩坑 2：增强功能安装失败

**问题：** 从软件源安装的增强功能版本可能与 VirtualBox 版本不匹配。

**解决：** 使用 ISO 安装增强功能（设备 → 安装增强功能）。

### 踩坑 3：virtualbox-guest-dkms 找不到

**问题：** Ubuntu 24.04 的官方仓库中可能没有这个包。

**解决：** 不需要这个包，使用 ISO 安装或安装 virtualbox-guest-utils。

### 踩坑 4：分辨率调整后图标太小

**问题：** 高分辨率导致图标和文字很小。

**解决：** 在「设置」→「显示」中调整缩放比例，或使用 GNOME Tweaks 调整字体缩放。

### 踩坑 5：电脑发烫

**问题：** 虚拟机占用资源过多导致电脑发烫。

**解决：**
- 减少虚拟机内存分配（从 10GB 降到 8GB）
- 调整 CPU 执行上限（从 100% 降到 80%）
- 关闭不必要的服务

---

## 十五、后续计划

### 学习路线

```
第 1-2 周：熟悉基本 Linux 命令
├── ls, cd, pwd, mkdir, touch, cat
├── sudo, apt install, apt update
└── 文件权限、用户管理

第 3-4 周：学习 Python 和开发工具
├── VS Code 使用
├── Git 版本控制
└── Python 基础编程

第 2 个月：进阶技能
├── Shell 脚本编写
├── SSH 连接服务器
└── Docker 基础

第 3 个月起：科研准备
├── ROS2 学习
├── PyTorch/TensorFlow
└── 机器人仿真
```

### 推荐学习资源

```
├── B 站：搜索「Linux 入门教程」
├── 书籍：《鸟哥的 Linux 私房菜》
├── 网站：Linux 命令大全 https://www.linuxcool.com/
└── 练习：https://overthewire.org/wargames/bandit/
```

---

## 十六、结语

配置 Linux 虚拟机的过程虽然有些曲折，但每解决一个问题都是一次学习。从完全不懂 Linux，到现在能够熟练地使用终端命令、安装软件、配置系统，这本身就是一个巨大的进步。

希望这篇文章能帮到同样想入门 Linux 的你。记住，遇到问题不要怕，Google 和社区是你最好的朋友。

**加油，未来的科研人！** 🚀

---

**文章写于：** 2026年5月11日  
**环境：** Windows 11 + VirtualBox 7.x + Ubuntu 24.04 LTS  
**字数：** 约 5000 字

---

*如果这篇文章对你有帮助，欢迎收藏和分享！有任何问题也欢迎在评论区讨论。*
