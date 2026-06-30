# Resume Prompt

下次重新打开 Codex 时，可以直接发送下面这段话：

```text
请先阅读 D:\Blog\.codex\PROJECT_MEMORY.md、D:\Blog\.codex\OBSIDIAN_BLOG_CANDIDATES.md、D:\Blog\.codex\RESUME_PROMPT.md 和 D:\Blog\AGENTS.md，然后继续我的 Hexo/AnZhiYu 博客项目。

注意：
1. 不要删除默认文章、旧封面、旧资源。
2. 修改文章前先读源文件。
3. 公式文章使用 mathjax: true，不要手动 SVG 化公式。
4. 新博客文章必须补完整 front matter 和封面。
5. 输出后运行 npm run clean 和 npm run build。
```

## If Continuing Obsidian-To-Blog Work

```text
请从 D:\Blog\.codex\OBSIDIAN_BLOG_CANDIDATES.md 里选择优先级最高的一篇，把它从 Obsidian 笔记整理成 Hexo 博客文章。先读源笔记，再告诉我你准备怎样改，不要直接覆盖已有文章。
```

## If Debugging MathJax

```text
请检查当前 MathJax 自动编译链路：scripts/marked-mathjax.js、themes/anzhiyu/layout/includes/third-party/math/mathjax.pug、source/css/custom.css、source/js/mathjax/tex-mml-svg.js，以及文章 front matter 里的 mathjax: true。现在用户满意的公式放大比例是 SVG scale 2.5，不要改回去。
```

## If Debugging UI

```text
请先检查 _config.anzhiyu.yml、source/css/custom.css、source/js/ 和 themes/anzhiyu 相关模板。不要大范围改主题源码；优先使用自定义 CSS/JS 和配置项。尤其不要误删文章封面。
```

