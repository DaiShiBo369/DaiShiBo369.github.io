# Blog Project Memory

## 笔记博客化方法

当用户要求把 Obsidian、每日学习记录、科研笔记或零散 Markdown 整合成博客文章时，按下面方法处理。

1. 先读原始笔记，不急着改文章。明确每篇笔记的主题、时间、关键术语、可公开程度和潜在读者。
2. 不做简单复制粘贴。把笔记重组为一篇能独立阅读的博客文章：先给背景问题，再给主线，再分节展开，最后给阶段性结论或下一步计划。
3. 保留用户原意，但要补足博客读者需要的上下文。内部 shorthand、当天才懂的句子、未解释的术语，要改写成外部读者也能看懂的表达。
4. 技术/科研文章优先采用“问题 -> 概念 -> 工程关系 -> 当前结论”的结构。不要堆名词，要说明这些概念为什么和用户当前项目有关。
5. 对公式文章，front matter 必须加 `mathjax: true`。块级公式用 `$$...$$`，行内公式用 `$...$`，复杂多行推导优先用 `aligned` 环境。本项目通过 `scripts/marked-mathjax.js` 自动把这些写法转换成 `script type="math/tex"` 节点，再由 MathJax SVG 输出自动编译；不要逐篇手动把公式改成 SVG。
6. 每篇博客都要补完整 front matter：`title`、`date`、`categories`、`tags`、`description`、`cover`。封面优先放在 `source/img/covers/`，路径写成 `/img/covers/xxx.svg`。
7. 不覆盖已有文章。若目标文件已存在，先读现有内容，再决定追加、合并或另建新文章。
8. 不随意删除默认文章、旧封面、旧资源。除非用户明确要求撤回或删除，否则只做增量编辑。
9. 文章标题要像博客标题，不像笔记文件名。摘要要能说明文章解决什么问题，而不是只列关键词。
10. 输出后必须运行 `npm run clean` 和 `npm run build`，检查 YAML、MathJax、封面路径和分类标签是否能正常生成。

## 当前博客约定

- 博客根目录：`D:\Blog`
- 文章目录：`source/_posts/`
- 封面目录：`source/img/covers/`
- 主题配置：`_config.anzhiyu.yml`
- 站点配置：`_config.yml`
- 公式支持：`_config.anzhiyu.yml` 中 `mathjax.enable: true`，需要公式的文章在 front matter 中加 `mathjax: true`
- 本地 Markdown 数学扩展：`scripts/marked-mathjax.js`
