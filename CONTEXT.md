# 当前进度

2026-07-18 进入 Launch Mode。产品目标是公开上线一个可信、可演示的 **AI Demo Marketplace**：Demo Preview 只是免费预览，Capability Package 才是商品；完整 App Blueprint 保留为高级组合商品。最后一轮回归已通过，当前停在“等待生产部署凭据”。

当前代码已新增搜索优先首页、`/explore` Capability 目录和详情、Bundle 规划页、My Library 空状态、About/License/Copyright、favicon/OG、更新后的 sitemap/robots，以及 Color Extraction 自研 Package 资产；旧 `/demos` 与 Blueprint 路由保留兼容。真实支付、订单、下载和会员仍未开放。

本轮新增 `APP_DEPLOYMENT_TIER=preview` 静态预览层：Vercel Preview 可只依赖仓库内静态 Capability 数据，自动使用 `VERCEL_URL` 生成公开 origin，不初始化 Supabase，也不开放账号、收藏、Blueprint 试用、支付、订单或下载。

发布预检发现当前目录没有 GitHub remote、没有 HEAD commit 或分支跟踪；GitHub 连接器账号可用但返回 0 个可访问仓库。Vercel CLI 需通过 `pnpm dlx vercel@56.2.1` 使用，本机没有登录令牌或 `.vercel` 项目绑定。

## 上一阶段已完成

- Blueprint Marketplace 的早期方案已保留为兼容路由，但不再作为 Launch 首页主叙事。
- ColorSnap 商品页、评分、时间线和 Launch Dashboard 方案已记录为后续高级 Blueprint 能力。
- 本地数据库与既有内容未被清空；本轮不新增支付、会员、订单、后台或第二个 Blueprint。

## 本轮重新定义

- Capability 是可复用能力定义，Demo Preview 是免费预览，Capability Package 才承载价格、资产和购买权益。
- Capability Package 的主价格带为 ¥1.9–9.9，交付自研源码、Cursor/Claude/AI Prompt、README、参数和 Integration Guide。
- 首页以搜索和开发者分类为主，不按行业分类；Bundle 后续组合多个 Package。
- ColorSnap 已在 IA 中拆为 11 个独立 Capability；完整 Blueprint 只通过组合关系引用它们，不占据首页第一主位。
- 本轮只完成信息架构和记录同步，没有新增商品、支付、会员、后台或下载系统。

## Launch Mode 已完成

- 首页第一动作是 Search，包含热门搜索、开发者分类、精选 Capability、最新 Capability、真实热度空状态、Bundle 规划和最后的 Blueprint 入口。
- `Capability → Demo Preview → Capability Package → My Library` 已形成公开页面链路；Color Extraction、Glass Surface、Card Highlight 有可交互 Preview，其余 ColorSnap 能力明确标记为 planned。
- Color Extraction 的自研源码、Cursor/Claude Prompt、README、参数和 Integration Guide 已放入 `packages/color-extraction`；页面显示资产已就绪，但支付和下载仍关闭。
- 公开静态页已补齐 About、License、Copyright、Privacy、404；基础 SEO、Open Graph、favicon、sitemap 和 robots 已更新。

# 关键边界

- 当前仍是本地预发布：Buy Blueprint 是无扣款模拟获取，不创建订单或支付交易。
- Code、Database、Deploy Guide 等路线图卡片不是源码交付；真实价格、许可、退款和生产销售仍未开放。
- ColorSnap 当前原型不是 AI 成品，AI 只作为后续升级候选；商业模式与市场机会均标注为编辑假设。

# 验证

- 139 个单元测试通过。
- 3 条 Chrome Launch E2E（首页、搜索、移动端、SEO/404）通过。
- TypeScript、lint、`pnpm build:local`（45 个路由）通过。
- `git diff --check` 通过。
- 本地 Lighthouse：Accessibility 100、Best Practices 100、CLS 0；Performance 59、SEO 66。该结果来自开发服务器，不能替代公网生产评分。
- 标准 `pnpm build` 在无环境变量时会明确失败；Preview 环境设置 `APP_DEPLOYMENT_TIER=preview` 后，未配置 Supabase 也成功构建 32 个路由。
- 开发服务器已启动：`http://localhost:3000`。

# 下一站

- 先连接 GitHub、创建 Vercel 项目并设置 Preview 的 `APP_DEPLOYMENT_TIER=preview`，生成公网 Preview URL；再配置生产 Supabase、正式站点域名和 Vercel 凭据，执行生产部署和公网冒烟。
- 后续只做一个真实 Package 的支付/下载闭环，再决定是否开放 Bundle、会员和更多模块。
- 真实商品价格、支付和生产权益仍需独立 change。
- OpenSpec strict 固定 CLI 复验仍未执行，不能把手工检查写成 strict 通过。
