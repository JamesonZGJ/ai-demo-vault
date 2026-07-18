# Proposal: Inventory own Blueprints

## Why

Blueprint 商业化必须建立在可运行、可证明权属且不泄露隐私的自有资产上。当前只能确认 ColorSnap 单页原型位于工作区；“游戏、AI 动画、UI 改造”尚未找到可核验项目路径。若直接制作商品，会把模拟功能、第三方素材或不存在的源码包装成可售资产。

本 change 只建立自有资产事实底账，不改产品、不制作付费包、不接支付。它可按路线图与 Curated MVP 的生产部署并行，但必须独立确认和归档。

## Current evidence

截至 2026-07-17，只读发现得到以下事实：

| 资产组 | 当前可确认位置 | 当前边界 |
|---|---|---|
| ColorSnap | `../ColorSnap_Demo_review/index.html`、`initial-mobile.png`、`assets/mock/` | 单页前端原型；当前无 AI、后端、账号或支付；18 张模拟图片只有 Unsplash 总许可说明，缺逐图作者与原始链接 |
| ColorSnap 私密数据 | `../ColorSnap_Demo_review/.chrome-profile/` | 只登记目录存在；禁止读取子文件、复制、哈希或上传 |
| 游戏 | 未找到 | `location_required`，不能根据文件名或回忆生成资产记录 |
| AI 动画 | 未找到 | `location_required`，不能把普通海报或图片自动归类为 AI 动画 |
| UI 改造 | 未找到 | `location_required`；现有服务商品图不能自动视为可售 UI 项目 |

当前 ColorSnap `index.html` 的只读 SHA-256 为 `33f94226d40c2fd37a58720273ac3381b036b06ea3bc5b134c7e6741c43e985d`，`initial-mobile.png` 为 `150d93ca95957361dfae6d9b6eb0a356452bf00dad3b726c79c40055d027dc93`。这些值只证明审计时读取到的文件，不证明作者、许可、功能完整或可售。

## What changes

- 建立机器可读的自有资产清单与人类可读审计报告。
- 对每个资产记录文件位置、哈希、功能真实性、运行证据、AI 边界、素材与代码权利、隐私/密钥结果、名称风险和可售状态。
- 为 ColorSnap 逐项区分已实现、模拟、未实现；不把 CIEDE2000 确定性计算描述成 AI。
- 为游戏、AI 动画和 UI 改造建立显式待定位记录；只有用户提供路径或归档后才读取和核验。
- 增加严格校验脚本，禁止缺证据资产进入 `package_candidate` 或 `sellable`。
- 产出 Blueprint 候选排序，但不创建 Prompt、PRD、Figma、源码包或商品。

## In scope

| 能力 | 本 change 交付 |
|---|---|
| 资产定位 | ColorSnap、游戏、AI 动画、UI 改造各有明确状态；已定位项保存可复核路径和 SHA-256 |
| 功能真实性 | 每项功能只允许 `verified`、`simulated`、`missing`、`not_applicable`，并绑定证据 |
| AI 边界 | 只有真实模型/API/本地推理证据才能标记 AI 能力；算法和规则单独记录 |
| 权利 | 区分自有代码、第三方代码、模型、字体、图片、音视频、品牌和生成内容，保存来源与许可缺口 |
| 隐私与密钥 | 排除浏览器 profile、账号、令牌、私钥、客户数据和个人信息；扫描结果可复核 |
| 可运行性 | 已定位项目从干净副本按登记命令打开或构建，记录环境、结果和失败原因 |
| 可售判断 | 只给出 `not_sellable`、`rework_required`、`package_candidate`、`sellable`；缺证据时失败即停 |

## Out of scope

- 修改 ColorSnap 功能、接入 AI、增加后端或重构代码。
- 为 ColorSnap 定名、申请商标或作法律结论。
- 制作 Blueprint 八类交付物、复制第三方源码或打包第三方素材。
- 发布商品、定价、购买、下载、会员或支付。
- 把未找到的资产写成已拥有、已运行或可售。
- 读取、复制、哈希或扫描 `.chrome-profile` 内部文件。

## Success criteria

1. ColorSnap、游戏、AI 动画、UI 改造四组都有明确、非猜测的定位状态；未提供路径的项目保持 `location_required`。
2. 每个已定位资产都有逐文件清单、SHA-256、文件大小、审计日期和来源；目录或文件变化可被检测。
3. 每条功能声明都有可复核证据，并明确区分真实、模拟、缺失和不适用。
4. 每个已定位项目完成干净环境打开/构建验证；失败必须原样记录，不能用截图替代运行证据。
5. 权利清单覆盖代码、模型、字体、图片、音视频、品牌和生成内容；未知或缺逐项来源时不能标记可售。
6. 隐私与密钥审计为零泄漏；`.chrome-profile` 只作为永久排除项存在，任何产物都不包含其内容或哈希。
7. `package_candidate` 仅表示可以进入后续 Blueprint 制作提案；本 change 默认不产生 `sellable` 商品。
8. 校验、Review 查 Bug和第一性原理精简完成，文档不把资产盘点写成 Blueprint 已交付。

## Decisions requiring confirmation

- 同意本 change 只做事实盘点，不顺带改造 ColorSnap 或制作付费包。
- 用户需要提供游戏、AI 动画和 UI 改造的准确目录或归档；未提供时保持 `location_required`。
- 用户需要逐项确认自己对代码和素材的权利；文件位于工作区不能自动证明所有权。
- ColorSnap 后续是更名为非 AI 工具，还是增加真实 AI 闭环，留给 `prepare-own-blueprint-001` 决定。
