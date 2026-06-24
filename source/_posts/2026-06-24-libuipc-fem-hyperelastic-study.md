---
title: 从 libuipc 到 Neo-Hookean：IPC 预训练数据生成中的物理概念梳理
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
description: 本文整理了近期每日学习中的三篇笔记，将 libuipc 数据生成、FEM/ABD、超弹性材料模型、Neo-Hookean 与 Neural IPC 的研究目标串成一条更清晰的理解链。
cover: /img/covers/cover-research-libuipc-fem.svg
mathjax: true
---

## 背景

这几天的学习主要围绕一个问题展开：

> 如果要用 `libuipc` 生成多物体随机碰撞数据，并进一步服务于 Neural IPC 或 contact-aware 模型训练，我到底需要理解哪些物理和工程概念？

最开始我只是在追踪数据生成脚本怎么跑，后来发现背后其实连着几层知识：

- `libuipc` 的场景组织方式；
- rollout 数据在训练中的意义；
- FEM、ABD、shell 和 rigid body 的差别；
- Neo-Hookean 等超弹性材料模型在 FEM 中的位置；
- Neural Surrogate、Neural Constitutive Model 和 Neural IPC 分别在学什么。

本文把三篇每日学习笔记整合成一条主线：先从 `libuipc` 工程对象入手，再进入物理建模，最后回到机器学习到底应该学材料、学力，还是学接触。

---

## 1. libuipc 里的核心对象

`libuipc` 可以先粗略理解成一套面向 IPC 仿真的物理系统。它里面有四个非常重要的对象：

- `Scene`：静态剧本，定义场景里有什么物体、材料、接触、约束和重力；
- `Object`：物体容器，比如一个 cube、shell 或 cloth；
- `Geometry`：物体真正携带的几何、拓扑和顶点数据；
- `World`：真正推进仿真的执行器。

一个比较直观的类比是：

| 对象 | 类比 |
|---|---|
| `Scene` | 实验设计图 |
| `Object` | 实验里的参与者 |
| `Geometry` | 参与者的身体形状 |
| `World` | 真正开始实验并推进每一帧的人 |

典型工作流是：

```text
建立 Scene
  -> 添加 Object
  -> 给 Object 绑定 Geometry
  -> 设置材料与接触参数
  -> world.init(scene)
  -> world.advance()
  -> world.retrieve()
  -> 保存顶点轨迹
```

这和当前数据生成任务可以直接对应起来：

- `geometry_dataset_factory` 提供 `mesh.obj`；
- OBJ 被读成 `Geometry`；
- 多个 `Geometry` 组成多物体 `Scene`；
- `World` 推进后输出碰撞轨迹；
- 这些轨迹就是 neural IPC 的训练数据来源。

第一阶段可以先做最小真数据：从已有 surface mesh 里采样多个物体，随机放置、赋初速度，让它们在 `libuipc` 中真实碰撞。此时目标不是马上做最复杂的 FEM，而是先把“几何资产 -> 仿真 -> 轨迹导出”的链条跑通。

---

## 2. rollout 和 Learned Surrogate

在强化学习和物理学习中，`rollout` 通常指从某个初始状态开始，把系统往后推演一段时间，得到一串状态轨迹。

在当前任务里，一个 rollout 可以理解成：

```text
初始几何、速度、材料、接触参数
  -> libuipc 真实仿真
  -> x_0, x_1, x_2, ..., x_T
```

这些序列可以被用作训练数据，让模型学习：

$$
x_t \rightarrow x_{t+1}
$$

或者更细一点：

$$
(x_t, v_t, geometry, contact) \rightarrow (x_{t+1}, v_{t+1})
$$

这里就引出 `Learned Surrogate Model`：用机器学习或深度学习方法训练出来的轻量模型，用来近似替代复杂物理仿真器。

它的优势主要有两个：

1. 推理速度快；
2. 天然适合反向传播。

但这里要注意一个逻辑顺序：不是“反向传播天然可微”，而是“神经网络由可微算子组成，所以可以用反向传播高效计算梯度”。

一个简单网络可以写成：

$$
y = \operatorname{Activation}(W_2 \operatorname{Activation}(W_1x+b_1)+b_2)
$$

矩阵乘法、加法和大多数激活函数都可以求导，因此整个复合函数也可以通过链式法则求导：

$$
\frac{\partial Loss}{\partial A}
=
\frac{\partial Loss}{\partial C}
\frac{\partial C}{\partial B}
\frac{\partial B}{\partial A}
$$

反向传播本质上就是链式法则的高效实现。

传统物理引擎则不同。碰撞、分支判断、离散接触状态切换会让系统在某些时刻不连续或不可微。IPC 的价值之一就在于它把接触以能量和约束优化的方式写出来，使接触问题有更好的数值稳定性和优化结构。

---

## 3. Python 绑定与 vcpkg：把 C++ 仿真接进 Python 数据管线

`libuipc` 本体主要是 C++ 写的，但数据生成、采样和训练前处理更适合放在 Python 里写。

这时就需要 Python 绑定。

直观理解：

- C++ 库像高性能发动机；
- Python 是驾驶室；
- Python 绑定就是把发动机控制接口接到驾驶室里。

没有 Python 绑定时，只能用 C++ 调用 `libuipc`，或者手动看底层源码。有了绑定后，就可以在 Python 中写：

```python
import uipc

scene = ...
world = ...
world.init(scene)
world.advance()
world.retrieve()
```

而 `vcpkg` 则是 C++ 世界里的依赖管理器，类似：

- Python 的 `pip`；
- Node 的 `npm`；
- Rust 的 `cargo`。

`libuipc` 依赖大量 C++ 库，例如 `eigen3`、`fmt`、`spdlog`、`libigl`、`tbb` 等。手动安装这些库非常痛苦，`vcpkg` 的作用就是统一下载、编译、安装，并告诉 CMake 到哪里找它们。

当前任务可以抽象成四层：

```text
vcpkg 安装 C++ 依赖
  -> 构建 libuipc
  -> Python 绑定暴露 uipc 模块
  -> Python 脚本采样场景并导出训练数据
```

---

## 4. FEM：从连续物体到四面体网格

FEM 是 Finite Element Method，即有限元方法。它是工程仿真和图形学物理仿真中非常基础的方法。

如果要模拟一个连续物体，比如橡胶球，FEM 会先把它离散成 tetrahedral mesh：

```text
连续物体
  -> tet mesh
  -> 每个 tetrahedron 计算应变和应力
  -> 汇总成顶点力
  -> 推进运动
```

在能量形式下，FEM 常常从弹性能量开始：

$$
\Psi(F)
$$

其中 $F$ 是 deformation gradient，即变形梯度。它描述局部材料从原始坐标 $X$ 到当前坐标 $x$ 的变形：

$$
F = \frac{\partial x}{\partial X}
$$

然后由能量求力：

$$
f = -\frac{\partial \Psi}{\partial x}
$$

FEM 的优点是物理准确，是工程界标准。Abaqus、Ansys、SOFA、IPC 等系统中都能看到 FEM 的影子。

但 FEM 也有一个重要门槛：3D FEM 通常不能直接拿普通 OBJ surface mesh 来算，它需要体网格。

也就是说：

```text
bunny.obj
```

通常还不能直接用于 3D FEM，需要先变成：

```text
bunny.tet / bunny.msh
```

这也是为什么数据生成管线里需要 tetrahedralization。

---

## 5. ABD：Affine Body Dynamics 为什么适合快速仿真

ABD 是 Affine Body Dynamics。它可以理解成 rigid 和 full FEM 之间的一种折中。

传统 FEM 可能有：

```text
10000 vertices
50000 tetrahedra
```

每个 tetra 都有自己的 deformation gradient $F$。

ABD 则把一块区域看成仿射变换：

$$
x' = Ax + b
$$

其中 $A \in \mathbb{R}^{3 \times 3}$ 表示旋转、拉伸和剪切，$b$ 表示平移。

因此它的建模单位从 tetrahedron 变成了 affine element 或 cluster：

```text
Object
  -> Affine Element
  -> Energy
```

而不是：

```text
Tet
  -> Energy
```

这会明显降低自由度。传统 FEM 的计算量大致跟 tet 数量相关，而 ABD 更接近跟 cluster 数量相关：

```text
FEM: O(#tet)
ABD: O(#cluster)
```

从机器学习角度看，ABD 也很有意思。每个 cluster 的状态里天然有一个 $A$，这很像一个 token：

```text
Cluster 1
Cluster 2
Cluster 3
...
```

因此 ABD 比逐 tet 的 FEM 更容易和 Transformer 式模型发生联系。

不过，对于当前第一版多物体随机碰撞数据来说，优先级并不是立刻深入 ABD。更合理的顺序是：

```text
libuipc 安装
  > 随机场景生成
  > 轨迹导出
  > contact 信息导出
  > ABD / FEM / shell 细节
```

否则很容易陷入求解器细节，却迟迟生成不了数据。

---

## 6. 超弹性材料模型：从能量函数到应力

超弹性材料模型的核心是定义应变能密度函数：

$$
\Psi(F)
$$

然后由能量求应力：

$$
P = \frac{\partial \Psi}{\partial F}
$$

最终 FEM 中再通过能量对位置求导得到力：

$$
f = -\frac{\partial \Psi}{\partial x}
$$

常见超弹性模型包括：

| 模型 | 特点 | 适用场景 |
|---|---|---|
| StVK | 小变形简单，大变形容易不稳定 | 入门教材、简单测试 |
| Neo-Hookean | 经典、稳定、大变形可用 | 橡胶、软球、果冻 |
| Corotated | 对大旋转友好 | 图形学仿真 |
| Mooney-Rivlin | 比 Neo-Hookean 更适合真实橡胶 | 工业橡胶材料 |
| Yeoh | 拟合能力强，参数相对少 | 非线性橡胶 |
| Ogden | 表达能力很强，但参数复杂 | 高精度材料拟合 |
| ARAP | 尽可能保持刚体 | 几何编辑、形状变形 |

这些模型本质上都回答一个问题：

> 局部材料变形成 $F$ 之后，系统应该储存多少弹性能量？

---

## 7. Neo-Hookean：FEM 里的“弹簧常数升级版”

Neo-Hookean 是 FEM 里最经典的超弹性材料模型之一。

一维弹簧里，我们有：

$$
F = -kx
$$

能量是：

$$
E = \frac{1}{2}kx^2
$$

三维连续体里，拉伸、压缩、剪切、扭转不能再用一个 $x$ 描述，于是引入变形梯度 $F$。

Neo-Hookean 的常见形式是：

$$
\Psi(F)
=
\frac{\mu}{2}(I_C-3)
- \mu \ln J
+
\frac{\lambda}{2}(\ln J)^2
$$

其中：

$$
J = \det(F)
$$

表示体积变化；

$$
I_C = \operatorname{tr}(F^T F)
$$

表示拉伸程度；

$$
\mu,\lambda
$$

是 Lamé 参数，通常由 Young's Modulus 和 Poisson Ratio 换算而来。

三个项可以粗略理解为：

- $\frac{\mu}{2}(I_C-3)$ 控制拉伸和剪切；
- $-\mu \ln J$ 防止体积无限缩小；
- $\frac{\lambda}{2}(\ln J)^2$ 控制体积变化代价。

在 `libuipc` 中可以这样理解：

```text
Tet Mesh
  -> Neo-Hookean
  -> Elastic Energy
  -> IPC Solver
  -> Motion
```

如果把材料换成 Corotated、StVK 或 Ogden，物体的变形行为也会变。

---

## 8. Neural IPC 到底应该学什么

这几天最大的收获，是把几个容易混在一起的问题分开了。

很多 Neural Constitutive Model 工作的价值主要是：

```text
更强材料表达能力
```

而不一定是：

```text
更快求解
```

例如真实材料可能不是简单 Neo-Hookean 能描述的：

- 针织布；
- 毛衣；
- 羽绒服；
- 牛仔裤；
- 泡沫；
- 人体组织。

它们可能具有各向异性、滞回、蠕变、塑性或复杂微结构。这时学习一个神经材料模型：

$$
\Psi_\theta(F)
$$

或者：

$$
(F_t, h_t) \rightarrow P_t
$$

确实有意义。

但对于当前的多物体碰撞数据生成任务，真正的难点并不一定是材料能量，而是接触：

```text
谁碰谁
什么时候碰
碰撞后怎么交换动量
摩擦怎么传递
如何避免穿透
```

两个 Neo-Hookean 球如果没有接触模型，也会直接穿过去。而即使把材料模型简化成刚体，只要接触处理正确，依然能产生合理的碰撞现象。

因此，对于 IPC / GeoPT / UniSoma 这条线，一个更值得关注的方向可能是：

```text
Mesh
  -> Geometry Representation
  -> Contact Graph / Contact Force
  -> IPC or learned dynamics
```

而不是简单地：

```text
Mesh
  -> Neo-Hookean
```

后者更像是在学习一个已经有成熟解析模型、并且在很多场景下不是最大瓶颈的部分。

---

## 9. 学 $P$ 还是学 $\Psi$

另一个关键问题是：神经网络应该直接学应力 $P$，还是学能量 $\Psi$？

如果直接学习：

$$
P_\theta(F)
$$

可能出现一个问题：它不一定对应某个真实能量函数。

也就是说：

$$
P_\theta \neq \frac{\partial \Psi}{\partial F}
$$

这会带来能量不守恒、数值爆炸等风险。

因此很多工作会回到学习能量的路线：

$$
\Psi_\theta(F)
$$

再通过自动微分得到：

$$
P_\theta(F)=\frac{\partial \Psi_\theta}{\partial F}
$$

这条路线更容易把物理先验写进模型，也更容易维持数值稳定性。

---

## 10. 当前任务的优先级

结合这三篇学习笔记，我对当前任务的优先级重新排序如下：

1. 先让 `libuipc` 的安装、构建和 Python/C++ 调用链跑通；
2. 从 `geometry_dataset_factory` 中稳定采样 mesh；
3. 先生成 rigid / ABD 风格的多物体随机碰撞数据；
4. 统一导出格式，例如 `x[t, object, vertex, 3]`、object id、mesh topology；
5. 加入 contact label、contact force 或 contact graph；
6. 再扩展到 FEM soft body；
7. 最后考虑 shell、cloth 与 mixed physics scene；
8. 如果要做神经材料模型，再区分学习 $P_\theta$ 还是 $\Psi_\theta$。

短期目标不应该是把所有物理模型一次性搞懂，而是先建立一条稳定的数据生产线：

```text
Geometry Dataset
  -> Scene Sampling
  -> libuipc Simulation
  -> Rollout Export
  -> Visualization Check
  -> Training Data Format
```

等数据链条稳定后，再逐步把 rigid、ABD、FEM、shell 和 neural surrogate 接起来。

---

## 小结

这三篇每日学习笔记最终串成了一个更清晰的认识：

- `libuipc` 是数据生成的真实物理引擎；
- rollout 是训练 neural surrogate 的基本数据形式；
- FEM 需要体网格，适合高精度弹性体；
- ABD 降低自由度，更适合快速仿真和 token 化理解；
- Neo-Hookean 是最经典的大变形超弹性材料模型；
- Neural Constitutive Model 主要增强材料表达能力；
- Neural IPC 更值得关注的可能是 contact dynamics，而不只是材料能量。

所以，接下来最重要的不是“马上学会所有材料模型”，而是把数据生成、接触标注和训练格式真正打通。对于当前阶段，能稳定地产生可信的多物体接触 rollout，比堆更多概念更重要。
