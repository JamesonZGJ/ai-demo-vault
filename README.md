# AI Build Blocks Marketplace

这是一个以 **Build Block Package（能力模块包）**为中心的 AI Build Blocks Marketplace。用户搜索一个 Hover、动画、取色、AI 状态或 Prompt 工作流，先在线体验 Demo Preview，再免费查看自研源码、Cursor/Claude Prompt、README、参数、License 和 Integration Guide。完整 App Blueprint 保留为高级内容类型，不再主导首页。

产品边界：`Build Block = 能力定义`，`Demo Preview = 在线预览`，`Build Block Package = 免费可复用资料包`，`Bundle = 模块组合内容`，`App Blueprint = 完整产品高级内容`。当前只做本站自研内容，不做第三方卖家、分账或提现。

当前状态：**Launch Version 已完成公开演示闭环。** 首页、`/explore` 和详情页已经按 Galaxy / Uiverse 的成熟组件市场骨架重构：搜索优先、AI 能力分类、高密度真实预览网格、预览/源码同屏工作台。27 个 Build Block 使用本地静态目录；已有真实资料的模块全部免费开放，不显示价格或购买入口。生产站已连接独立 Supabase，支持真实邮箱密码注册、登录、退出和个人收藏。

## 最新产品决定

- 首页默认入口改为搜索优先的 Build Blocks Marketplace，优先发现一个个可复制能力模块。
- 首页和目录采用 Galaxy / Uiverse 的结构密度：64px 导航、搜索主入口、横向分类、桌面 4～5 列真实预览、目录侧栏与即时筛选；不复制其品牌、文案、源码或社区数据。
- 首页转化原则是首屏只有搜索这一个核心动作；分类用于检索，Featured/New 用于建立内容可信度，Bundle/Blueprint 只作为组合层入口。
- Demo Preview 用于确认效果；Build Block Package 免费公开真实源码、Prompt 和接入资料。
- 所有公开模块不显示价格、购买按钮或 checkout 链接；未完成内容只显示“准备中”。
- Build Block 详情页展示在线 Demo、Package Included 清单、Cursor Prompt、Claude Prompt、README、参数、License 和 Integration Guide。
- ColorSnap Blueprint #001 拆为多个独立 Capability，完整 Blueprint 只作为高级组合内容。
- 当前不新增支付、会员、订单、下载或后台。
- Launch Version 只保证可信展示、搜索、Preview、免费资料详情、Library 说明、SEO 和移动端。

## Launch Version 已实现

- 搜索优先首页：短 Hero、大搜索、真实热门关键词、AI 对话/多模态/Agent 等能力分类、精选/最近完成网格，以及最后的 Bundle/Blueprint 组合层入口。
- Build Block 目录与详情：固定分类栏、即时中英文搜索、技术栈/难度/资料状态/最新筛选、在线 Preview 与真实源码同屏工作台，以及 Prompt、README、参数、License、Integration Guide 和真实 Package 状态。
- 已具备真实资料的 Build Block 均可在详情页免费查看源码、Prompt 和接入说明；支付、订单和打包下载仍关闭。
- My Library 空状态、Bundles、About、License、Copyright、Privacy、404、favicon、Open Graph、sitemap、robots 和移动端布局已具备。
- 生产账号注册提交后立即建立会话并进入明确的“账号创建成功”结果页；当前未配置自有 SMTP，因此 Launch 阶段不发送确认邮件，本地 Auth 测试仍保留确认邮件流程。
- 旧 `/demos`、账号、收藏和 Blueprint 路由保留为兼容或本地预览，不作为 Launch 首页主路径。
- 《每天拆一个 AI 产品》第001–017期已完成并同步为网站自研 Build Block，包括第003期“流式聊天回复”的本地流式文本、状态反馈和自动滚动演示。每一期均可从目录进入在线 Preview；有真实资料的模块免费查看源码、Prompt、README、参数、接入指南和许可证。视频口播、字幕、封面和平台文案位于 `video/ai-demo-vault-intro/episodes`。

当前代码尚未实现真实支付、订单、客户权益、打包下载、会员、自动爬虫、管理后台、用户评论和社区。页面不显示本站商品价格或购买入口，也不会伪造下载完成、拥有源码或真实热度。未来如重新验证商业化，再遵守 `COMMERCE_SPEC.md`。

## 当前本地闭环与目标交易结构

```text
当前本地：Landing → Search Build Blocks → Demo Preview → Build Block 详情 → 免费查看源码 / Prompt / 接入说明
目标生产：搜索 Build Block → Demo Preview → Build Block Package 详情 → 精确价格结账 → 支付确认 → 订单与权益 → My Library → 私有资产 → 退款与对账
兼容预览：免费 Demo → App Blueprint 详情 → 免费查看现有内容
```

旧模拟交易结构只保留为未来研究资料，公开入口已经关闭。当前阶段以免费内容积累、搜索和真实复用反馈为目标。

## 技术架构

- Next.js 16、React 19、TypeScript。
- Tailwind CSS 4、自有轻量组件、Lucide。
- Supabase Postgres、Auth、RLS。
- Vercel 部署。
- Vercel Web Analytics，只统计公开页面的匿名聚合访问与来源。
- Vitest、Playwright、pgTAP 验证。

详细职责与调用关系见 `ARCHITECTURE.md`；本轮竞品审计与结构映射见 `reports/uiverse-audit/AUDIT.md`；目标商品信息架构见 `MARKETPLACE_IA.md`；日常内容生产 SOP 见 `CONTENT_PIPELINE.md`；Launch 交付门槛见 `LAUNCH_CHECKLIST.md`；当前免费基础层页面见 `UI_SPEC.md`；首发证据见 `LAUNCH_CONTENT.md`；发现渠道见 `SOURCE_REGISTRY.md`；内容发布门槛见 `EDITORIAL_GUIDE.md`；完整路线见 `ROADMAP.md`；逐项终局验收见 `GOAL_COVERAGE.md`；商品、订单、权益、下载和支付共同遵守 `COMMERCE_SPEC.md`。产品介绍视频工程见 `video/ai-demo-vault-intro/README.md`。

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

Vercel Production 已连接独立 Supabase；运行时只使用公开 URL 与 Publishable Key。尚未配置 Supabase 的 Preview 环境继续自动进入只读 Preview Mode，Demo、Capability 和 Package 页面使用仓库内静态数据；`APP_DEPLOYMENT_TIER=preview` 只是可选显式标记。Preview Mode 不开放账号、收藏、Blueprint 试用、支付、订单或下载。

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

第一次验证或 migration/seed 变化后，必须先明确执行 `pnpm exec supabase db reset`；该操作会清空 Supabase Local 数据，因此 `pnpm verify` 不会暗中代替你执行。当前 Launch Version 已通过 189 个单元测试、17 条 Build Block / Launch E2E（Chrome）、代码检查、类型检查和无 Supabase 的 59 项静态页面构建；移动端覆盖 360/390/430px。旧数据库契约仍通过 148 项便携 pgTAP、161 项正式 pgTAP。浏览器进程不会收到 Service Role Key。

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
- [Uiverse](https://uiverse.io/) / [Galaxy](https://github.com/uiverse-io/galaxy)：已审计首页、目录、详情与移动端的稳定骨架，并映射为本站导航、搜索、侧栏、五列网格和预览/源码工作台；不复制品牌、素材、文案、社区数据或组件源码。
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

- Galaxy / Uiverse 同类成熟产品骨架：首页搜索优先、AI 能力分类、真实 Preview 高密度网格；目录固定分类栏和即时筛选；详情 Preview/源码同屏；移动端按 360/390/430px 独立排布。
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
