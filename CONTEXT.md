# 当前进度

2026-07-21 已完成《每天拆一个 AI 产品》平台内容优先重做：新增 `video/ai-demo-vault-intro/SERIES_TEMPLATE.md`，更新 DESIGN、素材清单、栏目 README，并把第001期“玻璃拟态卡片”和第002期“玻璃光斑卡片”统一改为设计拆解/交互分析/重新实现/平台内评论 CTA。两期旁白、字幕、封面和 Remotion 成片已重新生成；视频内不出现工具、站点、下载、外链、URL、二维码或站外行动。

2026-07-21 已用 Remotion 重新导出四条 42 秒竖屏 MP4，抽帧检查通过；第001期旁白重新生成并压到 42 秒内，第002期旁白重新生成。网站代码未修改。

旧的产品介绍视频不再注册为可渲染 composition，Remotion 工程默认只保留两期平台内容，避免误把站外宣传片当成栏目成片。

2026-07-21 已完成《每天拆一个 AI 产品》第002期“玻璃光斑卡片”：新增自研 `Magic Card` Build Block #002、在线交互 Preview、源码包、Prompt、参数、Integration Guide、License、中文内容说明和来源版权边界。新增 `/explore/magic-card`，未接入支付、订单或下载。

2026-07-21 已使用 HyperFrames Kokoro 中文旁白与 Remotion 生成第002期 42秒竖屏成片：`video/ai-demo-vault-intro/remotion/renders/episode-002-magic-card.mp4` 和字幕版 `episode-002-magic-card-captions.mp4`。当前未发布视频，等待人工审核。

2026-07-20 完成《每天拆一个 AI 产品》第001期“玻璃拟态卡片”：自研 Glass Surface 交互 Demo、中文商品包、封面、42 秒竖屏旁白版与字幕版成片，以及小红书/抖音/X 发布文案。Build Block #001 已接入 `/explore/glass-surface`；真实支付和第二期均未启动。

2026-07-19 完成一次 Conversion Optimization。产品定位仍为 **AI Build Blocks Marketplace**：Demo Preview 只是免费预览，Build Block Package 才是商品；Blueprint 和 Bundle 作为更高层组合商品。首页已按“先搜索、再预览、最后理解组合层”重新收敛，当前代码已通过规范、单元测试、零配置构建和 Launch E2E。

当前代码已新增 Build Blocks Marketplace 首页、搜索优先目录和商品化详情页：单一搜索 CTA、Popular Searches、6 个核心分类、Featured/New、Mock 价格、Included 清单、Get Block 状态、Bundle/Blueprint 组合层入口和公开 Library 空状态；旧 `/demos` 路由保留兼容。真实支付、订单、下载和会员仍未开放。

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
- 首页不再展示 120+ 等 Mock 统计，不用虚构规模换取信任；价格仅在商品上下文以 Preview price 呈现。
- 首页删除重复的 Free/Popular/Why 商品解释，仅保留 Featured/New 两个浏览架；Bundle/Blueprint 合并为一个轻量组合层说明。
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

- 已建立 `CONTENT_PIPELINE.md`：覆盖 Discover、Evaluate、Breakdown、Rebuild、Packaging、Publish、Marketing 和 Database 维护；本轮只新增运营文档，不修改网站页面或功能。
- 已建立独立视频工程 `video/ai-demo-vault-intro`：真实公网截图、DESIGN、口播、分镜、HyperFrames 开场源、Remotion 竖屏工程和两条约 42 秒 MP4 均已生成；视频目录不参与 Next.js/Vercel 构建。
- 第001期素材集中在 `video/ai-demo-vault-intro/episodes/001-glass-card`，源码包集中在 `packages/glass-surface`；全部展示标题和 README 标题使用中文，`Glass Surface` 只保留为内部命名。
- 先连接 GitHub、创建 Vercel 项目并设置 Preview 的 `APP_DEPLOYMENT_TIER=preview`，生成公网 Preview URL；再配置生产 Supabase、正式站点域名和 Vercel 凭据，执行生产部署和公网冒烟。
- 后续只做一个真实 Package 的支付/下载闭环，再决定是否开放 Bundle、会员和更多模块。
- 真实商品价格、支付和生产权益仍需独立 change。
- OpenSpec strict 固定 CLI 复验仍未执行，不能把手工检查写成 strict 通过。
