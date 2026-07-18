# AI Demo Marketplace 信息架构

## 0. 这次重新定义

本产品不是 Product Hunt，也不是 Gumroad，也不是以完整 App 为主的 Blueprint 商店。

它是一个 **AI Demo Marketplace**：收集、拆解、重构并售卖可直接复用的 AI 能力模块。

Demo 只是在线预览。用户真正购买的是 **Capability Package**：一套可以复制进自己项目的实现和接入资产：

- 在线 Demo
- 源码
- Cursor Prompt
- Claude Prompt
- AI 生成 Prompt
- README
- 参数说明
- Integration Guide（如何复制到自己的项目）

完整 App Blueprint 保留，但降为高价、高复杂度的高级商品类型，不再决定首页和主导航。

## 1. 核心对象

```text
Capability = 可被复用的交互、前端能力或 AI 工作流
Demo Preview = Capability 的免费在线预览，不是商品
Capability Package = 一个 Capability 的可售实现资产包
Bundle = 多个 Capability Package 的组合商品
App Blueprint = 面向完整产品复刻的高级商品
Library Item = 用户已获取的 Package、Bundle 或 Blueprint 版本
```

一个 Capability 必须能单独回答：

1. 它解决了哪个开发或产品问题？
2. 用户可以把它复制到哪里？
3. 免费 Demo Preview 能验证什么？
4. Capability Package 具体交付哪些实现资产？
5. 需要什么技术栈、依赖和参数？
6. 如何在自己的项目中完成接入？

## 2. 商品层级

| 层级 | 商品例子 | 价格方向 | 首页权重 | 购买后结果 |
|---|---|---:|---|---|
| Free Demo | Hover card、AI Loading、玻璃拟态 | 免费 | 高 | 只能在线体验和看基础说明 |
| Capability Package | 图片取色、抽卡动画、分享海报、无限滚动 | ¥1.9–9.9 | 最高 | 自研源码、Prompt、README、参数和 Integration Guide |
| Bundle | Apple UI Pack、Game UI Pack、AI Agent Pack | ¥19–49 | 中 | 一组相关 Package 的统一资料库 |
| App Blueprint | ColorSnap Blueprint、完整 AI SaaS 复刻包 | 高价 | 低 | 完整产品拆解、PRD、技术和商业方案 |

价格只是当前商品策略假设；在真实支付上线前不能在页面写成已批准售价。

`Demo Preview` 永远不显示商品价格或购买成功状态；只有 `CapabilityPackage`、`Bundle` 和 `App Blueprint` 可以拥有价格、版本和购买权益。

## 3. 分类与搜索词

首页和目录优先按“开发者正在寻找什么”组织，而不是按行业或创业主题组织。分类既是导航，也是搜索过滤器。

| 分类 | 首批搜索词/模块例子 |
|---|---|
| UI Interaction | Hover、Card、拖拽、无限滚动、聊天输入框 |
| Motion & Animation | 抽卡、奖励动画、AI Loading、转场、数字滚动 |
| Visual Effects | 玻璃拟态、卡片高光、噪点、光晕、渐变、粒子 |
| Image & Vision | 图片取色、裁剪、压缩、颜色分析、分享海报 |
| AI Workflow | 流式输出、Prompt、Agent、重试、引用、结构化结果 |
| Chat UI | Chat Input、消息流、引用卡、工具调用状态 |
| Game UI | 抽卡、奖励、进度、地图、结果动画 |
| Landing & Hero | Landing Page、Hero Section、定价卡、CTA、案例墙 |
| Canvas / Map / Audio / Video | Canvas、地图聚类、Marker、音频控件、视频处理 |
| Full App Blueprint | 完整产品复刻，不作为首页主商品类型 |

技术栈筛选独立保存：React、Next.js、Tailwind、Framer Motion、GSAP、Canvas、Supabase 等，不与分类混用。

`AI` 不作为所有模块的强制筛选条件。Hover、玻璃拟态和动画可以是非 AI 的前端能力；AI 主要体现在 AI Workflow、Prompt、Agent 和“用 AI 复刻”的交付方式。能力另保存 `capability_mode`：`frontend`、`visual`、`interaction`、`ai_native`。

## 4. 搜索是第一入口

搜索不是目录的附属功能，而是首页的核心动作。用户可以搜索能力、视觉关键词、技术栈和使用场景：

```text
Glass / Hover / Loading / Color Picker / Infinite Scroll
Apple / Vision Pro / Card / Game / Chat / Agent / Prompt
```

搜索结果直接落到 Capability 卡片，而不是先进入行业目录。每条结果必须同时返回：

- Capability 名称和一句话结果
- 分类、标签和技术栈
- Demo Preview 状态
- Package 资产状态
- 复制难度和价格状态

搜索索引字段：`title`、`tagline`、`category`、`tags`、`stack`、`use_cases`、`source_keywords`。搜索词命中后，用户应能在一次点击内进入在线预览。

## 5. 页面树

```text
/
├─ /explore                         Capability Package 市场
│  ├─ /explore/[slug]               独立 Capability 详情与 Package 购买页
│  └─ /explore?q=&category=&stack=  搜索和筛选结果（不新增页面族）
├─ /search?q=                       `/explore` 的兼容搜索别名
├─ /bundles                         Bundle 列表
│  └─ /bundles/[slug]               Bundle 详情
├─ /blueprints                      高级 App Blueprint 列表（次入口）
│  └─ /blueprints/[slug]            高级商品详情
├─ /library                         我的 Capability Library
│  ├─ /library/[slug]               已获取商品资产
│  └─ /library/bundles/[slug]       已获取 Bundle
├─ /checkout/[productId]            单品获取/支付入口
├─ /checkout/result/[orderId]       服务端确认结果
├─ /account/favorites               收藏
└─ /legal/*                         条款、许可、退款、隐私
```

兼容迁移期可以保留旧路径：

```text
/demos              → /explore
/demos/[slug]       → /explore/[slug]
/search?q=          → /explore?q=
/account/library    → /library
```

## 6. 主导航

```text
Demo Marketplace   Search Capabilities   Categories   Bundles   App Blueprints   My Library
```

规则：

- `Demo Marketplace` 是品牌和默认入口。
- `Search Capabilities` 是最重要的导航动作，桌面端常驻，移动端置于首屏。
- `App Blueprints` 只作为高级商品入口，不能出现在首页第一屏的主叙事中。
- 购买后进入 `My Library`，不再使用“Launch Dashboard”作为所有商品的统一名称。
- 收藏是跨商品的辅助动作，不抢主导航。

## 7. 首页结构

首页目标是让用户产生“这里一定能找到我现在需要的那个效果”，并在一次搜索或点击内进入 Demo Preview。

### 首屏

推荐主张：

> Find the capability your next build needs.

中文辅助说明：

> 搜索一个能力，在线预览，购买 Capability Package，复制到自己的项目。

按钮：

- `Search Capabilities`
- `Browse Categories`

首屏右侧使用真实可交互 Demo 卡，不使用抽象的 Blueprint 评分板。

### 首页区块顺序

| 顺序 | 区块 | 内容 |
|---:|---|---|
| 1 | Search Hero | 搜索框、热门关键词和 Search Capabilities |
| 2 | Browse by Category | UI Interaction、Motion、Image & Vision、AI Workflow、Chat UI、Game UI 等 |
| 3 | Featured Capabilities | 编辑精选的 6–8 个能力模块，展示 Demo Preview 和 Package 状态 |
| 4 | Popular | 只使用真实浏览、收藏或购买数据；没有数据时不伪造热度 |
| 5 | Latest | 最新上线的 Capability，按发布时间排序 |
| 6 | Browse by Stack | React、Tailwind、Framer Motion、GSAP、Canvas 等 |
| 7 | Bundles | Apple UI、Game UI、AI Agent、Landing、Animation |
| 8 | App Blueprint | 低视觉权重的高级商品入口，保留 ColorSnap 等完整案例 |

首页卡片不能出现“完整创业资料包”“Market Opportunity”作为第一信息，也不能让用户先读长文再找 Capability。

## 8. Capability 卡片

每一张卡展示一个 Capability 和它的 Demo Preview；只有 Package 已经具备可售资产时才显示购买按钮：

```text
真实可交互 Demo Preview
Capability 名称
一句话可复用结果
分类 · 技术栈 · 难度
Package：Code / Prompts / README / Params / Integration
¥1.9 或 Preview only
[Preview] [Get Package]
```

卡片需要展示的判断信息：

| 字段 | 规则 |
|---|---|
| Demo preview | 可直接操作；失败时显示真实错误，不换假图 |
| Type | interaction / animation / visual / image / workflow / chat / game |
| Stack | 最多 3 个真实技术栈标签 |
| Copy difficulty | easy / medium / advanced |
| Reuse value | 编辑判断，说明可复制场景，不冒充用户热度 |
| Asset count | 源码、Prompt、README、参数等真实数量 |
| Price | 只有已批准价格才显示金额；否则显示 Preview |
| CTA | `Preview` 与 `Get Package` 分工清楚；未具备资产时只能预览 |

原有 Blueprint Score 的五维市场评分不再用于普通 Demo 卡。普通模块改用：

- Visual Impact
- Reuse Value
- Build Effort
- AI Fit

完整 App Blueprint 可以继续保留 Market Demand、Revenue Potential 等高级评分。

## 9. Capability 详情与 Package 购买页

页面顺序：

1. 大型 Demo Preview（先让用户验证结果）
2. Capability 名称、问题、结果、分类、技术栈和难度
3. 明确的 `Get Capability Package` 购买卡
4. What you get：自研源码、Cursor/Claude Prompt、README、参数、Integration Guide
5. Code Preview：展示入口和结构，不冒充完整源码已公开
6. Prompt Preview：Cursor / Claude / AI generation 三个标签
7. Parameters：可修改参数、默认值、约束和示例
8. Integration Guide：安装、复制、接入和常见问题
9. Use Cases：可复制到哪些项目
10. Compatibility：React/Next/Tailwind 等要求
11. Limitations：不包含什么、哪些是演示代码
12. Related Capabilities 与 Bundle

### 购买卡

```text
图片取色 Capability Package
¥4.9
源码 + Cursor Prompt + Claude Prompt + README + Params + Integration Guide
[Get Capability Package]
```

本地预览期按钮可以写 `Get Capability Package (Preview)`，不显示假支付成功。

## 10. 购买后 My Library

购买后不是文件下载页，而是一个可快速复制能力的资产工作台：

```text
My Library
├─ 我的 Capability Package 卡片
├─ Open Demo Preview
├─ Copy Cursor Prompt
├─ Copy Claude Prompt
├─ Copy AI Generation Prompt
├─ View Self-owned Source
├─ README
├─ Parameters
└─ Download / Copy Package Assets
```

每个资产显示：版本、格式、复制按钮、下载按钮、更新日期和许可边界。

如果资产尚未真实交付，必须显示 `Preview only` 或 `Planned`，不能用勾号伪装成源码已包含。

## 11. Bundle 页面

Bundle 不重复写一套长 Blueprint，而是展示：

- 包含哪些 Capability Package
- 单独购买总价与 Bundle 价格（仅已批准价格）
- 每个模块的技术栈和难度
- 适合什么类型的项目
- 购买后统一 Library 入口

第一批 Bundle：

| Bundle | 包含方向 |
|---|---|
| Apple UI Pack | 玻璃拟态、Hover、卡片、转场、分享海报 |
| Game UI Pack | 抽卡、进度、奖励、地图和结果动画 |
| AI Agent Pack | AI Loading、流式输出、Prompt 工作流、引用和重试 |
| Landing Page Pack | Hero、Logo 云、定价、CTA、案例墙 |
| Animation Pack | 页面转场、数字滚动、磁吸、视差和粒子 |

## 12. ColorSnap 能力拆解

ColorSnap 不是一个只能整体展示的 Blueprint。它应拆成多个独立 Capability，每个 Capability 都拥有自己的 Demo Preview、Package 状态和可售边界；完整 ColorSnap Blueprint 只作为高级组合商品。

| Capability | 分类 | 作为独立商品的复用结果 | 当前状态 |
|---|---|---|---|
| Color Extraction | Image & Vision | 从图片提取主色、辅助色和渐变 | planned |
| Double-sided Flip Card | UI Interaction | 可翻转的前后卡片结构 | planned |
| Photo Scatter Motion | Motion & Animation | 图片散落、聚合和重排动效 | planned |
| Map Marker | Map | 地图 Marker、选中态和信息卡 | planned |
| Card Highlight | Visual Effects | 卡片跟随指针的高光和边缘反馈 | planned |
| Glass Surface | Visual Effects | 玻璃拟态背景、边框和模糊参数 | planned |
| Draw Card Animation | Game UI | 抽卡、翻牌、结果揭示动效 | planned |
| Ticket Share Poster | Image & Media | 生成可分享的票根/结果海报 | planned |
| Image Cropper | Image & Vision | 可配置裁剪框、比例和导出 | planned |
| Album Picker | UI Interaction | 图片选择、预览、排序和确认 | planned |
| Gradient Background | Visual Effects | 动态渐变和主题色参数 | planned |

这些条目在有自研实现、Prompt、README、参数和授权记录之前，只能显示为内部拆解或免费 Preview，不能显示购买按钮。数据关系使用 `blueprint_capabilities` 连接 ColorSnap Blueprint 与独立 Capability，不复制商品资产。

ColorSnap 的组合关系示例：

```text
album-picker → image-cropper → color-extraction → gradient-background
color-extraction → card-highlight / glass-surface
flip-card / photo-scatter / draw-card-animation = 独立动效 Package
ticket-share-poster = 消费图片或色板的分享 Package
map-marker = 可选通用扩展，不强行写入 ColorSnap 主流程
```

## 13. 高级 App Blueprint

App Blueprint 保留为独立商品类型：

- 不放在首页第一屏。
- 不与 Hover、取色、Loading 等低价模块共用卡片文案。
- 详情页可以保留产品拆解、PRD、商业模式、技术路线和 Build Timeline。
- ColorSnap Blueprint #001 迁移后归入 `App Blueprint` 类别，作为高级商品样品。

## 14. 最小商品数据模型

```text
capabilities
├─ id / slug / title / promise
├─ category / tags / stack / use_cases
├─ input_schema / output_schema / difficulty
├─ reuse_score / ai_fit_score / source_reference
└─ status: draft | preview | package_ready | retired

demo_previews
├─ id / capability_id / route / preview_url
├─ interaction_spec / is_primary
└─ status: ready | failed | planned

capability_packages
├─ id / capability_id / version
├─ price_status / price_minor / currency
├─ source_reimplementation_ref / rights_status
└─ status: draft | preview | sellable | retired

package_assets
├─ source_code
├─ cursor_prompt
├─ claude_prompt
├─ codex_prompt (后续)
├─ trae_prompt (后续)
├─ ai_generation_prompt
├─ readme
├─ parameters
└─ integration_guide

source_references
├─ capability_id / source_url / author / license
└─ derivative_note / redistribution_status

bundles + bundle_items
app_blueprints + blueprint_capabilities
library_items
```

每个商品通过 manifest 明确资产是否存在：

```json
{
  "source_code": { "status": "ready", "format": "source", "rights": "self_reimplemented" },
  "cursor_prompt": { "status": "ready", "format": "md" },
  "claude_prompt": { "status": "ready", "format": "md" },
  "ai_generation_prompt": { "status": "ready", "format": "md" },
  "readme": { "status": "ready", "format": "md" },
  "parameters": { "status": "ready", "format": "json" },
  "integration_guide": { "status": "ready", "format": "md" }
}
```

每个 Capability Package 必须能脱离 ColorSnap 单独讲清输入、输出和接入点。不要把旧 Blueprint 的七类资料字段直接当成所有 Package 字段。完整 App Blueprint 可以通过自己的扩展表保存 PRD、商业和技术资料。

## 15. 从当前代码迁移的顺序

这次先改信息架构，不立即接支付或会员。推荐后续 apply 顺序：

1. 把旧 `BlueprintProduct` 拆为 `Capability`、`DemoPreview`、`CapabilityPackage` 和 `LibraryItem`，保留 ColorSnap 的高级 Blueprint 关系。
2. 将首页和目录主路由从 Blueprint-first 切到搜索优先的 `/explore`，保留旧路径兼容跳转。
3. 先把 ColorSnap 的一个真实能力模块做成 MVP Package，不批量伪造 11 个商品。
4. 实现 Capability 详情页：先 Preview，再 Package 内容、Prompt、README、参数和 Integration Guide。
5. 购买后把资料库改名为 `My Library`，支持复制资产和查看版本。
6. 用本地模拟获取验证“搜索 → Preview → Package → Library”闭环，再单独规划真实支付。
7. 最后迁移 Bundle 和完整 App Blueprint，不把 Blueprint 重新放回首页主叙事。

## 16. 真实性与版权边界

- CodePen、Aceternity UI、Magic UI、ReactBits、Motion Primitives 是参考来源，不代表本站拥有其代码销售权。
- 每个可售 Package 必须记录代码来源、许可证、作者、素材权利、独立重实现说明和可再分发范围。
- “可复制”只说明本站交付包支持复制，不说明第三方项目允许任意商用。
- 没有自研源码、Prompt、README、参数、Integration Guide 或权利记录的 Capability 只能作为免费 Preview，不能显示购买按钮。
