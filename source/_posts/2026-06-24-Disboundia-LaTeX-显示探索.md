---
title: 2026-06-24 - Disboundia 开发日志：博客中的 LaTeX 显示探索
date: 2026-06-24 15:30:00
categories:
  - 开发日志
tags:
  - Hexo
  - AnZhiYu
  - LaTeX
  - MathJax
  - SVG
  - Markdown
description: 本篇记录了 Disboundia 博客中 LaTeX 公式显示问题的排查过程：从公式无法识别、显示过小、CHTML 被主题样式裁切，到最终切换 MathJax SVG 输出并稳定放大公式。
cover: /img/covers/cover-dev-2026-06-24-latex.svg
mathjax: true
---

### **Disboundia 开发日志：博客中的 LaTeX 显示探索**

**日期**：2026-06-24  
**作者**：DaiShiBo  
**类别**：`开发日志`  
**标签**：`Hexo` `AnZhiYu` `LaTeX` `MathJax` `SVG` `Markdown`  
**描述**：这篇日志记录了我在博客中接入 LaTeX 公式显示的完整探索过程。它不是一次简单的“打开开关”，而是一次从 Markdown 渲染、主题样式、MathJax 输出模式到本地资源加载的排查。

---

#### **1. 本次更新概述 (Summary)**

这次问题最开始出现在科研笔记博客化之后。文章里包含不少 FEM、Neo-Hookean、能量函数和链式法则相关公式，例如：

$$
\Psi(F)
$$

以及：

$$
\frac{\partial Loss}{\partial A}
=
\frac{\partial Loss}{\partial C}
\frac{\partial C}{\partial B}
\frac{\partial B}{\partial A}
$$

这些公式是科研文章里非常重要的表达方式。如果公式无法正确显示，文章就会从“可读的技术记录”变成“夹杂着一堆反斜杠的草稿”。因此，这次目标不是只让页面不报错，而是让公式真正达到博客文章可阅读的状态。

最终采用的方案是：

1. 使用 MathJax 作为公式渲染器；
2. 为 Hexo 的 Markdown 渲染过程补充数学公式识别扩展；
3. 将 MathJax 输出模式从 CHTML 切换到 SVG；
4. 使用本地 MathJax SVG 组件作为优先加载源；
5. 通过 MathJax 的 `scale` 配置放大公式，而不是用 CSS 强行拉伸。

---

#### **2. 关键任务与目标 (Key Tasks & Goals)**

*   [x] 在需要公式的文章 Front Matter 中加入 `mathjax: true`。
*   [x] 安装并引入本地 MathJax 包。
*   [x] 解决 Markdown 渲染器不识别 `$$...$$` 的问题。
*   [x] 解决公式原文直接显示的问题。
*   [x] 解决 CHTML 公式被主题 CSS 裁切的问题。
*   [x] 将公式输出切换为 SVG。
*   [x] 使用 `scale: 2.5` 放大公式显示效果。
*   [x] 为这次探索新增一篇开发日志和专属封面。

---

#### **3. 遇到的问题与解决方案 (Problems & Solutions)**

##### **3.1 公式不是天然支持的 Markdown 内容**

最初的直觉是：只要在 Markdown 中写：

```markdown
$$
\Psi(F)
$$
```

页面就应该自动显示公式。

但实际情况不是这样。Hexo 当前使用的是 `hexo-renderer-marked`，它负责把 Markdown 转成 HTML。普通 Markdown 标准本身并不把 LaTeX 公式当作必选能力，因此 `$$...$$` 不一定会被正确保留下来。

这会造成两个问题：

1. 块级公式可能被当成普通文本；
2. 某些公式结构可能被 Markdown 误判成标题、列表或其他语法。

解决方式是在 `scripts/marked-mathjax.js` 中给 marked 增加数学扩展，让它把：

```markdown
$$
...
$$
```

转换为：

```html
<div class="mathjax-display">
  <script type="math/tex; mode=display">...</script>
</div>
```

行内公式则从：

```markdown
$F$
```

转换为：

```html
<span class="mathjax-inline">
  <script type="math/tex">F</script>
</span>
```

这一步解决的是“Markdown 到 HTML”阶段的问题。它并不负责真正画出公式，只负责把公式安全地交给 MathJax。采用 `script type="math/tex"` 的好处是：以后新文章只需要正常写 `$$...$$` 和 `$...$`，构建后就会自动交给 MathJax 编译，而不需要手动把每个公式改成 SVG。

---

##### **3.2 只启用 MathJax 还不够**

AnZhiYu 主题本身有 MathJax 配置入口，但这不代表所有文章都会自动加载公式脚本。当前配置采用的是按需加载：

```yaml
mathjax:
  enable: true
  per_page: false
```

这意味着只有文章 Front Matter 中写了：

```yaml
mathjax: true
```

对应页面才会加载 MathJax。

这其实是合理的。并不是每篇博客都需要数学公式，如果全站每页都加载公式脚本，会增加不必要的前端资源体积。对于普通日记、旅行记录或开发日志，可以不加载；对于科研笔记、算法文章、物理推导文章，再单独开启。

---

##### **3.3 CHTML 模式能显示，但容易被主题 CSS 影响**

中间阶段曾经切到 MathJax 的 CHTML 输出模式。这个阶段公式已经不是原始文本了，说明 MathJax 确实生效了，但显示效果仍然很糟糕。

当时主要有两个现象：

1. 公式整体偏小；
2. 分式、上下标、括号等内容被裁切。

原因在于 CHTML 输出不是一张完整图片，而是一组复杂的 HTML 标签和 CSS 排版。它会生成大量 `mjx-container` 内部结构。主题中如果存在类似 `line-height`、`overflow-y: hidden`、正文行高或滚动容器设置，就可能影响公式高度计算。

当时尝试过通过 CSS 改：

```css
#article-container mjx-container[display] {
  font-size: 132%;
  line-height: 1.35;
}
```

这个方向后来证明并不稳。公式视觉上会变大，但 MathJax 自己计算的盒模型高度没有同步变得可靠，最终出现“上半截或下半截被切掉”的问题。

这一步最大的教训是：**数学公式不能当普通文字随便用 CSS 拉伸。**

---

##### **3.4 切换到 SVG 输出后问题稳定解决**

后续查阅 MathJax 的配置方式后，最终改用 SVG 输出。

核心配置在：

```text
themes/anzhiyu/layout/includes/third-party/math/mathjax.pug
```

最终加载源改为：

```js
const mathJaxSources = [
  '/js/mathjax/tex-mml-svg.js',
  'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-svg.js',
  'https://unpkg.com/mathjax@4/tex-mml-svg.js'
]
```

输出配置改为：

```js
svg: {
  fontCache: 'global',
  scale: 2.5
}
```

SVG 模式的优势很明显：公式被渲染为带有完整 `viewBox` 的图形，而不是依赖一堆 HTML 标签和主题 CSS 共同排版。这样分式、上下标和大括号的高度边界更稳定，不容易被外层样式裁切。

现在这类公式可以正常显示：

$$
\Psi(F)
=
\frac{\mu}{2}(I_C-3)
- \mu \ln J
+
\frac{\lambda}{2}(\ln J)^2
$$

以及：

$$
J = \det(F), \qquad I_C = \operatorname{tr}(F^T F)
$$

---

##### **3.5 放大公式应该改 MathJax scale，而不是强改 CSS**

公式成功显示后，还有一个视觉问题：公式太小。

一开始我想用 CSS 放大，但前面的遮挡问题已经说明，强行改 `mjx-container` 的 `font-size` 不稳。最终采用的是 MathJax 自己的缩放配置：

```js
svg: {
  fontCache: 'global',
  scale: 2.5
}
```

这样做的好处是：放大过程仍由 MathJax 控制，它会按照公式自身结构计算边界。相比 CSS 强行拉伸，这种方式更适合公式排版。

当然，`scale: 2.5` 是一个偏大的值。它在桌面端阅读体验比较醒目，但长公式在移动端更容易横向滚动。当前博客已经给公式外层保留横向滚动能力，因此这个取舍可以接受。

---

#### **4. 最终使用方式 (How to Use)**

以后如果一篇文章需要公式，Front Matter 中要加：

```yaml
mathjax: true
```

块级公式写法：

```markdown
$$
\Psi(F)
=
\frac{\mu}{2}(I_C-3)
- \mu \ln J
+
\frac{\lambda}{2}(\ln J)^2
$$
```

行内公式写法：

```markdown
其中 $F$ 是 deformation gradient，$J=\det(F)$ 表示体积变化。
```

复杂多行推导建议使用 `aligned`：

```markdown
$$
\begin{aligned}
\frac{\partial Loss}{\partial A}
&=
\frac{\partial Loss}{\partial C}
\frac{\partial C}{\partial B}
\frac{\partial B}{\partial A}
\end{aligned}
$$
```

实际显示效果如下：

$$
\begin{aligned}
\frac{\partial Loss}{\partial A}
&=
\frac{\partial Loss}{\partial C}
\frac{\partial C}{\partial B}
\frac{\partial B}{\partial A}
\end{aligned}
$$

---

#### **5. 本次改动涉及的文件 (Changed Files)**

这次公式显示方案涉及多个层次，不是单个配置项就能完成。

```text
scripts/marked-mathjax.js
```

负责让 Hexo 的 marked 渲染器识别块级公式和行内公式。

```text
themes/anzhiyu/layout/includes/third-party/math/mathjax.pug
```

负责设置 MathJax 的加载方式、输出模式和公式缩放比例。

```text
source/js/mathjax/tex-mml-svg.js
```

本地 MathJax SVG 组件。优先从本地加载，避免完全依赖 CDN。

```text
source/css/custom.css
```

负责公式外层的横向滚动、上下间距和 SVG 容器兼容，但不再强行改公式内部高度。

---

#### **6. 反思与收获 (Reflections)**

这次探索让我意识到，博客里的 LaTeX 显示不是一个单点功能，而是一条完整链路：

```text
Markdown 原文
  -> Hexo Markdown 渲染器
  -> HTML 中保留数学标记
  -> MathJax 加载
  -> MathJax 输出模式
  -> 主题 CSS 展示
```

任何一层出问题，最终看到的页面都会不对。

最关键的收获有三点：

1. **Markdown 渲染和公式渲染是两件事。**  
   前者负责把文章变成 HTML，后者负责把公式画出来。

2. **CHTML 不一定适合复杂主题。**  
   在样式复杂的博客主题中，SVG 输出更稳定。

3. **公式放大应该交给 MathJax。**  
   用 `scale` 放大比直接用 CSS 修改 `font-size` 更可靠。

这次修复完成后，Disboundia 已经具备比较稳定的数学公式展示能力。接下来，无论是 FEM、IPC、优化、机器学习还是物理建模相关笔记，都可以更自然地整理成博客文章。

---

#### **7. 小结**

这次 LaTeX 显示探索看起来只是“让公式变好看”，但它实际补上了博客技术文章能力中的一块基础设施。

最终方案可以概括为：

```text
Hexo marked 扩展识别公式
  -> MathJax 按文章加载
  -> 本地 SVG 组件优先
  -> SVG 输出避免裁切
  -> scale 控制显示大小
```

现在公式不仅能显示，而且能比较稳定、清晰地服务于科研笔记博客化。对于之后继续记录 Neural IPC、FEM、ABD、Neo-Hookean 等内容，这一步是非常重要的铺垫。
