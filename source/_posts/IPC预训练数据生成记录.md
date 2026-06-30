---
title: 从 Surface Mesh 到 libuipc 预训练数据：一次数据生成管线搭建记录
date: 2026-06-24 12:10:00
categories:
  - 科研
tags:
  - libuipc
  - IPC
  - FEM
  - ABD
  - Neo-Hookean
  - 超弹性材料
  - Neural IPC
description: IPC数据生成管线搭建记录。
cover: /img/covers/cover-research-libuipc-fem.svg
mathjax: true
---
# 从 Surface Mesh 到 libuipc 预训练数据：一次数据生成管线搭建记录

## 背景

这轮工作的目标很明确：为 IPC / contact-aware 模型构建真实物理 rollout 数据，而不是继续依赖伪动力学或只看静态几何。

我们希望数据能够覆盖：

- 多物体碰撞；
- 动量传递；
- 3D 弹性体形变；
- thin shell / cloth 弯曲；
- rigid、elastic、shell 混合物理系统。

最终目标不是单纯生成几个能看的 MP4，而是逐步搭建一条可扩展的数据生成管线：几何资产发现、场景采样、真实 libuipc 仿真、MP4 可视化、日志校验、后续训练数据导出。

---

## 第一阶段：确认真实 libuipc rollout 可行

最开始我们先尝试从 `geometry_dataset_factory` 中采样 OBJ 几何，生成 `scene_manifest.json`，再由 C++ 程序调用 `libuipc` 执行真实仿真。

这一阶段的核心结论是：

- Python 侧负责采样和 manifest；
- C++ 侧负责真实 `libuipc` 仿真；
- 数据输出统一放到 `/essfs10/daishibo/data`，避免污染源码树；
- MP4 只是检查用预览，不是训练数据本体。

我们实现并使用了刚体/几何 rollout 相关脚本：

- `libuipc_rollout_factory/generate_rollouts.py`
- `libuipc_rollout_factory/generate_collision_batch.py`
- `libuipc/apps/examples/geometry_rollout_from_dataset/main.cpp`

早期可视化非常粗糙：只是把 OBJ 帧渲染成 PNG，然后用 `ffmpeg` 编码 MP4。这个阶段的目的只是验证 “OBJ rollout 能被看见”。

---

## 第二阶段：修正可视化问题

第一次生成 MP4 后，结果很差。主要问题有两个：

1. 物体数量和速度都不够，碰撞不明显；
2. 背景网格看起来在动。

第二个问题不是物理仿真错误，而是渲染器错误。旧渲染脚本每帧都重新根据当前 OBJ 计算坐标轴范围和中心，导致相机坐标系随物体运动而漂移。视觉上看起来像背景网格在移动。

修复方式：

- 对全序列 OBJ 先计算全局 bounds；
- 所有帧使用同一个坐标中心和半径；
- 增加 `--view-scale` 和 `--focus-quantile` 控制近景；
- 增加半透明地面；
- 用连通分量给不同物体分色。

相关脚本：

- `libuipc_rollout_factory/render_obj_rollout.py`

这个修复之后，MP4 才开始具备判断仿真质量的意义。

---

## 第三阶段：刚体数据批量生成

接下来我们生成了第一批刚体碰撞数据。

关键改动：

- 默认输出路径改到 `/essfs10/daishibo/data`；
- 采样过滤 `watertight=true`；
- 排除 `thin_shell` 等 open-boundary mesh；
- 提高物体数量；
- 提高速度；
- 使用 multi-object collision 初始化；
- 每个场景输出 OBJ 帧和 MP4。

已完成数据：

- 目录：`/essfs10/daishibo/data/libuipc_collision_batch_50_120f_mp4`
- 场景数：50
- 每场景帧数：120
- 每场景有 MP4

这一阶段证明：`geometry_dataset_factory` 的 closed surface mesh 可以直接用于刚体/affine 类接触仿真。

---

## 第四阶段：转向 FEM 非刚体

能不能生成非刚体?我们开始构建 FEM pipeline。

实现了新的 C++ runner：

- `libuipc/apps/examples/fem_rollout_from_msh_manifest/main.cpp`
- 可执行文件：`fem_rollout_from_msh_manifest`

这个 runner 的特点：

- 读取 manifest；
- 每个 object 读取 `.msh` tetrahedral mesh；
- 使用 `StableNeoHookean`；
- 随机材料参数；
- 设置初始位置和速度；
- 加入地面；
- 输出 surface OBJ sequence；
- 输出 `meta.json`。

最初 FEM 输入资产只有 `libuipc` 内置的 5 个 tetmesh：

- `ball.msh`
- `bunny0.msh`
- `cube.msh`
- `link.msh`
- `tet.msh`

我们先用这些资产跑通链路，而不是直接追求资产多样性。

已完成：

- FEM 120 帧预览：
  - `/essfs10/daishibo/data/libuipc_fem_preview_120f`
- FEM multi-hub 50 场景：
  - `/essfs10/daishibo/data/libuipc_fem_multihub_batch_50_120f`

这批数据证明 FEM pipeline 能跑，但它也暴露了一个问题：资产随机性不足。因为只有 5 个内置 `.msh`。

---

## 第五阶段：重新审视 geometry_dataset_factory

我们检查了 `/essfs10/daishibo/code/geometry_dataset_factory` 的数据格式。

结论：

- 该数据集当前是 surface mesh 数据集；
- 有 493 个 `mesh.obj`；
- 有 493 个 `metadata.json`；
- 没有 `.msh`、`.tet` 或 `.vtk`；
- `thin_shell` 也是 surface mesh，而且全部是 open-boundary thin shell。

统计结果：

- `thin_shell`: 94 个，全部 `watertight=false`、`has_boundary=true`；
- 非 thin-shell 中有大量 `watertight=true` 的 closed surface mesh；
- closed surface mesh 可以用于刚体；
- 3D FEM 不能直接使用 OBJ surface，需要 tetrahedral mesh。

这一步明确了物理模型和几何输入之间的边界：

- Rigid / affine body：closed surface mesh 可用；
- 3D FEM elastic body：必须 tet mesh；
- Shell / cloth：直接用 surface mesh，但需要 shell constitution；
- thin shell 不应该被强行 tet 化成实体 FEM。

---

## 第六阶段：理解 affine body、FEM 和 shell

我们进一步梳理了几个物理模型的关系。

刚体：

- 不变形；
- 只有平移和旋转；
- closed surface mesh 足够。

Affine body：

- 允许整体仿射变形；
- 可以整体拉伸、压缩、剪切；
- 不能表达局部凹陷和皱褶；
- 是 rigid 和 full FEM 之间的低自由度折中。

Tetrahedral FEM：

- 每个顶点有自由度；
- 能表达局部形变、压缩、剪切、波传播；
- 需要 `.msh` 体网格；
- 物理能力强，但成本高、失败率也更高。

Shell / cloth：

- 使用 triangle surface mesh；
- 不需要 tet mesh；
- 需要 `thickness` 和 `bending_stiffness`；
- 适合 open cylinder、sheet、cloth、thin shell patch。

我们确认 `libuipc` 中已经有 shell 相关 constitution：

- `NeoHookeanShell`
- `DiscreteShellBending`
- `StrainPlasticDiscreteShellBending`
- `StressPlasticDiscreteShellBending`

因此 thin shell 的正确路线不是 tet 化，而是后续实现 `shell_rollout_from_obj_manifest`。

---

## 第七阶段：构建 tet_dataset_factory

为了让 FEM 数据真正使用 `geometry_dataset_factory` 的资产，我们需要把 closed surface mesh 转成 tetrahedral mesh。

我们新增了转换脚本：

- `libuipc_rollout_factory/tetrahedralize_geometry_dataset.py`

输出目录：

- `/essfs10/daishibo/code/tet_dataset_factory/data/processed/small`

转换策略：

- 跳过 `thin_shell`；
- 只处理 `watertight=true`；
- 当前限制 `--max-faces 2500`；
- 用 `trimesh` 读取 OBJ；
- 用内部点采样；
- 用 `scipy.spatial.Delaunay` 做 fallback tet 化；
- 用 tet centroid 是否在 mesh 内部过滤；
- 写出 Gmsh 2.2 `.msh`。

结果：

- 成功生成 `mesh.msh`: 345
- 失败：0
- summary：
  - `/essfs10/daishibo/code/tet_dataset_factory/data/processed/small/tetrahedralization_summary.jsonl`
- 日志：
  - `/essfs10/daishibo/code/tet_dataset_factory/tetrahedralize.log`

我们还做了 smoke test：选一个新生成的 `.msh`，用 `fem_rollout_from_msh_manifest` 跑 1 帧 `libuipc` CUDA FEM，成功输出 surface OBJ。

重要限制：

当前 tet 化方法是 fallback，不是生产级 constrained tetrahedralization。后续应替换为 `gmsh`、`fTetWild` 或 `TetGen`。

---

## 第八阶段：用新 tet 数据集生成 FEM rollout

随后我们把 FEM batch 的资产发现逻辑从扁平目录改成递归目录：

- 原来只支持 `tetmesh_root/*.msh`；
- 现在支持 `tetmesh_root/**/*.msh`；
- 对 `mesh.msh`，`mesh_id` 使用父目录名。

相关脚本：

- `libuipc_rollout_factory/generate_fem_collision_batch.py`

然后用新生成的 345 个 `.msh` 启动新的 FEM multi-hub batch：

- 输出目录：`/essfs10/daishibo/data/libuipc_fem_tetdataset_multihub_batch_50_120f`
- 场景数：50
- 每场景帧数：120
- 每场景物体数：5~9
- 几何来源：`tet_dataset_factory`
- MP4 近景参数：
  - `--view-scale 0.55`
  - `--focus-quantile 0.96`

已确认：

- `scene_0000` 完成；
- `scene_0001` 完成；
- 后续场景已经开始生成；
- manifest 中已经出现来自 `johnson`、`faceted`、`catalan`、`geodesic`、`antiprism` 等多类资产。

这一步解决了此前 FEM 只从 5 个内置 `.msh` 采样导致的随机性不足问题。

---

## Multi-Hub 采样策略

我们从单中心汇聚改成了 multi-hub。

旧策略：

- 所有物体大致冲向一个中心；
- 碰撞概率高；
- 但模式单一。

新策略：

1. 每个场景采样多个 collision hubs；
2. 每个 hub 至少分配 2 个物体；
3. 每个物体在所属 hub 周围球壳上采样初始位置；
4. 初速度近似指向所属 hub；
5. 加入切向扰动和高斯噪声；
6. 速度大小通过 `distance_to_hub / hit_time` 决定，再 clamp 到速度范围。

目的：

- 保持高碰撞率；
- 产生多个局部碰撞簇；
- 避免所有样本都是中心爆炸；
- 增加斜碰、擦碰和链式接触。

---

## 最小多物理数据集设计

我们最终把数据集路线整理成三阶段 curriculum。

### Stage 1: 单物理类型

Rigid-Rigid:

- 2 objects: 500 rollouts
- 3 objects: 500 rollouts
- 4 objects: 500 rollouts

Elastic-Elastic:

- 2 objects: 500 rollouts
- 3 objects: 500 rollouts
- 4 objects: 500 rollouts

Shell-Shell:

- 2 objects: 500 rollouts
- 3 objects: 500 rollouts
- 4 objects: 500 rollouts

### Stage 2: 两两混合

- Rigid + Elastic: 1000 rollouts
- Rigid + Shell: 1000 rollouts
- Elastic + Shell: 1000 rollouts

### Stage 3: 全混合

- Rigid + Elastic + Shell: 1000 rollouts

总规模约 8500 rollouts。

同时定义了最小验证集：

- 7 个 dataset type；
- 每类 200 rollouts；
- 总计 1400 rollouts。

这个设计的价值是：先验证单一物理，再逐步混合，便于定位模型失败原因。

---

## 当前关键产物

文档：

- `/essfs10/daishibo/code/libuipc_rollout_factory/docs/ipc_pretraining_data_generation_status.md`
- `/essfs10/daishibo/code/libuipc_rollout_factory/docs/pipeline_design.md`

刚体数据：

- `/essfs10/daishibo/data/libuipc_collision_batch_50_120f_mp4`

FEM 内置资产数据：

- `/essfs10/daishibo/data/libuipc_fem_preview_120f`
- `/essfs10/daishibo/data/libuipc_fem_multihub_batch_50_120f`

Tet 数据集：

- `/essfs10/daishibo/code/tet_dataset_factory/data/processed/small`

FEM 新 tet 数据集 batch：

- `/essfs10/daishibo/data/libuipc_fem_tetdataset_multihub_batch_50_120f`

核心脚本：

- `libuipc_rollout_factory/render_obj_rollout.py`
- `libuipc_rollout_factory/generate_collision_batch.py`
- `libuipc_rollout_factory/generate_fem_collision_batch.py`
- `libuipc_rollout_factory/tetrahedralize_geometry_dataset.py`
- `libuipc/apps/examples/fem_rollout_from_msh_manifest/main.cpp`

---

## 当前限制

1. Tet 化质量仍需提升

当前 `tet_dataset_factory` 是 fallback Delaunay tet 化，不是高质量 constrained tet mesher。能跑通 smoke test，但未来训练前应评估 mesh quality，最好切换到专业工具。

2. Shell pipeline 尚未实现

`libuipc` 支持 shell constitution，但我们还没有写 `shell_rollout_from_obj_manifest`。

3. Mixed physics runner 尚未实现

Rigid、FEM、shell 的混合 scene 还需要统一 C++ runner 和 manifest schema。

4. 训练数据格式尚未统一

目前主要输出：

- OBJ surface sequence；
- MP4 preview；
- manifest；
- run log。

训练最终需要：

- `rollout.npz`
- `meta.json`
- object slices；
- physics type；
- material parameters；
- contact metadata。

5. OBJ sequence 缺少稳定 object identity

当前可视化通过连通分量临时分色，但训练数据需要显式记录每个物体的 vertex slice 或 persistent object id。

---

## 下一步

优先级最高的工作：

1. 等待并检查 `libuipc_fem_tetdataset_multihub_batch_50_120f` 完成情况；
2. 统计每个 scene 的接触日志和失败率；
3. 随机抽查 MP4，确认新 tet 数据集 FEM 数据的形变和碰撞质量；
4. 实现 `shell_rollout_from_obj_manifest`；
5. 用 `thin_shell` 生成 Shell-Shell 最小验证集；
6. 设计 mixed manifest；
7. 统一导出训练用 `npz`。

这轮工作的核心成果不是某一个单独视频，而是把路线打通了：

```text
geometry_dataset_factory surface OBJ
    -> tet_dataset_factory mesh.msh
    -> libuipc FEM rollout
    -> OBJ sequence + MP4
    -> future training dataset
```

同时也明确了另一条 thin shell 路线：

```text
geometry_dataset_factory thin_shell OBJ
    -> libuipc shell model
    -> shell rollout
    -> OBJ sequence + MP4
    -> future training dataset
```
