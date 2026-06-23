---
title: 2026-06-23 - Disboundia 开发日志：博客完整度与体验修复
date: 2026-06-23 16:30:00
categories:
  - 开发日志
tags:
  - Hexo
  - AnZhiYu
  - GitHub Pages
  - 本地搜索
  - 不蒜子
  - 文章封面
  - UI优化
description: 本篇记录了 Disboundia 博客近期围绕页面完整度、搜索、封面、鼠标样式、访问统计、About 页面和公众号接入思路进行的一轮集中整理与修复。
cover: /img/covers/cover-dev-2026-01-18.svg
---

### **Disboundia 开发日志：博客完整度与体验修复**

**日期**：2026-06-23  
**作者**：DaiShiBo  
**类别**：`开发日志`  
**标签**：`Hexo` `AnZhiYu` `GitHub Pages` `本地搜索` `不蒜子` `文章封面` `UI优化` `公众号`  
**描述**：本篇日志记录了 Disboundia 在近期围绕博客页面完整度、访问统计、搜索体验、文章封面与前端细节所做的一轮集中整理。

---

#### **1. 本次更新概述 (Summary)**

本次开发的重点不是新增某个单独功能，而是对博客进行一次**可用性与完整度整理**。在这轮调整中，博客从“能构建、能访问”进一步推进到“页面入口更清晰、视觉元素更统一、统计逻辑更明确、后续内容补全路径更可控”的状态。

这次也暴露出一个很重要的问题：静态博客并不是只有文章文件。主题配置、页面入口、数据文件、静态资源、第三方脚本和部署分支共同决定了最终页面的样子。任何一个环节的误解，都可能导致页面空白、统计异常或样式不符合预期。

---

#### **2. 关键任务与目标 (Key Tasks & Goals)**

*   [x] 检查博客项目结构，梳理待补全页面与数据文件。
*   [x] 将搜索从 DocSearch 调整为本地搜索方案。
*   [x] 修复 `Linux 虚拟机配置` 文章 Front Matter 的 YAML 错误。
*   [x] 为文章恢复并统一本地 SVG 封面。
*   [x] 新增 `Linux 虚拟机配置` 专属文章封面。
*   [x] 补充并修正 About 页面所需的数据结构。
*   [x] 更换站点字体为霞鹜文楷屏幕版。
*   [x] 添加自定义鼠标样式，并调整配色与悬停状态。
*   [x] 处理页脚运行时间显示 `NaN` 的问题。
*   [x] 恢复不蒜子访问统计的官方接入方式。
*   [x] 明确公众号在静态博客中的接入边界。
*   [ ] 继续补全友链页、即刻页、相册详情页等特殊页面。

---

#### **3. 遇到的问题与解决方案 (Problems & Solutions)**

##### **3.1 DocSearch 启用但凭证为空**

*   **问题**：主题中启用了 DocSearch，但 `appId`、`apiKey`、`indexName` 为空。前端会加载搜索 UI，却无法真正搜索。
*   **原因分析**：DocSearch 不是 Hexo 自带功能，需要申请或配置 Algolia/DocSearch 凭证。对于个人博客早期阶段，本地搜索更直接。
*   **解决方案**：
    1.  将 `docsearch.enable` 设为 `false`。
    2.  将 `local_search.enable` 设为 `true`。
    3.  安装 `hexo-generator-search`。
    4.  在 `_config.yml` 中添加 `search.xml` 生成配置。
*   **反思**：能显示按钮不代表功能已经可用。搜索这类功能要同时确认“前端入口”和“数据源生成”。

##### **3.2 npm 安装依赖时出现 EPERM**

*   **问题**：安装 `hexo-generator-search` 时出现 `EPERM: operation not permitted`，路径指向 npm 缓存目录。
*   **原因分析**：Windows 下 npm 缓存文件可能被权限、杀毒软件或占用状态影响。
*   **解决方案**：改用可写缓存目录或清理 npm 缓存后重新安装，最终确认 `public/search.xml` 已成功生成。
*   **反思**：依赖安装失败不一定是包本身问题，Windows 文件权限和 npm cache 也经常是根源。

##### **3.3 文章 Front Matter 缩进错误**

*   **问题**：`Linux虚拟机配置.md` 构建时报错：

```text
YAMLException: bad indentation of a mapping entry
```

*   **原因分析**：文章头部出现了类似 `title: cover: ...` 的错误写法，把两个 YAML 字段挤到了一行。
*   **解决方案**：重新整理文章 Front Matter，拆分 `title`、`date`、`categories`、`tags`、`description`、`cover` 等字段。
*   **反思**：Hexo 文章最上方的 `---` 区域不是普通正文，而是严格 YAML。这里出错会直接阻断构建。

##### **3.4 About 页面数据结构缺字段**

*   **问题**：构建 About 页面时报错：

```text
Cannot destructure property 'game_tips' of 'item.game' as it is undefined.
```

*   **原因分析**：AnZhiYu 的 About 模板会直接读取 `item.game`、`item.comic` 等字段。如果数据文件中删除了这些块，模板解构时就会报错。
*   **解决方案**：恢复 About 页模板所需的数据结构，保留 `game`、`comic` 等字段，再逐步替换其中内容。
*   **反思**：主题数据文件不能只按“我想显示什么”来删，还要看模板是否做了空值保护。

##### **3.5 页脚运行时间显示 NaN**

*   **问题**：网站运行时间区域显示 `NaN`。
*   **原因分析**：`footer.runtime.launch_time` 曾写成 `15/1/2026 00:00:00`。浏览器解析时会把 `15` 当成月份，而不存在第 15 个月，因此得到无效日期。
*   **解决方案**：将日期改为更稳定的格式：

```yaml
launch_time: "2026/01/15 00:00:00"
```

*   **反思**：涉及前端 `new Date()` 的配置应尽量使用 `YYYY/MM/DD HH:mm:ss` 或 ISO 风格，避免不同浏览器解析差异。

##### **3.6 不蒜子访问统计显示异常大数**

*   **问题**：本地预览时，总访客数和总访问量显示为几千万级别，明显不符合博客实际情况。
*   **原因分析**：不蒜子统计对象取决于浏览器当前访问域名。本地 `localhost` 或 `127.0.0.1` 被大量站点共同使用，因此本地统计值没有参考意义。
*   **解决方案**：
    1.  保留官方脚本：

```html
<script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
```

    2.  补齐官方推荐的容器结构，如 `busuanzi_container_site_pv`。
    3.  删除前端伪修正脚本，避免人为篡改统计显示。
    4.  以正式域名 `https://disboundary.top` 上的结果为准。
*   **反思**：统计数据不合理时，不应该优先“改显示数字”，而应该先判断统计对象、数据源和测试环境。

##### **3.7 文章封面体系不统一**

*   **问题**：部分文章使用外部图片或图标作为封面，与已有开发日志封面风格不统一。
*   **原因分析**：文章早期使用临时封面，后来才开始建立同系列 SVG 封面。
*   **解决方案**：
    1.  在 `source/img/covers/` 中维护本地 SVG 封面。
    2.  恢复此前误删的文章封面。
    3.  为 `Linux 虚拟机配置` 新增 `cover-linux-vm.svg`。
    4.  将该文章 `cover` 字段改为：

```yaml
cover: /img/covers/cover-linux-vm.svg
```

*   **反思**：文章封面不仅是装饰，也会影响首页卡片、归档视觉和站点整体完成度。

##### **3.8 字体与鼠标样式个性化**

*   **问题**：站点默认字体和鼠标样式缺少个人辨识度。
*   **原因分析**：主题默认视觉适合通用博客，但和 Disboundia 当前头像与页面气质还不够贴合。
*   **解决方案**：
    1.  通过 `inject.head` 引入 LXGW WenKai Screen。
    2.  将全局字体和站点标题字体切换到霞鹜文楷。
    3.  新增自定义鼠标 SVG。
    4.  将鼠标配色调整为纯黑、`#39acb8` 和 `#e9e2ca`。
    5.  扩大悬停选择器覆盖范围，避免部分可点击元素仍显示系统手型。
*   **反思**：视觉个性化不能只改一处变量，字体、图标、鼠标、卡片和动效之间要保持一致。

##### **3.9 公众号接口与静态博客边界**

*   **问题**：希望将已有微信公众号接口接入博客。
*   **原因分析**：Hexo + GitHub Pages 是静态站，不能直接承接微信公众号服务器校验和消息回调。真正的公众号接口需要后端处理 `signature`、`timestamp`、`nonce`、`echostr` 等参数。
*   **解决方案**：
    1.  如果只是展示公众号，应在侧边栏公众号卡片中放二维码。
    2.  如果要真正接入公众号 API，需要部署云函数、Serverless 或独立后端。
    3.  `AppSecret`、`Token` 等敏感信息不能写进博客仓库。
*   **反思**：静态页面可以展示入口，但不能安全地承担需要密钥和回调验证的后端接口。

---

#### **4. 文件变更清单**

| 文件 | 操作 |
|------|------|
| `_config.yml` | 添加本地搜索生成配置 |
| `_config.anzhiyu.yml` | 调整搜索、字体、运行时间、不蒜子、注入配置 |
| `source/css/custom.css` | 新增自定义鼠标样式 |
| `source/img/cursor-default.svg` | 新增默认鼠标 |
| `source/img/cursor-pointer.svg` | 新增悬停鼠标 |
| `source/img/covers/cover-linux-vm.svg` | 新增 Linux 虚拟机文章封面 |
| `source/_posts/Linux虚拟机配置.md` | 修复 Front Matter 并替换封面 |
| `source/_data/about.yml` | 补齐 About 页所需数据结构 |
| `themes/anzhiyu/layout/includes/widget/card_webinfo.pug` | 补充不蒜子官方容器 |
| `themes/anzhiyu/layout/includes/header/post-info.pug` | 补充文章阅读量容器 |

---

#### **5. 待办**

- [ ] 补全 `source/_data/link.yml`，让友链页真正显示内容。
- [ ] 补全 `source/_data/essay.yml`，让闲言碎语页可用。
- [ ] 为相册详情页创建 `/wordScenery/`、`/dailyPhoto/` 等入口。
- [ ] 整理已有开发日志的分类与标签，避免深层分类过多。
- [ ] 继续统一文章封面，形成稳定的封面设计规范。
- [ ] 将公众号二维码接入侧边栏卡片；如需真实接口，再单独部署后端。
