# AI Build Blocks Marketplace

这是一个以 **Build Block Package（能力模块包）**为中心的 AI Build Blocks Marketplace。用户搜索一个 Hover、动画、取色、AI 状态或 Prompt 工作流，先在线体验 Demo Preview，再获取自研源码、Cursor/Claude Prompt、README、参数、License 和 Integration Guide。完整 App Blueprint 保留为高级商品类型，不再主导首页。

产品边界：`Build Block = 能力定义`，`Demo Preview = 免费预览`，`Build Block Package = 独立能力模块商品`，`Bundle = 模块组合商品`，`App Blueprint = 完整产品高级商品`，`Library Item = 用户已获取的版本化资产`。首阶段只做本站自营精选商品，不做第三方卖家、分账或提现。

当前状态：**Launch Version 已完成公开演示闭环。** 首页和 `/explore` 已围绕 Build Block 搜索、Preview、Mock Price 和 Package 状态组织；Color Extraction 的自研 Package 资产已加入仓库。旧 `/demos` 与 Blueprint 路由保留兼容。真实支付、订单、会员和生产下载均未开放。

## 最新产品决定

- 首页默认入口改为搜索优先的 Build Blocks Marketplace，优先发现一个个可复制能力模块。
- 首页转化原则是首屏只有搜索这一个核心动作；分类用于检索，Featured/New 用于建立内容可信度，Bundle/Blueprint 只作为组合层入口。
- Demo 永远只是免费 Preview；Build Block Package 才是商品和价格的承载对象。
- 单个模块主价格带为 ¥1.9–9.9；Bundle 后续单独设计。
- Build Block 详情页展示在线 Demo、Mock Price、Package Included 清单、Cursor Prompt、Claude Prompt、README、参数、License 和 Integration Guide。
- ColorSnap Blueprint #001 拆为多个独立 Capability，完整 Blueprint 只作为高级组合商品。
- 本轮先改信息架构，不新增第二个商品，不接支付、会员或后台。
- Launch Version 只保证可信展示、搜索、Preview、商品化详情、Mock Price、Library 空状态、SEO 和移动端；支付、会员、评论、排行榜、推荐和复杂后台延期。

## Launch Version 已实现

- 搜索优先首页：Popular Searches、UI/Animation/AI/Image 等开发者分类、Featured/Newest/Free/Popular Build Blocks、Why Build Blocks、Bundle 和最后的 Blueprint 入口。
- Build Block 目录与详情：在线 Preview、用途、问题、技术栈、源码状态、Mock Price、Included 清单、Prompt、README、参数、License、Integration Guide 和真实 Package 状态。
- Color Extraction 与 Glass Surface 已具备完整的自研 Package 资产；本系列第001期指定为 Glass Surface（展示名“玻璃拟态卡片”），支付、订单、下载仍关闭。
- My Library 空状态、Bundles、About、License、Copyright、Privacy、404、favicon、Open Graph、sitemap、robots 和移动端布局已具备。
- 旧 `/demos`、账号、收藏和 Blueprint 路由保留为兼容或本地预览，不作为 Launch 首页主路径。
- 《每天拆一个 AI 产品》第001期已完成：Build Block #001“玻璃拟态卡片”包含在线交互预览、自研源码、Cursor/Claude Prompt、README、参数、接入说明和 License；视频、字幕、封面与三平台文案位于 `video/ai-demo-vault-intro/episodes/001-glass-card`。

当前代码尚未实现真实支付、订单、客户权益、付费下载、会员、自动爬虫、管理后台、用户评论和社区。页面不会伪造购买成功、下载完成、拥有源码或真实热度；Mock Price 和统计均明确标注。新的 Build Block 商品结构见 `MARKETPLACE_IA.md`；未来商品、支付、权益和交付遵守 `COMMERCE_SPEC.md`。

## 当前本地闭环与目标交易结构

```text
当前本地：Landing → Search Build Blocks → Demo Preview → Build Block 商品详情 → Mock Price / Get Block（未连接）→ Library 空状态
目标生产：搜索 Build Block → Demo Preview → Build Block Package 详情 → 精确价格结账 → 支付确认 → 订单与权益 → My Library → 私有资产 → 退款与对账
兼容预览：免费 Demo → App Blueprint 详情 → 本地不扣款试用（仅 local）
```

模拟闭环只验证信息架构和获取路径，不能作为成交证据。公共商城上线前，仍须用一个自营 Capability Package、一个固定版本、一个精确价格、一个币种和一个支付商跑通真实购买、授权、交付、退款和对账。

## 技术架构

- Next.js 16、React 19、TypeScript。
- Tailwind CSS 4、自有轻量组件、Lucide。
- Supabase Postgres、Auth、RLS。
- Vercel 部署。
- Vercel Web Analytics，只统计公开页面的匿名聚合访问与来源。
- Vitest、Playwright、pgTAP 验证。

详细职责与调用关系见 `ARCHITECTURE.md`；目标商品信息架构见 `MARKETPLACE_IA.md`；日常内容生产 SOP 见 `CONTENT_PIPELINE.md`；Launch 交付门槛见 `LAUNCH_CHECKLIST.md`；当前免费基础层页面见 `UI_SPEC.md`；首发证据见 `LAUNCH_CONTENT.md`；发现渠道见 `SOURCE_REGISTRY.md`；内容发布门槛见 `EDITORIAL_GUIDE.md`；完整路线见 `ROADMAP.md`；逐项终局验收见 `GOAL_COVERAGE.md`；商品、订单、权益、下载和支付共同遵守 `COMMERCE_SPEC.md`。产品介绍视频工程见 `video/ai-demo-vault-intro/README.md`。

## 本地运行方法

需要 Node.js 20.9+、pnpm 11 和可运行 Docker 的 Supabase CLI。首次运行：

```powershell
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
Copy-Item .env.example .env.local
pnpm exec supabase start
pnpm exec supabase db reset
pnpm dev
```

要查看 ColorSnap 商品闭环，`.env.local` 必须显式设置 `APP_DEPLOYMENT_TIER=local`，并把 `supabase status` 输出中的本地 Publishable Key 写入对应公开变量。不要把 Service Role Key 放入任何 `NEXT_PUBLIC_*` 变量。`pnpm verify` 与 `pnpm build:local` 会从 Supabase Local 读取公开 URL、密钥和 Mailpit URL，并只对子进程注入 `APP_DEPLOYMENT_TIER=local`。数据库重置会依次执行基础目录、12 条首发内容和 ColorSnap Blueprint 本地试用 seed。

## 部署方法

在正式 Supabase 尚未配置时，可先用 Vercel Preview 模式公开演示：缺少 Supabase URL 或 Publishable/Anon Key 时会自动进入只读 Mock Mode，Demo、Capability 和 Package 页面使用仓库内静态数据；`APP_DEPLOYMENT_TIER=preview` 只是可选的显式标记。Vercel 自动提供的 `VERCEL_URL` 会作为站点 origin，不需要把本地 Supabase 地址填入公网环境。该模式不开放账号、收藏、Blueprint 试用、支付、订单或下载。

使用 Vercel + 独立生产 Supabase。Web 运行时只配置 Supabase URL 和 Publishable Key，不放 Service Role Key。数据库迁移凭据只用于受控部署流程，不进入客户端、运行日志或仓库。上线前必须先建立干净提交并通过本地验证，再迁移和只读验收生产数据库；生产内容就绪后，设置完整 commit SHA 与 20 位 Supabase Project Ref，再运行 `pnpm release:preflight`。预检输出的 `RELEASE_PREFLIGHT_EVIDENCE` 必须原样进入发布记录；部署固定使用 `vercel@56.2.1`，不使用 `@latest`。自有 SMTP、精确回调白名单、唯一 canonical origin、生产统计排除和回滚步骤见 `DEPLOYMENT.md`。

## 测试方法

不依赖 Docker 的本地校验：

```powershell
pnpm test:seed
pnpm test:db:portable
pnpm lint
pnpm typecheck
pnpm test:unit
```

Supabase Local、Postgres 和 Mailpit 启动后运行完整验证：

```powershell
pnpm verify
```

第一次验证或 migration/seed 变化后，必须先明确执行 `pnpm exec supabase db reset`；该操作会清空 Supabase Local 数据，因此 `pnpm verify` 不会暗中代替你执行。Launch Version 已通过 142 个单元测试、3 条 Launch E2E（Chrome）、代码检查、类型检查和无 Supabase Mock Mode 43 个路由构建；旧数据库契约仍通过 148 项便携 pgTAP、161 项正式 pgTAP。浏览器进程不会收到 Service Role Key。未安装 Playwright Chromium 时，可设置 `$env:PLAYWRIGHT_CHANNEL='chrome'` 使用本机 Chrome。便携 pgTAP 只是快速前置检查，正式结果以 Supabase Local PostgreSQL 为准。

部署后只读验收使用：

```powershell
$env:PRODUCTION_BASE_URL='https://你的生产域名'
$env:EXPECTED_SUPABASE_PROJECT_REF='<PROJECT_REF>'
$env:PRODUCTION_SUPABASE_URL='https://<PROJECT_REF>.supabase.co'
$env:PRODUCTION_SUPABASE_PUBLISHABLE_KEY='生产公开密钥'
pnpm test:production:db
pnpm test:production:public
```

未安装 Playwright Chromium、但本机已有 Chrome 时，可在公网测试前设置 `$env:PLAYWRIGHT_CHANNEL='chrome'`；这只选择浏览器，不改变生产 URL 或数据库验收范围。

## 搜索记录

2026-07-16 已完成新项目搜索，后续相同问题无需重复搜索：

- [Next.js 官方 Supabase 示例](https://github.com/vercel/next.js/tree/canary/examples/with-supabase)：作为脚手架来源。
- [Supabase Next.js Auth 文档](https://supabase.com/docs/guides/auth/quickstarts/nextjs)：采用官方 SSR Auth 和 RLS 路径。
- [Vercel AI Templates](https://vercel.com/templates?type=ai)：用于确认案例来源与模板分类，不复制其代码或页面。
- [Lovable Templates](https://lovable.dev/templates)：参考 Apps、SaaS、Internal Tools 等分类方式。
- [Framer AI Marketplace](https://www.framer.com/marketplace/templates/category/ai/)：仅参考视觉呈现和商业展示。
- [Product Hunt AI](https://www.producthunt.com/topics/artificial-intelligence)：作为后续人工选题入口，不抓取虚假热度。
- [Hugging Face Spaces](https://huggingface.co/spaces)：作为可体验 AI Demo 来源。
- [v0 AI Templates](https://v0.app/templates/top/ai)：参考模板卡片字段和分类。
- [Vercel Web Analytics 隐私说明](https://vercel.com/docs/analytics/privacy-policy)：用于公开页面的匿名聚合访问与来源统计；不采集可跨站识别用户的标识，不统计账号与收藏私有页面。
- [Supabase Postgres Best Practices](https://www.skills.sh/supabase/agent-skills/supabase-postgres-best-practices)、[Vercel React Best Practices](https://www.skills.sh/vercel-labs/agent-skills/react-best-practices)、[Frontend Design](https://www.skills.sh/anthropics/skills/frontend-design)：已核对，未安装。
- [Supabase `db push`](https://supabase.com/docs/reference/cli/supabase-db-push) 与 [CLI migration 批次实现](https://github.com/supabase/cli/blob/pkg/v1.2.3/pkg/migration/file.go#L799-L874)：生产默认应用版本化 migration；首发内容不依赖 `--include-seed`，数据 migration 不写显式 `COMMIT`，保证内容与迁移历史同一事务。
- [Supabase CLI 项目链接](https://supabase.com/docs/reference/cli/supabase-projects)：生产 `project-ref` 由 Dashboard/CLI 提供；本站发布闸门再把它与 `<ref>.supabase.co` 精确绑定，防止验错项目。
- [Vercel Git 部署](https://vercel.com/docs/git)、[Vercel CLI 部署](https://vercel.com/docs/cli/deploy) 与 [系统环境变量](https://vercel.com/docs/environment-variables/system-environment-variables)：发布使用固定 CLI、干净完整 commit 和 deployment metadata，记录 Vercel Deployment/commit 后再做公网验收。
- [Next.js 16 Image](https://nextjs.org/docs/app/api-reference/components/image)：真实产品首屏图使用 `loading="eager"`，其余图片保持原生懒加载；三栏目录首行三张图立即加载，不用内容去重改变各栏目真实排序。
- [OpenSpec](https://github.com/Fission-AI/OpenSpec)：固定使用 1.6.0；上一次增量已通过 strict，本轮最终数据库/发布合同增量需在用户允许执行固定第三方包后复验。
- 首发内容只使用官方仓库、官网、帮助中心、发布稿和法律条款。为取得可审计的真实产品媒体并降低闭源素材权利风险，最终首发用 CogVideoX、PPTAgent、Open Notebook、Postiz、OpenGame、MaxKB 替换 Wan2.2、Gamma、NotebookLM、Jasper、Rosebud AI、Chatwoot Captain；替换依据记录在 `LAUNCH_CONTENT.md`。
- 2026-07-16 第二批已核验 18 个官方候选，并检查用户点名的 22 个发现渠道、官方 API 与条款。结论：GitHub、Hugging Face 可作为后续官方 API 候选，Gitee 条件接入，Product Hunt 需商业授权，其余先人工发现与一手来源二验；完整记录见 `CONTENT_BACKLOG.md` 和 `SOURCE_REGISTRY.md`，后续不重复搜索同一接入问题。
- 2026-07-16 已用官方法律页、官方组织/个人页和仓库逐项补齐 12 个首发案例的发布主体、角色和地区证据；个人创建者不包装成公司，完整记录见 `LAUNCH_CONTENT.md`。

## 已完成

- Build Blocks Marketplace 视觉与信息架构：首页 Hero、单一搜索 CTA、Popular Searches、6 个核心分类、Featured/New、商品卡片 Included/Preview Price、商品详情 Get Block、Bundles、Blueprints、Library 已改为 Marketplace-first。
- ColorSnap Blueprint #001 本地商品闭环：免费 Demo、商品目录/详情、12 个决策区块、Market Opportunity、评分、Build Timeline、What's Included、模拟获取、Launch Dashboard 和样品导出。
- 生产双闸门：应用非 `local` 时路由关闭；数据库 migration 默认关闭试用且不写入商品数据。
- RLS 与 RPC：匿名只能读取本地开放的商品摘要；资料和访问权仅本人可读；客户端不能直接写访问权。
- Next.js 公开首页、案例库、详情页、隐私页、SEO、响应式布局和只限公开路径的匿名分析。
- Supabase 表结构、发布门禁、RLS、静态参数化搜索、显式收藏与并发计数。
- 邮箱注册、确认、登录、退出、安全站内回跳和个人收藏页。
- 12 项首发案例：覆盖 10 个方向、国内 4 项、海外 8 项；每项有 11 个主要主张、显式源码状态、四项创业改造、编辑判断、官方证据、原创封面和真实产品预览。
- 24 份主素材及 1 份 GIF 静态海报的权属、来源和 SHA-256 清单；GIF 默认海报优先，用户主动播放后才加载动画。
- 12 条首发内容已进入版本化生产数据 migration；`db push` 不依赖生产 seed，migration 与本地 seed 由测试逐字对齐。
- 本地静态图片使用响应式优化地址；大封面不再在移动端直接下载原始 PNG。
- 可重复的 PGlite 数据 migration/seed 校验；指纹未变化时关系 UUID、`created_at` 和案例更新时间均保持不变。
- Supabase Local migration/seed、148 项便携 pgTAP、161 项正式 pgTAP、数据库 lint、代码检查、类型检查、134 个单元测试、12 条真实浏览器 E2E（含 Launch Dashboard 与样品下载）和 27 页生产构建已通过。
- 生产发布前置检查、版本化 schema contract、只读生产数据库校验和公网公开页/SEO 冒烟脚本已落地；生产环境变量按 HTTPS、公开密钥格式和无客户端密钥泄漏规则失败即停。
- 第二批 18 项官方候选与 22 个命名来源渠道注册表；合计形成 30 项内容池，但没有把候选写成已发布案例。
- ColorSnap 自有原型的功能、真实性、版权和隐私审计。
- MVP UI、内容编辑、媒体、隐私统计与完整商业路线规范。
- 原始完整目标 G01–G25 验收矩阵、后续 change 的依赖顺序和统一商业化基础契约。

## 待办

- 用户验收本地 ColorSnap Blueprint #001 闭环后归档对应 OpenSpec change；OpenSpec strict 仍等待允许执行固定第三方 CLI。
- 把 #001 从七类编辑样品升级为可售资料包：完成逐文件清单、权利、版本、精确 Offer/Price、客户许可和真实交付验证。
- 实现订单、支付确认、权益、资料库、私有下载、退款和对账；先跑通一个真实单品，再分别上线会员与 Pro。
- 为已初始化的独立 Git 仓库创建首个不可变提交，再创建生产 Supabase 与 Vercel，配置自有 SMTP、精确回调白名单和唯一生产域名。
- 完成公网 Auth、收藏、RLS、SEO、分析排除、密钥和回滚冒烟。
- 按 `CONTENT_BACKLOG.md` 并行推进第二批拆解、编辑判断和素材，不用内容数量替代商品成交闭环。
- 用户验收且生产证据完整后归档 OpenSpec change。

## 并行内容里程碑

- Alpha：12 个公开案例，1 个自有原型草稿。
- 首批公开：最多 30 个，先验证公开访问、来源和真实收藏。
- 内容运营目标：流程稳定后扩到 100 个；这不是 Blueprint #001 商品化或成交的前置条件。
