---
title: 2026-01-17 - Disboundia 开发日志
date: 2026-01-17 13:45:59
categories:
  - 开发日志
  - Hexo
  - Disboundia
  - 图床
  - bug修复
  - anzhiyu
  - Yaml
description: 本篇记录了 Disboundia 博客在 [某阶段/某功能] 的开发过程，包括遇到的问题及解决方案。
cover: /img/covers/cover-dev-2026-01-17.svg
---

### **Disboundia 开发日志：解决了`Invalid time value`后的界面优化**

**日期**：2026-1-17
**作者**：DaiShiBo
**类别**：`开发日志`
**标签**：`Hexo` `Disboundia` `Anzhiyu` `GitHub Pages` `YAML` `Bug修复` `主题配置` `图床` `Git` `Node.js`
**描述**：本篇日志记录了 Disboundia 解决了 `Invalid time value` 配置问题后的界面优化过程。

---

#### **1. 本次更新概述 (Summary)**

本次开发围绕 Disboundia 个人博客的**界面优化**展开。主要目标是完善主页界面。

#### **2. 关键任务与目标 (Key Tasks & Goals)**

*   [x] 完善PicGo图床配置
*   [x] 绑定其他社交平台账号，解决跳转问题
*   [x] 完善`about`界面
*   [] 完善`album`界面
*   [] 完善运行时间的计算
*   [x] 文章标签的确定


#### **3. 遇到的问题与解决方案 (Problems & Solutions)**

##### **3.1 小红书没有显示**
*   **问题**：在 `_config.yml` 配置 `deploy` 时，HTTPS 协议下推送需要输入密码，直接输入 GitHub 登录密码会失败。
*   **原因分析**：GitHub 自 2021 年起禁用密码进行命令行 Git 操作，需要使用 Personal Access Token (PAT)。
*   **解决方案**：
    1.  前往 GitHub `Settings` -> `Developer settings` -> `Personal access tokens` -> `Tokens (classic)`。
    2.  生成一个新的 Token，**只勾选 `repo` 权限**，并设置为“永不过期”。
    3.  复制 Token 字符串并妥善保存。
    4.  在执行 `hexo d` 弹出密码提示时，粘贴 Token 替代密码。
*   **反思**：初次接触 Git 部署，未了解 GitHub 的安全策略更新，导致鉴权失败。熟悉 PAT 机制是进行任何 GitHub 自动化操作的基础。

##### **3.2 追番界面图片中心偏移**
*    **尚未解决**
#### **4. 新功能实现与配置 (New Features & Configurations)**

##### **4.1 社交平台账号相关跳转**
*   **目标**：通过`Disboundia`跳转至其他社交平台。
*   **操作**：修改`_config_anzhiyu_yml`的`social`部分代码。
*   **意义**：整合各平台博客资源。


#### **5. 思考与心得 (Reflections & Learnings)**

本次 Disboundia 博客的初期搭建过程，充满了挑战与学习。从 YAML 语法的严格要求，到 Hexo 内部渲染机制对日期格式的敏感性，再到 Git 部署与 GitHub Pages 交互的细节，每一步都是对基础知识的深化理解。

最大的收获在于：**定位和解决错误的过程本身就是最宝贵的学习。** 面对报错信息，不再是盲目尝试，而是学会分析其指向的文件、行数和错误类型。这让我对“代码即逻辑”有了更直观的感受。

通过安知鱼主题的引入，Disboundia 的外观已从基础跃升至专业级别。下一步，我将专注于实现更丰富的功能，如基于 GitHub + PicGo 的图床管理，以及更多关于“朋友圈”、“相册”、“音乐”等高级模块的配置。同时，将持续以开发日志的形式记录这些探索过程，使 Disboundia 不仅是内容输出的平台，更是个人学习与成长的生动见证。

---
[[深度技术叙事与博客写作助手]]
