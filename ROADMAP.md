# 完整产品路线

当前 `launch-curated-mvp` 的免费 Demo 基础层已在本地实现并验证，生产未完成，也不代表目标产品完成。用户已把产品中心调整为 AI Demo Marketplace：`Capability` 是能力定义，`DemoPreview` 是免费预览，`CapabilityPackage` 是主商品，Bundle 是组合商品，完整 App Blueprint 是高级商品。后续先验证一个低价能力模块的展示、资产交付和复制路径；ColorSnap 作为高级组合商品保留，内容增长并行进行。

Launch Version 当前只承担公开演示：Capability 搜索、Preview、Package 状态、My Library 空状态、基础 SEO 和移动端。真实支付、会员、评论、排行榜、推荐和复杂后台不属于本阶段。

## 阶段与验收

| 阶段 | 目标 | 主要交付 | 完成证据 |
|---|---|---|---|
| 0. Demo Foundation | 保留可信免费发现层 | 12 个公开案例、目录、详情、账号、收藏、SEO 和匿名聚合统计 | 当前本地实现通过；生产证据仍待完成 |
| 1. Capability Marketplace IA & Product Model | 把可复用能力模块变成产品中心 | 搜索优先 `/explore`、Capability 详情、DemoPreview、Package 资产清单、My Library、Bundle/App Blueprint 分层 | 页面主次、对象边界和资产状态明确；精确价格、许可和退款由 `define-commerce-offers` 决定 |
| 2. Capability Package #001 | 完成一个可售能力模块 | 在线 DemoPreview、自研源码、Cursor/Claude/AI Prompt、README、参数、Integration Guide、版本、哈希、复制验证和客户许可 | 从实际包可复制；全部模块资产 `approved_for_sale` |
| 3. Transaction Foundation | 建立购买后权利和私有交付 | 账号法律基线、订单快照、权益、资料库、私有下载、退款和审计 | 未购买者无法绕过；退款后未来访问正确撤销 |
| 4. Primary Payment Pilot | 证明真实成交 | 一个支付商、一个币种、生产验签、幂等、乱序、退款和对账 | #001 完成真实购买→权益→下载→退款→对账后才公开商城 |
| 5. Membership & Pro | 在单品成立后增加持续权益与服务 | Builder Pass 全生命周期、定量领取或会员价、Pro 一次咨询 | 会员全状态 E2E；Pro 权益只能消费一次；连续更新承诺有证据 |
| 6. Global Scale | 扩到模块、Bundle 和完整 App 商品 | Capability Package 批量、Apple/Game/AI Agent 等 Bundle、ColorSnap 及更多 App Blueprint、中英文商品与结账、Stripe/支付宝/微信 | 每个商品逐包验收；中英文 SEO 正确；三类生产支付与退款通过 |
| 7. Ranking & Community | 建立反馈与内容网络效应 | 五维评分、真实热度、AI 创业榜、投稿、评论和创作者主页 | 全库评分可重算；热度达到样本门槛；社区治理闭环通过 |
| Parallel. Editorial Growth | 扩大免费获客与信任资产 | 编辑工作台、22 渠道、12→30→60→100 | 100 项实际公开且逐项通过来源、主体、媒体和权利门槛；不阻塞 #001 |

## 后续 OpenSpec change 队列

后续能力不得混入当前 `launch-curated-mvp`。每一项必须单独完成 proposal、design、行为 spec、tasks、确认、apply、生产验证和 archive。编号表示当前执行优先级；编辑内容流标为并行，不再排在交易能力之前。

| 优先级 | Change ID | 依赖 | 交付与完成门槛 |
|---:|---|---|---|
| 1 | `reframe-demo-marketplace-ia` | Demo foundation | Capability Package 优先定位、搜索页面树、模块详情、资产包、Bundle/App Blueprint 分层与公开商城闸门 |
| 1a | `simulate-demo-product-preview-acquisition` | `reframe-demo-marketplace-ia` | 一个能力模块的本地商品页、Prompt/源码/README/参数样品、模拟获取和本人资料库；不代表真实交易 |
| 2 | `validate-blueprint-demand` | 1 | 预先写明商品信号、样本、观察期和继续阈值；未达到阈值不生产其余 19 个包 |
| 3 | `inventory-own-blueprints` | 可与 2 并行 | 盘点 ColorSnap、游戏、AI 动画和 UI 改造的源码、真实性、素材、隐私、许可和可售范围 |
| 4 | `define-commerce-offers` | 1–3 | 明确免费/单品/Builder Pass/Pro 边界、精确价格、更新、支持、退款和客户许可 |
| 5 | `define-blueprint-package-standard` | 3–4 | 固定八类交付物、清单、版本、SHA-256、构建/导入验证、权利和密钥扫描 |
| 6 | `prepare-own-blueprint-001` | 3–5 | ColorSnap 保留为高级 App Blueprint；完成想法→UI→Demo→商业化与可复刻包 |
| 7 | `complete-account-and-legal-baseline` | 4 | 账号恢复/删除、服务条款、隐私、客户许可、退款、税费/收据和结账接受记录 |
| 8 | `add-commerce-entitlements` | 5、7 | 订单快照、退款、权益、资料库、私有文件、短期授权下载和审计 |
| 9 | `add-primary-payment-provider` | 4、7–8 | 经用户决定选择第一支付商；生产验签、金额币种、幂等、乱序、退款与对账 |
| 10 | `pilot-blueprint-001-commerce` | 6、8–9 | #001 小范围生产购买→授权→下载→退款/撤权→对账闭环 |
| 11 | `launch-blueprint-001-sales` | 10 | 公共站只开放已验证的 #001；商品、许可、价格和订单快照一致 |
| 并行 A | `build-editorial-operations` | Demo foundation | 受控编辑、候选队列、审批、拒绝、去重和 90 天复核 |
| 并行 B | `connect-approved-discovery-sources` | A | 22 个渠道的人工手册或官方 API 适配器；保存条款和审核日志 |
| 并行 C | `grow-catalog-to-100` | A–B | 12→30→60→100；100 项实际公开并逐项通过内容和媒体门槛 |
| 12 | `prepare-blueprints-002-to-020` | 5、10 | 复制已验证流程；20 个包逐项八类齐全、可构建、可导入、权利通过 |
| 13 | `internationalize-marketplace` | 7–12 | 中英文目录、商品、结账、邮件、翻译审核、canonical 与 hreflang |
| 14 | `add-payment-provider-coverage` | 9、13 | 补齐 Stripe、支付宝、微信；真实交易、退款和逐币种对账 |
| 15 | `launch-single-blueprint-sales` | 12–14 | 面向用户开放 20 个单品；每项精确价格、许可、退款和下载一致 |
| 16 | `launch-builder-pass` | 8、10、14–15 | 续费、取消、失败、宽限、到期、恢复和领取/更新规则通过 |
| 17 | `launch-pro-service` | 8、10、14–15 | 一次性/周期、咨询时长、预约、改期、交付和一次消费明确 |
| 18 | `add-five-dimension-ranking` | 并行 C | 五维量表、证据、权重、公式、版本、门槛、并列和全库重算 |
| 19 | `add-real-popularity` | 并行 C | 时间窗、最低样本、反滥用、异常处理和可解释公式 |
| 20 | `launch-community` | 13、18–19 | 双语投稿、评论、创作者主页、审核、举报、封禁、申诉和删除闭环 |

## 并行内容节奏

数量是上限目标，发布门槛优先；未通过来源和素材检查时允许少发，不允许用低质量或未授权内容补数。

| 周期 | 累计目标 | 重点 |
|---|---:|---|
| 上线日 | 12 | 覆盖 10 个优先方向，至少含中国大陆与海外官方来源 |
| 第 2 周 | 30 | 候选池已准备；仍需验证编辑模板、搜索入口和原创封面产能后逐项发布 |
| 第 3 周 | 60 | 扩展国内平台与海外模板来源，清理重复案例 |
| 第 4 周 | 100 | 完成首月免费数据库目标和 90 天复核队列 |

每周至少把一个案例改写成可独立阅读的社媒内容，链接回唯一详情页。该内容流与 Blueprint #001 并行，不作为成交前置。社媒点赞、平台榜单和 GitHub stars 只作为发现信号，永不写入本站收藏或热度。

## 阶段指标

| 阶段 | 只看这些可核验信号 | 不作出的结论 |
|---|---|---|
| Curated MVP | 已发布合格案例数、可索引 URL、匿名页面访问、来源、真实收藏 | 页面访问不等于留存，收藏不等于付费意愿 |
| Free Library | 新增合格案例速度、失效链接率、搜索落地页、自然来源、收藏案例分布 | 不用内容总数掩盖来源或授权缺口 |
| Blueprint | 商品页访问、明确购买、退款、合法下载和包版本 | 不用“点击购买”冒充成交 |
| Membership | 真实订阅、续费、取消和权益使用 | 不用注册量冒充订阅价值 |
| Community | 合格投稿、审核时长、举报和处理结果 | 不用评论数量冒充内容质量 |

## Blueprint 商业化假设

以下价格来自原始构想，进入支付开发前必须先用需求数据验证，不视为已经成立的定价。商品、订单、权益、下载、支付和退款共同遵守 `COMMERCE_SPEC.md`。

| 模式 | 假设价格 | 权益 |
|---|---:|---|
| 单品 | USD 19–39 | 单个 Blueprint 完整资料包 |
| AI Builder Pass | USD 9.9/月 | 免费 Demo 目录继续公开；会员假设提供深度商业分析、可售 Blueprint、Prompt 更新和每周新增 |
| Pro 创业版 | USD 199 | 仅限本站拥有或获准再分发的源码、一次咨询和定制修改方向；一次性/周期尚待确认 |

每个可售 Blueprint 必须包含 Prompt、PRD、UI 设计稿、Figma 文件、HTML Demo、React 代码、数据结构和售卖模式，并附版本号、文件清单、SHA-256、构建结果、依赖与素材许可清单。第三方闭源产品只允许出售原创拆解与自行实现的代码，不能打包第三方源码或未授权素材。“全部源码”只指本站拥有或明确获准再分发的源码。

自有资产先进入盘点队列：ColorSnap、既有游戏、AI 动画和 UI 改造作品。每项都要能回答“文件在哪里、哪些功能真实可运行、哪些是模拟、素材归谁、能否公开、能否售卖”，通过后才升级为 Blueprint。

## 数据来源路线

| 来源组 | 入口 | MVP | Free Library 后续 |
|---|---|---|---|
| 国内代码与社区 | GitHub 中文项目、Gitee、CSDN、掘金 | 人工发现，回到官方仓库核验 | 来源注册表、采编队列、去重；只有官方 API/许可允许时才自动接入 |
| 国内 AI 平台 | 即梦、可灵、豆包、Trae、百度 AI、阿里云百炼、腾讯云 AI | 人工收录官方案例 | 按平台条款建立连接器或人工导入模板 |
| 海外产品与代码 | Product Hunt、GitHub Trending、Hugging Face Spaces | 人工发现和官方来源核验 | 定时发现任务，人工审核后发布 |
| 海外模板与设计 | Lovable、Vercel、Framer、Figma Community、Cursor、Replit、Bolt、v0 | 只做分类与展示参考 | 保存来源与许可，不复制或转售第三方模板 |

任何自动化都只能创建候选项，不能绕过人工事实、授权和发布审核。

## 完整要求追踪

以下是阶段摘要；逐条原始要求、证据和完整完成条件以 `GOAL_COVERAGE.md` 为准。

| 原始要求 | 当前状态 | 计划归属 |
|---|---|---|
| AI Demo Marketplace；CapabilityPackage 为主商品 | 信息架构已重新定义；代码仍是旧 Blueprint-first MVP，真实商品与交易后置 | 阶段 1 / `reframe-demo-marketplace-ia` |
| 国内外 AI Demo 免费发现库 | 进行中 | 阶段 0 / 并行内容流 |
| 今日精选、最新上传、创业灵感榜 | 本地已实现并验证，生产未完成 | 阶段 0 |
| 热门 AI 产品 | MVP 只显示透明的 Popular shelf，不伪造销量；真实热度后置 | `add-real-popularity` |
| 卡片、详情与创业改造 | 本地已实现并验证，生产未完成 | 阶段 0 |
| 登录与收藏 | 本地已实现并验证，生产未完成 | 阶段 0 |
| 第一批不超过 30 个 | 已落实为 12 个首发 | 阶段 0 |
| 内容目标 100 个 | 已拆为 12→30→60→100；尚未实施且不阻塞 #001 | 并行内容流 / `grow-catalog-to-100` |
| Capability Package 商品目录与详情 | 目标搜索优先 `/explore` 与 Capability 详情已定义，代码迁移后置；ColorSnap 保留为次级 App Blueprint 组合商品 | 阶段 1 |
| 全球用户与海外支付 | 尚未实施 | 阶段 6 |
| AI 开发包 | 目标模块商品包含自研源码、Cursor/Claude/AI Prompt、README、参数、Integration Guide；真实文件交付后置 | 阶段 2 |
| 单品、会员、Pro 权益 | 尚未实施 | 阶段 4–6 |
| 购买、下载、会员权限 | 仅本地模拟获取与样品下载；真实权益后置 | 阶段 3–5 |
| Stripe、支付宝、微信支付 | 尚未实施 | 阶段 4、6 |
| 五维评分与创业排行榜 | ColorSnap 五维 Blueprint Score 已落地；真实排行榜后置 | 阶段 7 |
| AI 创业社区 | 按要求后置 | 阶段 7 |
| ColorSnap Blueprint #001 | 本地预发布商品 MVP 完成；真实价格、许可和交易待验证 | `inventory-own-blueprints`、`prepare-own-blueprint-001`、`pilot-blueprint-001-commerce` |
| 既有游戏、AI 动画、UI 改造资产 | 尚未盘点 | `inventory-own-blueprints` |
