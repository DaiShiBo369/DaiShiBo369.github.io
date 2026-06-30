# Blog Project Memory

Last updated: 2026-06-24
Project root: `D:\Blog`
Obsidian vault: `D:\My_Obsidian_Vault`

This file is a working memory for future Codex sessions. It is not a verbatim chat log; it preserves the decisions, fixes, conventions, and next actions that matter for continuing the blog project.

## Project Overview

- This is a Hexo blog using the AnZhiYu theme.
- The user is a beginner in web/blog development and prefers concrete explanations of how files map to visible blog pages.
- The user does not want existing article covers, default articles, or old assets removed unless explicitly requested.
- Avoid broad theme rewrites. Prefer scoped custom CSS/JS and documented configuration edits.
- After creating or modifying blog posts, run:
  - `npm run clean`
  - `npm run build`
- Important paths:
  - Posts: `source/_posts/`
  - Covers: `source/img/covers/`
  - Custom CSS: `source/css/custom.css`
  - Custom JS: likely under `source/js/`
  - Site config: `_config.yml`
  - Theme config: `_config.anzhiyu.yml`
  - Theme source: `themes/anzhiyu/`
  - About page source: `source/about/index.md`
  - Math helper: `scripts/marked-mathjax.js`

## Blog Writing Conventions

- Do not paste Obsidian notes directly into posts.
- Convert notes into independent blog articles:
  - Give background first.
  - Build a clear main line.
  - Explain concepts for external readers.
  - End with a stage conclusion or next step.
- Technical/research articles should usually follow:
  - Problem -> Concept -> Engineering relation -> Current conclusion.
- Every post should have complete front matter:
  - `title`
  - `date`
  - `categories`
  - `tags`
  - `description`
  - `cover`
- Covers should preferably live in `source/img/covers/` and be referenced as `/img/covers/xxx.svg`.
- Formula-heavy posts must include `mathjax: true`.
- Use `$$...$$` for block formulas and `$...$` for inline formulas.
- Complex multi-line derivations should use `aligned`.
- Do not manually SVG-convert every formula. The project now has an automatic MathJax pipeline.

## Important Completed Work

### Local Search

- Docsearch had been enabled without credentials, causing the front-end search UI to load but fail.
- Recommended state:
  - `docsearch.enable: false`
  - `local_search.enable: true`
  - `local_search.preload: true`
- Local search generator:
  - `hexo-generator-search`
- `_config.yml` should include:
  ```yaml
  search:
    path: search.xml
    field: post
    content: true
  ```
- User confirmed `public\search.xml` existed.
- Earlier npm issue was an `EPERM` cache permission problem at `D:\nodejs\node_cache`; using a local cache such as `D:\Blog\.npm-cache` helped for package installs.

### GitHub Publishing

- Remote repo exists:
  - `https://github.com/DaiShiBo369/DaiShiBo369.github.io.git`
- Push was rejected once because remote had commits not present locally:
  - `git push -u origin main` -> rejected, fetch first.
- General fix:
  - inspect local status first
  - pull/rebase or merge remote before pushing
  - never force push unless user explicitly understands and requests it.

### AnZhiYu UI / Home Page

- User compared their site with another AnZhiYu-style interface.
- Discussed:
  - homepage background
  - random banner cover
  - random banner scrolling/dynamic icon effect
  - more tech icons
  - font replacement
  - PeopleCanvas meaning
- PeopleCanvas is a canvas/visual effect component, not normal article content.
- User wanted more icons and a dynamic random banner, not just a single static image.
- Important: if random banner images/icons do not appear, check:
  - file path is under `source/`
  - URL path starts with `/`
  - custom CSS/JS is injected in AnZhiYu config
  - generated `public/` has the assets after build
  - browser cache/CDN cache is cleared.

### About Page

- User asked to fill the About page.
- About page path:
  - `source/about/index.md`
- A mistake happened earlier: user clarified they only wanted to revert cover changes inside the About page, not other article covers.
- Strong rule:
  - Do not delete or replace article covers while editing About.
  - For About page cover changes, scope edits only to About-related front matter/config.
- Error encountered:
  ```text
  TypeError: themes\anzhiyu\layout\includes\page\about.pug:177
  Cannot destructure property 'game_tips' of 'item.game' as it is undefined.
  ```
- Meaning:
  - AnZhiYu About page template expected an `item.game` block in config/content.
  - If the About data omits `game`, either provide the `game` fields or guard the template/config so it does not destructure undefined.

### YAML Front Matter Error

- Error encountered:
  ```text
  ERROR Process failed: _posts/Linux虚拟机配置.md
  YAMLException: bad indentation of a mapping entry (1:13)
  1 | title: cover: https://...
  ```
- Meaning:
  - `title` and `cover` were accidentally placed on the same YAML line.
- Correct shape:
  ```yaml
  ---
  title: Linux虚拟机配置
  cover: https://...
  date: 2026-06-20 10:00:00
  categories:
    - ...
  tags:
    - ...
  ---
  ```

### Inject Config Meaning

- AnZhiYu config section:
  ```yaml
  inject:
    head:
      # custom CSS
    bottom:
      # custom JS
  ```
- `head` injects tags into page `<head>`, usually CSS, fonts, preloads, meta.
- `bottom` injects tags near page bottom, usually JS.
- The commented examples do nothing until the leading `#` is removed.

### Social Links

- User asked how to add WeChat public account and Xiaohongshu.
- Likely places:
  - sidebar/social card config in `_config.anzhiyu.yml`
  - custom side card / custom HTML if the theme lacks native fields.
- WeChat public account is usually not a direct "API connection" unless using official platform features; for a blog sidebar, simplest is:
  - show QR code image
  - add a button or link to public account intro
  - optionally add copyable WeChat ID.

### Busuanzi / Visitor Stats

- User wanted to keep all stats:
  - visitor count
  - visit count
  - read count
- Problem:
  - values were unrealistically huge:
    - total visitors: `55839094`
    - total visits: `79470033`
- Discussion conclusion:
  - The site was using Busuanzi's stored result associated with a domain/key state that likely did not match the user's own final domain.
  - Should not remove stats entirely.
- Official Busuanzi script user provided:
  ```html
  <script async src="//busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js"></script>
  <span id="busuanzi_container_site_pv">本站总访问量<span id="busuanzi_value_site_pv"></span>次</span>
  ```
- Do not replace stats with fake local numbers.
- If stats are wrong again, verify:
  - final domain
  - Busuanzi script source
  - element IDs:
    - `busuanzi_value_site_pv`
    - `busuanzi_value_site_uv`
    - article read count ID used by theme
  - whether site is previewed on localhost, GitHub Pages domain, or custom domain.

### Cursor Style

- User wanted a custom cursor inspired by their avatar colors.
- User later specified:
  - replace dark gray with pure black
  - replace teal with `#39acb8`
  - replace white with `#e9e2ca`
  - reduce cursor size
  - preserve target/reticle style
  - fix cases where hover still shows the original hand pointer.
- Important nuance:
  - The user did not want to remove the reticle format.
  - They wanted pointer/hover states to also use the custom cursor instead of the original hand.
- If continuing:
  - inspect `source/css/custom.css`
  - define cursor for `html, body`
  - define cursor for clickable selectors: `a`, `button`, `[role="button"]`, `.post-card`, `.card`, etc.
  - avoid making cursor too large.

### Fonts

- User asked to change to another site's font.
- Need inspect current `_config.anzhiyu.yml` and `source/css/custom.css` before changing.
- If using web fonts, prefer stable public CDN or local `source/fonts/` for GitHub Pages reliability.
- Do not break Chinese rendering; include fallback fonts.

## MathJax / LaTeX Final State

This was a major debugging thread.

### Original Problems

- Formulas were displayed literally as:
  - `\[ \Psi(F) \]`
  - `\[ P = ... \]`
- Later SVG/image-like math was too small, clipped, or visually broken.
- Manual SVG conversion was considered bad because future posts would still not compile formulas automatically.

### Packages

- User installed MathJax:
  ```powershell
  npm install mathjax --save --cache D:\Blog\.npm-cache --registry=https://registry.npmjs.org/
  ```
- Install result:
  - up to date
  - 295 packages audited
  - 7 vulnerabilities reported by npm audit, not fixed during this thread.

### Final Desired Math Behavior

- User is satisfied with current LaTeX visual effect after using MathJax SVG output with scale `2.5`.
- Do not revert this.

### Current Implementation

- `scripts/marked-mathjax.js` converts Markdown math into MathJax-compatible script nodes:
  - block math -> `<div class="mathjax-display"><script type="math/tex; mode=display">...</script></div>`
  - inline math -> `<span class="mathjax-inline"><script type="math/tex">...</script></span>`
- Theme MathJax loader:
  - `themes/anzhiyu/layout/includes/third-party/math/mathjax.pug`
- It uses SVG output with:
  ```js
  svg: { fontCache: 'global', scale: 2.5 }
  ```
- Loader sources include:
  ```js
  const mathJaxSources = [
    '/js/mathjax/tex-mml-svg.js',
    'https://cdn.jsdelivr.net/npm/mathjax@4/tex-mml-svg.js',
    'https://unpkg.com/mathjax@4/tex-mml-svg.js'
  ]
  ```
- Local MathJax asset exists:
  - `source/js/mathjax/tex-mml-svg.js`
- CSS supporting MathJax is in:
  - `source/css/custom.css`
- Theme config:
  - `_config.anzhiyu.yml`
  - `mathjax.enable: true`
- Formula posts need:
  ```yaml
  mathjax: true
  ```

### Math Article Created

- New article:
  - `source/_posts/2026-06-24-Disboundia-LaTeX-显示探索.md`
- Cover:
  - `source/img/covers/cover-dev-2026-06-24-latex.svg`
- It records the exploration of displaying LaTeX in the blog.
- Build succeeded after fixes.

## Blog Articles / Covers Mentioned

- User wanted a new cover for the virtual machine configuration article.
- User wanted cover art for new articles and a same-series set of covers.
- Important style preference:
  - coherent article-cover series
  - do not overwrite original covers unexpectedly
  - put new covers under `source/img/covers/`.

## Obsidian / Note-To-Blog Workflow

User asked to remember the "笔记博客化" method. It is already recorded in `AGENTS.md`, and summarized here:

1. Read the source notes first.
2. Determine topic, time, key terms, public/private risk, and target readers.
3. Do not copy-paste notes as-is.
4. Rewrite into an independent blog article.
5. Add missing context for outside readers.
6. Use clear structure.
7. Add full front matter.
8. Add `mathjax: true` for formula-heavy posts.
9. Add a cover in `source/img/covers/`.
10. Do not overwrite existing posts or old resources.
11. After output, run clean/build.

## Obsidian Vault Scan

- Root confirmed:
  - `D:\My_Obsidian_Vault`
- User typed `D:/My_obsidian_vault`; Windows path casing is not an issue.
- Scan result:
  - total Markdown files: `529`
  - non-system non-empty files inspected statistically: `462`
- Skipped or deprioritized:
  - `.obsidian`
  - `.trash`
  - `.claude`
  - `Excalidraw`
  - `99-Attachments`
  - empty files
- A detailed candidate list is stored in `.codex/OBSIDIAN_BLOG_CANDIDATES.md`.

## Current Git / Worktree Awareness

Before the final memory write, known git status included many modified/untracked files:

```text
 M .gitignore
 M package-lock.json
 M package.json
 M source/_posts/IPC预训练数据生成记录.md
 M source/css/custom.css
 m themes/anzhiyu
?? AGENTS.md
?? scripts/
?? source/_posts/2026-06-24-Disboundia-LaTeX-显示探索.md
?? source/img/covers/cover-dev-2026-06-24-latex.svg
?? source/js/
```

Do not revert these casually. Some are deliberate project changes.

## User Preferences / Safety Rules

- The user is a beginner; explain file roles and commands concretely.
- The user appreciates implementation help, but after bad edits explicitly said "不要急着改代码" in one debugging thread. When the issue is conceptual or risky, inspect and explain before editing.
- Never delete default articles or old covers unless explicitly asked.
- When editing theme internals, be conservative and explain why.
- Prefer adding custom files and config over modifying large theme internals.
- For public posts, check private data:
  - usernames
  - server IPs
  - lab names
  - API keys
  - private paths
  - personal planning details

## Useful Resume Prompt

If the next session lacks context, the user can say:

```text
请先阅读 D:\Blog\.codex\PROJECT_MEMORY.md、D:\Blog\.codex\OBSIDIAN_BLOG_CANDIDATES.md 和 D:\Blog\AGENTS.md，然后继续我的 Hexo/AnZhiYu 博客项目。
```

