# Obsidian Blog Candidates

Last scan: 2026-06-24
Vault: `D:\My_Obsidian_Vault`

This list was produced after a read-only scan of the Obsidian vault. No vault files were changed.

## Scan Scope

- Total Markdown files found: `529`
- Non-system non-empty Markdown files considered: `462`
- Skipped/deprioritized:
  - `.obsidian`
  - `.trash`
  - `.claude`
  - `Excalidraw`
  - `99-Attachments`
  - empty files

## Highest Priority: Almost Blog-Ready

### 1. Knowledge Management / Personal System

Source:
`D:\My_Obsidian_Vault\07-Output\Blog-Drafts\记了很多笔记，为什么还是想不起来.md`

Suggested title:
`记了很多笔记，为什么还是想不起来？`

Reason:
- Already has a strong opening and complete narrative.
- Good fit for public blog/公众号 style.
- Explains Obsidian, Zettelkasten, and the shift from storage to connection.

Work needed:
- Convert front matter to blog format.
- Add `cover`.
- Possibly remove WeChat-specific ending or adapt it to blog comments.

Suggested category/tags:
- `知识管理`
- `Obsidian`
- `Zettelkasten`
- `学习方法`

### 2. Technical Essay: Terminal Network / Proxy

Source:
`D:\My_Obsidian_Vault\07-Output\Blog-Drafts\The-Parallel-Network.md`

Suggested title:
`终端里的平行网络：为什么浏览器能上网，代码却断网？`

Reason:
- Strong beginner-friendly explanation.
- Very relevant to the user's own npm/Git/AI tool network problems.

Work needed:
- Fix malformed front matter. Existing content had:
  ```yaml
  date: 2026-02-18
    - 计算机网络
  category: 技术观察
  ```
  This should be normalized.
- Add concrete Windows PowerShell examples.
- Add cover.

Suggested category/tags:
- `工具`
- `网络`
- `代理`
- `PowerShell`

### 3. Education / Interview Experience

Sources:
`D:\My_Obsidian_Vault\04-Tech\面试\面试基本原则.md`
`D:\My_Obsidian_Vault\07-Output\Published\公众号\To 26高考生们：你不可不知的高校面试“基本原则”.md`

Suggested title:
`高校面试基本原则：教授到底在看什么？`

Reason:
- Polished and readable.
- Suitable for blog category "升学路径".
- There are two similar versions; compare before publishing.

Work needed:
- Choose better base version.
- Remove duplicated/wechat-only formatting.
- Add local cover.

Suggested category/tags:
- `升学路径`
- `面试`
- `强基计划`
- `自主招生`

### 4. Data Structures: B-Tree

Source:
`D:\My_Obsidian_Vault\从第一性原理推导 B-树.md`

Suggested title:
`从第一性原理推导 B-树`

Reason:
- Very strong explanatory structure.
- Starts from problem -> array/list/tree -> disk I/O.
- Suitable as a technical cornerstone article.

Work needed:
- Add complete front matter and cover.
- Check diagrams render well in Markdown.

Suggested category/tags:
- `数据结构`
- `算法`
- `B树`
- `搜索树`

### 5. Data Structures: Red-Black Tree

Source:
`D:\My_Obsidian_Vault\红黑树（Red-Black Tree）.md`

Suggested title:
`从平衡的代价理解红黑树`

Reason:
- Natural sequel to the B-tree article.
- Good "why this structure exists" explanation.

Work needed:
- Add front matter and cover.
- Ensure tree diagrams render in code blocks.

Suggested category/tags:
- `数据结构`
- `算法`
- `红黑树`
- `搜索树`

### 6. Claude + Obsidian Workflow

Source:
`D:\My_Obsidian_Vault\01-Inbox\Quick-Captures\Claude+Obsidian工作流搭建记录.md`

Suggested title:
`我如何搭建 Claude + Obsidian 的学习工作流`

Reason:
- Fits the blog's ongoing theme.
- Useful for readers who want AI-assisted knowledge management.

Work needed:
- Rewrite from "record log" into a coherent guide.
- Remove private system-instruction details if sensitive.
- Add screenshots or diagrams if available.

Suggested category/tags:
- `工具`
- `Obsidian`
- `Claude`
- `知识管理`

## Good Series Candidates

### Data Structure Series

Directory:
`D:\My_Obsidian_Vault\03-Courses\Data Structure and Algorithm\`

Candidates:
- `DSA精华\排序.md`
- `DSA精华\高级搜索树.md`
- `DSA精华\字符串.md`
- `DSA精华\搜索树应用.md`
- `DSA精华\二叉搜索树_复习.md`
- `章节讲义\优先队列.md`
- `复习\Divide-and-Conquer.md`
- `复习\Master Theorem.md`
- `复习\Large Integer Multiplication.md`

Recommendation:
- Publish as a series instead of isolated notes.
- Start with "search trees" because B-tree and red-black tree are already strong.

### Multivariable Calculus / Math Intuition Series

Directory:
`D:\My_Obsidian_Vault\03-Courses\多元微积分\`

Candidates:
- `可微性是如何统一方向导数和梯度的.md`
- `方向导数与梯度.md`
- `隐函数定理（IFT）.md`
- `强极值定理.md`
- `偏导数.md`
- `向量值函数的微分.md`
- `无穷小函数o.md`
- `Lipschitz连续.md`
- `一致连续.md`
- `矩阵范数.md`
- `Hesse Matrix.md`
- `多元Taylor 的一阶Hesse写法与完全的算子写法的对比.md`

Recommendation:
- These posts need `mathjax: true`.
- Convert them into "intuition + example + common trap" articles.

### Physics Series

Directory:
`D:\My_Obsidian_Vault\03-Courses\基础物理学\`

Candidates:
- `Energy.md`
- `Vector in Physics.md`
- `Conservation Laws.md`
- `Flows.md`
- `Momentum.md`
- `Newton's Laws.md`
- `Galilean Transformation.md`

Large lecture-note files:
- `lzy\Chapter 7 Rotation of Rigid Body.md`
- `lzy\Chapter 6 Energy (Mechanical).md`
- `lzy\Chapter 5 Linear Momentum(1).md`
- `lzy\Chapter 4 Newton's Law(1).md`
- `lzy\Chapter 8 None-Inertial Frame.md`

Recommendation:
- Do not publish the huge chapter files as-is.
- Split them into smaller topic articles.

### Research / Physical Simulation Series

Directory:
`D:\My_Obsidian_Vault\100-科研之路\`

Candidates:
- `每日学习\6.22.md`
- `物理仿真\物理仿真发展史.md`
- `LEARNING PHYSICS-GROUNDED 4D DYNAMICS WITH NEURAL GAUSSIAN FORCE FIELDS.md`
- `Struture from Motion.md`
- `3D Gaussian Splatting.md`
- `每日学习\Neo-Hookean.md`
- `每日学习\超弹性材料模型（Hyperelastic Material Model）.md`

Recommendation:
- `每日学习\6.22.md` is dense and should be split into:
  - `libuipc 入门`
  - `Neural IPC 数据生成`
  - `可微仿真和 Learned Surrogate`
- The NGFF paper note is blog-worthy but should cite/check paper facts before publishing.
- `物理仿真\IPC.md` was empty during scan.

### AI / Paper Reading Series

Directory:
`D:\My_Obsidian_Vault\05-Reading\`

Candidates:
- `Diffusion Model.md`
- `Diffusion Transformer.md`
- `Papers\conditional-to-joint sampling.md`
- `Papers\论文综述.md`
- `Relative L2 Error.md`

Recommendation:
- Good for short concept explainers.
- Add caveat if based on memory/assistant explanation rather than primary paper reading.

## Publish Only After Desensitization

### Personal Workflow System

Source:
`D:\My_Obsidian_Vault\00-System\我的智能工作流系统.md`

Reason:
- High value as a public post about AI-assisted learning systems.
- Contains personal devices, accounts, workflow planning, and private setup details.

Suggested public version:
`一个大一学生的 AI 学习工作流：从信息输入到博客输出`

Required cleanup:
- Remove overly private device/account details.
- Remove personal planning content not useful to readers.
- Keep system architecture and lessons.

### SSH / Lab Cluster Experience

Source:
`D:\My_Obsidian_Vault\100-科研之路\破局“Permission Denied”：AIR集群实验室新人的SSH免密进化之路.md`

Reason:
- Good narrative and practical value.
- Contains lab names, internal IP hints, username, and cluster details.

Required cleanup:
- Remove or generalize lab name.
- Remove username.
- Remove IP range.
- Remove specific server identifiers.
- Keep SSH key concepts and permission lessons.

### IntelliSearch Install Guide

Source:
`D:\My_Obsidian_Vault\04-Tech\AI\未央城\IntelliSearch 安装与运行指南.md`

Reason:
- Useful deployment guide.
- May contain local paths and API/config details.

Required cleanup:
- Replace `C:\Users\...` paths with generic paths.
- Remove API keys if any.
- Verify commands still work.

## Lower Priority / Not Directly Publishable

- `未命名*.md`: Some are large but need manual identification and renaming first.
- `.claude`, `.obsidian`, `.trash`, `Excalidraw`: not blog sources.
- Empty files:
  - `100-科研之路\物理仿真\IPC.md`
  - `100-科研之路\未命名.md`
- Huge course chapter files: useful source material, but need splitting and rewriting.

## Suggested Next Three Posts

1. `记了很多笔记，为什么还是想不起来？`
2. `终端里的平行网络：为什么浏览器能上网，代码却断网？`
3. `从第一性原理推导 B-树`

Reason:
- These three cover personal growth, practical tech, and hard technical content.
- They give the blog a more balanced first impression.

