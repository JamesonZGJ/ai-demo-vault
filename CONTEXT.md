# 当前进度

2026-07-19 完成 Launch Marketplace 视觉与信息架构升级。产品定位统一为 **AI Build Blocks Marketplace**：Demo Preview 只是免费预览，Build Block Package 才是商品；Blueprint 和 Bundle 作为更高层组合商品。当前代码已通过规范、单元测试、零配置构建和 Launch E2E。

当前代码已新增 Build Blocks Marketplace 首页、搜索优先目录和商品化详情页：Hero 双 CTA、Popular Searches、分类、Featured/Newest/Free/Popular、Mock 价格、Included 清单、Get Block/Save/Share 状态、Why Build Blocks、Bundle/Blueprint 入口和公开 Library 空状态；旧 `/demos` 路由保留兼容。真实支付、订单、下载和会员仍未开放。

本轮新增自动 Preview Mock Mode：缺少 `NEXT_PUBLIC_SUPABASE_URL` 或 Publishable/Anon Key 时，Vercel Preview 可只依赖仓库内静态 Demo、Capability 和 Package 数据，自动使用 `VERCEL_URL` 生成公开 origin，不初始化 Supabase，也不开放账号、收藏、Blueprint 试用、支付、订单或下载。`APP_DEPLOYMENT_TIER=preview` 只是可选显式标记。

GitHub 已连接并完成首个提交：`6bf13d7de76981929b0bd27d26608c6790b0b3a0` 已推送到 `origin/main`，远端为公开仓库 `JamesonZGJ/ai-demo-vault`。远端只包含安全的 `.env.example`，没有 `.env`、缓存、构建产物、报告、日志或证书文件。Vercel CLI 需通过 `pnpm dlx vercel@56.2.1` 使用，本机仍没有登录令牌或 `.vercel` 项目绑定。

## 上一阶段已完成

- Blueprint Marketplace 的早期方案已保留为兼容路由，但不再作为 Launch 首页主叙事。
- ColorSnap 商品页、评分、时间线和 Launch Dashboard 方案已记录为后续高级 Blueprint 能力。
- 本地数据库与既有内容未被清空；本轮不新增支付、会员、订单、后台或第二个 Blueprint。

## 本轮重新定义

- Build Block 是可复用能力定义，Demo Preview 是免费预览，Build Block Package 才承载价格、资产和购买权益。
- Capability Package 的主价格带为 ¥1.9–9.9，交付自研源码、Cursor/Claude/AI Prompt、README、参数和 Integration Guide。
- 首页以搜索和开发者分类为主，不按行业分类；Bundle 后续组合多个 Package。
- ColorSnap 已在 IA 中拆为 11 个独立 Capability；完整 Blueprint 只通过组合关系引用它们，不占据首页第一主位。
- 首页 Mock 数据明确标注 editorial snapshot；商品价格统一显示 mock price，Get Block、Save、Share 均不伪造成功结果。
- Blueprint 入口在 Preview 环境公开展示准备中状态，避免 CTA 进入 404；真实 Blueprint 内容只在本地试用条件满足时读取。

## Launch Mode 已完成

- 首页第一动作是 Search，包含热门搜索、Build Block 分类、Featured/Newest/Free/Popular 商品架、Why Build Blocks、Bundle 和最后的 Blueprint 入口。
- `Capability → Demo Preview → Capability Package → My Library` 已形成公开页面链路；Color Extraction、Glass Surface、Card Highlight 有可交互 Preview，其余 ColorSnap 能力明确标记为 planned。
- Color Extraction 的自研源码、Cursor/Claude Prompt、README、参数和 Integration Guide 已放入 `packages/color-extraction`；页面显示资产已就绪，但支付和下载仍关闭。
- 公开静态页已补齐 About、License、Copyright、Privacy、404；基础 SEO、Open Graph、favicon、sitemap 和 robots 已更新。

# 关键边界

- 当前仍是本地预发布：Buy Blueprint 是无扣款模拟获取，不创建订单或支付交易。
- Code、Database、Deploy Guide 等路线图卡片不是源码交付；真实价格、许可、退款和生产销售仍未开放。
- ColorSnap 当前原型不是 AI 成品，AI 只作为后续升级候选；商业模式与市场机会均标注为编辑假设。

# 验证

- 142 个单元测试通过。
- 3 条 Chrome Launch E2E（首页、搜索、商品详情、移动端、SEO/404）通过。
- TypeScript、lint、`pnpm build:local`（45 个路由）通过。
- `git diff --check` 通过。
- 本地 Lighthouse：Accessibility 100、Best Practices 100、CLS 0；Performance 59、SEO 66。该结果来自开发服务器，不能替代公网生产评分。
- 无 Supabase、无 `APP_DEPLOYMENT_TIER`、仅带 Vercel Preview origin 时，标准 `pnpm build` 成功生成 43 个路由，其中 `/demos/[slug]` 和 `/explore/[slug]` 各生成 12 个静态页面。
- 开发服务器已启动：`http://localhost:3000`。

# 下一站

- 先连接 GitHub、创建 Vercel 项目并设置 Preview 的 `APP_DEPLOYMENT_TIER=preview`，生成公网 Preview URL；再配置生产 Supabase、正式站点域名和 Vercel 凭据，执行生产部署和公网冒烟。
- 后续只做一个真实 Package 的支付/下载闭环，再决定是否开放 Bundle、会员和更多模块。
- 真实商品价格、支付和生产权益仍需独立 change。
- OpenSpec strict 固定 CLI 复验仍未执行，不能把手工检查写成 strict 通过。
