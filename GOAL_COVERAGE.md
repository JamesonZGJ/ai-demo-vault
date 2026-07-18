# AI Product Blueprint Marketplace 完整目标验收矩阵

本文件保留最初 Blueprint 方案的完整目标验收矩阵，作为历史需求追踪。当前产品定义已由 `MARKETPLACE_IA.md` 更新为 AI Demo Marketplace：Capability Package 是主商品，DemoPreview 是免费预览，App Blueprint 是高级商品。`launch-curated-mvp` 归档只代表旧 Demo 基础层完成，不能把整个 Marketplace 写成已完成或已可交易。

## 当前事实

| 项目 | 当前证据 |
|---|---|
| 产品代码、数据库、生产部署 | 本地 MVP 与数据库已实现并通过全量验证；生产部署与公网证据为 0 |
| 产品信息架构 | 旧代码已 apply Blueprint 优先 IA；当前目标是搜索优先的 Capability Package IA，生产仍只开放免费 Demo，真实商城入口关闭 |
| 首发内容 | 12 项已在本地生产 migration 中达到发布门槛，覆盖 10 类、国内 4、海外 8；生产公开证据为 0 |
| 首批内容池 | 30 项内容池；其中 12 项本地公开就绪、18 项仍是候选，尚未部署生产 |
| 数据来源 | 22 个渠道已登记；自动候选导入和完整审核工作流尚未实现 |
| Blueprint | 本地 ColorSnap #001 预览商品、12 个公开区块、7 类资料样品和试用资料库已实现；生产可售商品为 0 |
| 订单、下载、会员、支付 | 0 |
| 五维评分、真实热度、社区 | ColorSnap #001 已有 Blueprint Score 与 Build Timeline 编辑估计；全库重算、真实热度和社区仍为 0 |

## 原始要求追踪

状态只允许：`specified`=已有完整 OpenSpec、`planned`=只有路线、`decision_required`=必须取得业务决定、`not_started`=尚无实现、`achieved`=已有生产证据。

| ID | 原始要求 | 交付归属 | 完成证据 | 当前状态 |
|---|---|---|---|---|
| G01 | AI Product Blueprint 交易平台；Blueprint 是可购买的复刻产品，Demo 是免费发现入口；服务独立开发者、产品经理、创业者、设计师和 AI 创作者 | `reframe-blueprint-marketplace-ia`、`launch-blueprint-001-sales`、`internationalize-marketplace` | 中英文生产首页、导航和 SEO 以 Blueprint 为主；Demo 保持公开；至少一个真实购买→权益→下载闭环可用 | `planned` |
| G02 | 每个 Demo 像创业案例，解释产品、成立原因、用户、功能、商业模式、AI 实现和二次创新 | `launch-curated-mvp` | 每个公开案例字段齐全，事实、编辑推断和假设可区分 | `specified` |
| G03 | 支持用户点名的 22 个国内外发现渠道 | `build-editorial-operations`、`connect-approved-discovery-sources` | 22 个渠道各有可执行人工或官方 API 流程、条款日期、运行记录、失败记录和审核日志 | `planned` |
| G04 | 首页展示今日精选、热门、最新和创业灵感榜 | MVP 先做透明栏目；`add-real-popularity` 后补真实热度 | 生产页面与真实数据测试；热度达到预设样本门槛才显示 | `planned` |
| G05 | 卡片展示图片、名称、分类、工具、难度、商业潜力和收藏数 | `launch-curated-mvp` | 生产卡片字段完整，未知工具不猜测，收藏来自真实关系表 | `specified` |
| G06 | 详情展示截图、视频/GIF和在线体验 | `launch-curated-mvp` | 每个公开案例至少一份获准使用的真实产品展示媒体；链接有核验时间；三档视口视觉验收通过 | `specified` |
| G07 | 创业改造覆盖用户、内容、场景和新方向 | `launch-curated-mvp` | 四个独立字段齐全，未经市场证明的内容标为假设 | `specified` |
| G08 | 第一批不超过 30 个，内容运营形成 100 个免费 Demo | `launch-curated-mvp`、`grow-catalog-to-100` | 分别查询证明 12、30、60、100 项实际公开；不是只存在候选记录；该内容流不阻塞 Blueprint #001 | `planned` |
| G09 | 覆盖 10 个优先 AI 应用方向 | `launch-curated-mvp`、`grow-catalog-to-100` | 10 类均有通过同一发布门槛的公开案例 | `specified` |
| G10 | 用户系统、登录和收藏 | `launch-curated-mvp` | 真实邮件确认、登录、跨用户隔离和收藏持久化线上通过 | `specified` |
| G11 | 免费基础拆解用于 SEO 与社媒获客 | `launch-curated-mvp`、`grow-catalog-to-100` | 公开页面可索引；自然来源可见；连续内容分发记录不伪造效果 | `planned` |
| G12 | 黑白极简、科技感、大图卡片，参考 Linear、Product Hunt、Vercel但不复制 | `launch-curated-mvp` | 360/768/1440px 视觉与无障碍验收；原创 Token 和结构可追溯 | `specified` |
| G13 | Blueprint 有独立商品目录与详情；最终 20 个包均包含 Prompt、PRD、UI、Figma、HTML、React、数据结构和售卖设计 | `reframe-blueprint-marketplace-ia`、`simulate-colorsnap-preview-acquisition`、`define-blueprint-package-standard`、`prepare-blueprints-002-to-020` | 本地商品页已展示 12 个决策区块和 7 类资料样品；最终仍需 20 个 `sellable` 包逐包可打开/构建、带哈希和权利清单 | `planned` |
| G14 | 单品购买价格假设 USD 19–39 | `validate-blueprint-demand`、`define-commerce-offers`、`launch-single-blueprint-sales` | 每个商品有已批准的精确价格、币种、权益、许可和退款规则；真实成交与订单快照一致 | `decision_required` |
| G15 | AI Builder Pass 价格假设 USD 9.9/月 | `define-commerce-offers`、`launch-builder-pass` | 免费目录保持公开；付费深度内容、包更新、续费、取消、失败和到期规则全部线上通过 | `decision_required` |
| G16 | Pro 创业版价格假设 USD 199，含源码、一次咨询和定制方向 | `define-commerce-offers`、`launch-pro-service` | 明确一次性/周期、源码范围、咨询时长和交付形式；一次权益只能消费一次 | `decision_required` |
| G17 | 结账、订单、支付确认、购买后资料库、私有下载和会员权限 | `reframe-blueprint-marketplace-ia`、`complete-account-and-legal-baseline`、`add-commerce-entitlements`、`add-primary-payment-provider` | 精确价格订单快照与服务端验签一致；成功跳转页不授权；未授权用户无法从页面、接口或存储绕过；订单、退款、订阅、权益、下载和对账可追溯 | `planned` |
| G18 | Stripe、支付宝、微信支付 | `add-primary-payment-provider`、`add-payment-provider-coverage` | 三类生产商户启用；真实最小金额交易、验签、幂等、退款和逐币种对账通过 | `decision_required` |
| G19 | 面向全球用户 | `internationalize-marketplace` | 中英文目录、详情、商品、结账、邮件和社区均有翻译审核、canonical 与 hreflang | `planned` |
| G20 | 创新性、商业价值、开发难度、市场竞争、复刻价值五维评分和 AI 创业榜 | `add-five-dimension-ranking` | 量表、证据、权重、公式、版本、门槛、并列和全库重算均可验证 | `planned` |
| G21 | 热门 AI 产品 | `add-real-popularity` | 版本化公式、时间窗、最低样本、反滥用和异常处理通过真实数据测试 | `planned` |
| G22 | AI 创业社区 | `launch-community` | 投稿、评论、创作者主页、授权声明、审核、举报、封禁、申诉和删除闭环通过 | `planned` |
| G23 | 自有案例 Blueprint #001 | `inventory-own-blueprints`、`prepare-own-blueprint-001`、`simulate-colorsnap-preview-acquisition`、`pilot-blueprint-001-commerce` | 本地已有明确非 AI 边界、可运行 Demo、12 区块和 7 类编辑样品；仍缺名称/素材权利、完整可售包和一次真实交易闭环 | `planned` |
| G24 | 既有游戏、AI 动画和 UI 改造沉淀为资产 | `inventory-own-blueprints` | 逐文件位置、功能真实性、权利、隐私和可售范围清单 | `planned` |
| G25 | 不售卖普通链接或第三方未授权资产；Demo 与 Blueprint 显式分开 | 全阶段发布与售卖门禁 | 每个公开/可售文件有来源、权利状态和审核记录；第三方灵感显示原创复刻声明；闭源第三方源码、品牌素材和密钥扫描为零 | `planned` |

## 不能替代完成证据的内容

| 弱证据 | 为什么不能证明完整目标 |
|---|---|
| 候选数量 | 候选不等于公开、合规、可复刻案例 |
| 本地构建通过 | 不能证明生产登录、支付、邮件、回调和下载权限 |
| 沙箱支付 | 不能证明商户生产能力、真实到账、退款和对账 |
| 一个 Blueprint 可用 | 不能证明 20 个包均完整可售 |
| 海外案例 | 不等于英文界面和全球用户流程 |
| 收藏最多 | 不等于有时间窗、样本门槛和反滥用的真实热度 |
| 第三方公开链接 | 不等于允许本站复制、打包或转售 |

## 完整目标完成条件

只有同时满足以下条件，才允许把线程目标标为完成：

1. 本表 G01–G25 全部有生产或逐项交付证据，不再存在 `planned`、`decision_required` 或 `not_started`。
2. 所有后续 OpenSpec change 均完成 propose、确认、apply、验证和 archive。
3. 生产站、100 个公开案例、20 个可售 Blueprint、三类支付、五维榜单、社区和 Blueprint #001 都通过各自全范围验收。
4. `pnpm verify`、数据库权限测试、生产冒烟、真实支付/退款/对账和逐包全新环境复刻全部通过。
5. `CONTEXT.md`、`README.md`、`ARCHITECTURE.md` 与真实线上状态一致，不把计划或候选写成已交付。
