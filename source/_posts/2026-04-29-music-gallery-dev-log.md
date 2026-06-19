---
title: 2026-04-29 - 音乐馆重构：关系图 + 内置播放器
date: 2026-04-29 11:30:00
categories:
  - 开发日志
  - 音乐馆
description: 音乐馆页面的全面重构，新增专辑关系图视图、内置 HTML5 播放器，以及大量专辑数据与封面图。
cover: /img/covers/cover-music-gallery.svg
---

### **音乐馆开发日志：关系图 + 内置播放器 + 数据扩充**

**日期**：2026-04-29
**作者**：DaiShiBo
**类别**：`开发日志`
**标签**：`HTML` `CSS` `JavaScript` `Canvas` `力导向图` `音乐馆`
**描述**：

---

#### **1. 本次更新概述 (Summary)**

本次开发对 `music-gallery.html` 进行了全面重构，主要包含以下内容：

1. **专辑关系图**：基于纯 Canvas 实现的力导向图，展示专辑之间的歌手与标签关联
2. **内置播放器**：替代 QQ 音乐 iframe，使用 HTML5 Audio 对象实现站内播放
3. **数据扩充**：新增 25 张经典专辑，覆盖流行、电子、朋克、前卫摇滚、另类摇滚、重金属六大流派
4. **封面图**：所有封面链接替换为 MusicBrainz Cover Art Archive 的高清图片
5. **交互优化**：修复卡片展开闪烁、布局抖动等问题，优化搜索栏和导航

---

#### **2. 关键任务与目标 (Key Tasks & Goals)**

| 任务 | 状态 |
|------|------|
| 视图切换 Tab（唱片架 / 关系图） | ✅ 完成 → 后改为独立页面 |
| 力导向关系图引擎（纯 Canvas） | ✅ 完成 |
| 内置 HTML5 音频播放器 | ✅ 完成 |
| 底部播放条 + 播放列表 | ✅ 完成 |
| 歌曲列表点击播放联动 | ✅ 完成 |
| 新增 25 张专辑数据 | ✅ 完成 |
| 封面图替换为 Cover Art Archive | ✅ 完成 |
| 搜索栏移至顶部 | ✅ 完成 |
| 侧边栏导航 | ✅ 完成 |
| 卡片展开闪烁修复 | ✅ 完成 |
| 卡片展开下行抖动修复 | ✅ 完成 |
| 标签移入展开区域 | ✅ 完成 |
| 国别标签移除 | ✅ 完成 |
| 关系图独立页面 | ✅ 完成 |
| Blog 目录迁移至 D 盘 | ✅ 完成 |

---

#### **3. 详细修改记录**

##### 3.1 关系图（独立页面）

**文件**：`music-graph.html`（新建）

- 纯 Canvas 力导向图引擎，无外部依赖
- **数据构建** `buildGraph()`：遍历所有专辑对，自动生成两种关系边：
  - 同歌手 → 粉色粗线
  - 共通标签 → 蓝色细线
  - 同一对专辑多条边时，用二次贝塞尔曲线分向两侧
- **力模拟** `simulateGraph()`：库仑斥力 + 弹簧引力 + 中心引力 + 速度阻尼
- **渲染** `renderGraph()`：
  - 节点为圆形裁剪的封面图 + 描边 + 阴影
  - 悬停时关联节点保持高亮，无关节点淡化
  - 悬停边时显示标签（歌手名或标签名）
- **交互**：拖拽节点 / 空白处平移 / 滚轮缩放 / 触屏适配
- DPI 适配 `devicePixelRatio`

##### 3.2 内置播放器

**文件**：`music-gallery.html`

- 全局单例 `Audio()` 对象
- 底部固定播放条：封面缩略图 + 歌名/歌手 + 播放控制 + 进度条 + 音量 + 播放列表
- 播放队列系统：点击歌曲时将整张专辑加入队列，支持上一首/下一首/循环
- 有 `url` 字段的歌曲 → 站内播放；无 `url` 的歌曲 → 跳转 QQ 音乐外链
- 播放列表展开/收起（汉堡按钮）
- 当前播放歌曲高亮（`.playing` class + 动画指示器）
- 移动端适配：进度条和音量简化

##### 3.3 卡片展开优化

- **闪烁修复**：`playSong()` 不再调用 `renderAlbums()` 重渲染整个网格，改为 `updatePlayingHighlight()` 只更新 `.playing` class
- **布局抖动修复**：展开时 `.album-card-inner` 使用 `position: absolute` 浮在上方，不占据文档流；卡片固定 `height: 240px`，防止高度塌缩
- **透明度问题**：展开 overlay 背景改为 `rgba(16,24,48,0.92)` + `blur(24px)` 毛玻璃效果

##### 3.4 UI 调整

- 搜索栏从 gallery 内部移至页面顶部固定定位（`search-bar-top`）
- 新增左侧侧边栏导航（唱片架 / 关系图），毛玻璃背景，当前页面高亮
- 封面上的标签（`.album-tags`）改为展开后在 body 区域显示
- 卡片封面不再显示国别标签
- 关系图从内嵌 Tab 切换改为独立页面 `music-graph.html`，通过侧边栏导航

##### 3.5 数据与封面

- 新增 25 张专辑，覆盖六大流派：
  - **流行**：Taylor Swift - 1989
  - **电子**：Kraftwerk, Daft Punk, Aphex Twin, Massive Attack, The Prodigy
  - **朋克摇滚**：Sex Pistols, The Ramones, The Clash, Patti Smith, Green Day
  - **前卫摇滚**：Pink Floyd, King Crimson, Yes, Genesis, Rush
  - **另类/垃圾摇滚**：Nirvana, Pearl Jam, R.E.M., The Smiths, Radiohead (OK Computer)
  - **重金属**：Black Sabbath, Metallica, Iron Maiden, Judas Priest, Megadeth
- 所有封面 URL 通过 MusicBrainz API 批量查询 MBID，替换为 Cover Art Archive 500px 高清链接

##### 3.6 文件迁移

- Blog 目录从 `/mnt/d/My_Obsidian_Vault/Blog` 迁移至 `/mnt/d/Blog`

---

#### **4. 文件变更清单**

| 文件 | 操作 |
|------|------|
| `music-gallery.html` | 重构（CSS + HTML + JS + 数据） |
| `music-graph.html` | 新建（关系图独立页面） |

---

#### **5. 待办**

- [ ] 为歌曲添加实际音频 `url` 字段（当前均为空，点击跳转 QQ 音乐）
- [ ] 考虑添加更多专辑数据
- [ ] 考虑暗色/亮色主题切换
