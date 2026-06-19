---
title: 2026-01-16 - Disboundia 开发日志 #[阶段/主题] - [关键内容]
date: 2026-01-17 10:45:59
categories:
  - 开发日志 # 所有开发日志都归到这个分类
  - Hexo
  - Disboundia
  - 图床
  - bug修复
  - anzhiyu
  - Yaml
description: 本篇记录了 Disboundia 博客在 [某阶段/某功能] 的开发过程，包括遇到的问题及解决方案。
cover: /img/covers/cover-dev-2026-01-16.svg
---

### **Disboundia 开发日志：从 Hexo 初始化到 Anzhiyu 主题调试**

**日期**：2026-01-16
**作者**：DaiShiBo
**类别**：`开发日志`
**标签**：`Hexo` `Disboundia` `Anzhiyu` `GitHub Pages` `YAML` `Bug修复` `主题配置` `图床` `Git` `Node.js`
**描述**：本篇日志详细记录了 Disboundia 从基础搭建、域名绑定，到 Anzhiyu 主题引入与调试的关键阶段。重点分析了多次遇到的 `YAMLException` 和 `Invalid time value` 等配置问题及其排查过程，并规划了未来的图床与内容管理策略。

---

#### **1. 本次更新概述 (Summary)**

本次开发围绕 Disboundia 个人博客的**核心基础设施搭建与初步个性化**展开。主要目标是成功部署 Hexo 博客到 GitHub Pages，并顺利切换至 Anzhiyu 主题，为后续的功能集成和内容创作打下坚实基础。过程中，对 YAML 语法、Hexo 主题配置机制、Git 部署流程及常见错误排查有了深入理解。

#### **2. 关键任务与目标 (Key Tasks & Goals)**

*   [x] Hexo 环境初始化与基础博客搭建。
*   [x] 成功部署 Hexo 默认主题至 GitHub Pages。
*   [x] 绑定自定义域名 `disboundary.top` 并配置 DNS 解析。
*   [x] 克隆并安装 Anzhiyu (安知鱼) Hexo 主题。
*   [x] 安装 Anzhiyu 主题所需的核心渲染插件 (`hexo-renderer-pug`, `hexo-renderer-stylus`)。
*   [x] 实现主题配置分离，创建并编辑 `_config.anzhiyu.yml`。
*   [x] **修复多次出现的 `YAMLException: duplicated mapping key` 配置错误。**
*   [X] **修复多次出现的 `RangeError: Invalid time value` 时间配置错误。**
*   [X] 解决 `hexo d` 后网站显示空白的问题。
*   [x] 完成 Hexo + GitHub Pages + Anzhiyu 主题的首次完整部署。
*   [ ] 规划图床方案（GitHub + PicGo + jsDelivr）。
*   [X] 规划博客开发日志的撰写规范。

#### **3. 遇到的问题与解决方案 (Problems & Solutions)**

##### **3.1 Hexo 部署协议选择与 Token 配置**
*   **问题**：在 `_config.yml` 配置 `deploy` 时，HTTPS 协议下推送需要输入密码，直接输入 GitHub 登录密码会失败。
*   **原因分析**：GitHub 自 2021 年起禁用密码进行命令行 Git 操作，需要使用 Personal Access Token (PAT)。
*   **解决方案**：
    1.  前往 GitHub `Settings` -> `Developer settings` -> `Personal access tokens` -> `Tokens (classic)`。
    2.  生成一个新的 Token，**只勾选 `repo` 权限**，并设置为“永不过期”。
    3.  复制 Token 字符串并妥善保存。
    4.  在执行 `hexo d` 弹出密码提示时，粘贴 Token 替代密码。
*   **反思**：初次接触 Git 部署，未了解 GitHub 的安全策略更新，导致鉴权失败。熟悉 PAT 机制是进行任何 GitHub 自动化操作的基础。

##### **3.2 Anzhiyu 主题仓库克隆失败**
*   **问题**：执行 `git clone https://github.com/anzhiyu-c/hexo-theme-anheyu.git themes/anheyu` 时，报错 `remote: Repository not found`。
*   **原因分析**：主题仓库的名称拼写错误，实际应为 `anzhiyu` 而非 `anheyu`。
*   **解决方案**：修正 Git Clone 命令为 `git clone https://github.com/anzhiyu-c/hexo-theme-anzhiyu.git themes/anzhiyu`。
*   **反思**：在命令行操作中，即使是单个字母的拼写错误也可能导致完全不同的结果。日后需更加细致地核对地址和名称。

##### **3.3 `YAMLException: duplicated mapping key` (配置文件重复键)**
*   **问题**：运行 `hexo clean` 或 `hexo g` 时，报错 `duplicated mapping key (980:1)`，指向 `icons:`。
*   **原因分析**：在 `_config.anzhiyu.yml` 文件中，`icons:` 这个配置项在同一层级下被定义了两次。这通常是由于复制粘贴失误或手动修改时重复添加。
*   **解决方案**：使用 VS Code 打开 `_config.anzhiyu.yml`，跳转到报错提示的行数（980行），然后向上或向下搜索 `icons:`，找到并删除其中一个重复的定义。
*   **反思**：YAML 语法对缩进和键的唯一性要求极其严格。此错误强调了仔细检查配置文件结构的重要性。

##### **3.4 `RangeError: Invalid time value` (无效的时间值)**
*   **问题**：运行 `hexo g` 或 `hexo s` 时，多次报错 `Invalid time value`，指向 `card_webinfo.pug` 中的 `theme.runtimeshow.publish_date`。
*   **原因分析**：安知鱼主题的“网站运行时间”卡片需要一个有效的日期来计算博客已运行天数。但 `_config.anzhiyu.yml` 中 `runtimeshow.publish_date` 配置项为空、被注释掉，或者日期格式不正确（例如：`publish_date: ` 或 `publish_date: 2023年10月26日`）。
*   **解决方案**：打开 `_config.anzhiyu.yml`，找到 `runtimeshow.publish_date`，并将其值修改为标准的 `YYYY/MM/DD` 或 `YYYY-MM-DD` 格式的日期，例如 `publish_date: 2023/10/26`。
*   **反思**：日期格式的准确性在编程中至关重要。此错误揭示了主题对特定数据格式的依赖，以及配置文件中每一项都需正确设置的重要性。

##### **3.5 `hexo d` 后线上博客显示空白**
*   **问题**：虽然本地 `hexo d` 提示 `Deploy done: git`，但访问 `disboundary.top` 仍显示空白页面。
*   **原因分析**：
    1.  **根本原因**：之前 `Invalid time value` 报错导致 `hexo g` 生成的 `public` 文件夹内容不完整或有缺陷，Git 将这些有问题的静态文件推送到了 GitHub Pages。
    2.  **次要原因 (需要复查)**：GitHub Pages 的 `Settings` -> `Pages` 中，`Source` 的 `Branch` 和 `/(root)` 路径可能未正确设置或未保存生效；自定义域名 `CNAME` 文件可能缺失或配置错误。
*   **解决方案**：
    1.  **优先解决所有 `hexo g` 阶段的错误**（即上述的 `Invalid time value`）。
    2.  确保 `source` 目录下存在一个名为 `CNAME`（无后缀）的文件，且内容为 `disboundary.top`。
    3.  执行完整的 `hexo clean && hexo g && hexo d`。
    4.  重新检查 GitHub 仓库 `Settings` -> `Pages` 中 `Branch` 为 `main` 和 `/(root)`，并手动点击 `Save` 按钮强制刷新。
    5.  勾选 `Enforce HTTPS`。
    6.  等待 5-15 分钟，强制刷新浏览器访问 `https://disboundary.top`。
*   **反思**：一个看似成功的部署（`Deploy done`）并不代表最终效果一定正确。中间的 `hexo g` 阶段的错误才是根源。部署前彻底清除所有本地生成错误至关重要。
##### **3.6 `Invalid time value`**
*   **问题**：`runtimeshow`中`enable`打开后显示`Invalid time value`。
*   **原因分析**：
    1.  **根本原因**：15/1/2026 是“日/月/年”格式，但` Hexo (Node.js) `默认解析逻辑是 “月/日/年”。
系统会尝试把 15 解析为月份（第 15 个月），因为没有 15 月，所以报错` Invalid time value`。
*   **解决方案**：
    1. **修改`publishtime`的格式**


#### **4. 新功能实现与配置 (New Features & Configurations)**

##### **4.1 Anzhiyu 主题配置分离**
*   **目标**：将主题配置从 `themes/anzhiyu/_config.yml` 迁移至博客根目录的 `_config.anzhiyu.yml`。
*   **操作**：复制 `themes/anzhiyu/_config.yml` 到 `D:/Blog/` 并重命名为 `_config.anzhiyu.yml`。
*   **意义**：实现主题配置与核心代码分离，便于主题升级和管理。

##### **4.2 博客名称与 Logo 意境设定**
*   **名称**：确认博客名称为 **Disboundia** (解缚之境)。
*   **域名**：`disboundary.top` (破除边界)。
*   **Logo 意境**：基于手写花体“D”，采用蓝紫色渐变，边缘柔和消散，背景融入蓝紫色霞光下的暗淡草原与隐现雪山，象征知识的显现与无边界的探索。

#### **5. 思考与心得 (Reflections & Learnings)**

本次 Disboundia 博客的初期搭建过程，充满了挑战与学习。从 YAML 语法的严格要求，到 Hexo 内部渲染机制对日期格式的敏感性，再到 Git 部署与 GitHub Pages 交互的细节，每一步都是对基础知识的深化理解。

最大的收获在于：**定位和解决错误的过程本身就是最宝贵的学习。** 面对报错信息，不再是盲目尝试，而是学会分析其指向的文件、行数和错误类型。这让我对“代码即逻辑”有了更直观的感受。

通过安知鱼主题的引入，Disboundia 的外观已从基础跃升至专业级别。下一步，我将专注于实现更丰富的功能，如基于 GitHub + PicGo 的图床管理，以及更多关于“朋友圈”、“相册”、“音乐”等高级模块的配置。同时，将持续以开发日志的形式记录这些探索过程，使 Disboundia 不仅是内容输出的平台，更是个人学习与成长的生动见证。

---
[[深度技术叙事与博客写作助手]]
