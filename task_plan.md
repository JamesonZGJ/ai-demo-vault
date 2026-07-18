# 任务计划

## 0. 提案确认

- [x] `<files>` 读取全局 `CONTEXT.md`、`lessons.md`、`README.md` 和现有 ColorSnap 资产。
- [x] `<action>` 核验第一批案例、技术方案、版权边界和商业阶段。
- [x] `<action>` 补齐完整路线、MVP UI、编辑、媒体、隐私统计和结构化创业改造规范。
- [x] `<verify>` Review 提案是否包含范围、非范围、验收标准和真实数据约束。
- [x] `<verify>` 用 Wan2.2 与 Jasper 替补收口 12 项首发事实清单；所有公开项满足发布方地区、来源平台和官方证据规则。
- [x] `<action>` 建立 22 个命名发现渠道的来源注册表，并明确 API、人工、授权和禁止自动化边界。
- [x] `<action>` 核验第二批 18 个候选，形成首批 30 项内容池；不把候选数量写成已发布数量。
- [x] `<verify>` Review 第二批状态、许可、链接、重复项和数据模型一致性。
- [x] `<action>` 建立 G01–G25 完整目标验收矩阵、商业化基础契约和 21 个后续 change 的依赖顺序，防止用 MVP 替代终局。
- [x] `<verify>` 逐项补齐 12 个首发发布主体、角色和地区证据，并把真实产品展示媒体加入发布门槛。
- [x] `<done>` 用户明确确认 `launch-curated-mvp` 后进入 apply。

## 1. 脚手架与数据库

- [x] `<files>` 创建 Next.js、Supabase、测试和环境变量文件。
- [x] `<action>` 建表、约束、索引、RLS、收藏计数和查询函数。
- [x] `<verify>` 本地重建数据库并通过全部 pgTAP 权限测试。
- [x] `<done>` 游客只见已发布案例，两个用户互相看不到收藏。

## 2. 首批内容

- [x] `<files>` 写入 12 个官方案例的发布数据与 1 个自有原型草稿，并制作原创封面和获准使用的真实产品展示媒体。
- [x] `<action>` 为每条内容补发布方、来源平台、11 个主要主张、源码状态、逐条来源、许可、核验时间、成熟度、证据标签和完整商业潜力判断。
- [x] `<verify>` 内容校验脚本拒绝发布方未知、缺主要主张、空真实性边界、源码状态证据矛盾、缺来源、缺授权封面、缺真实产品展示媒体、缺商业潜力判断或伪造热度的记录。
- [x] `<done>` 10 个优先分类均有可核验案例，中国与海外来源均存在，所有公开事实可追溯。

## 3. 公开页面

- [x] `<files>` 实现首页、案例库、详情页、卡片、筛选、站点地图和 robots。
- [x] `<action>` 完成黑白极简、截图优先、移动端和桌面端布局。
- [x] `<verify>` 单元测试、可访问性检查和 Playwright 游客流程通过。
- [x] `<done>` 搜索、筛选、排序、分享 URL 和详情 SEO 均可用。

## 4. 登录与收藏

- [x] `<files>` 实现注册、登录、确认、退出、收藏操作和收藏页。
- [x] `<action>` 使用显式 `setFavorite`，避免并发下的盲切换竞态。
- [x] `<verify>` 刷新后收藏保留，未登录用户被引导登录，跨用户隔离通过。
- [x] `<done>` 真实收藏计数可用，不显示模拟人数。

## 5. 生产发布

- [x] `<files>` 创建 `DEPLOYMENT.md`、发布记录模板、发布前置检查和只读生产冒烟脚本，补齐 SMTP、回调、canonical origin 和回滚记录。
- [ ] `<action>` 部署独立生产 Supabase 与 Vercel，应用迁移并配置公开页匿名统计。
- [ ] `<verify>` 从公网完成确认邮件、登录、收藏、权限、SEO、统计排除、密钥和回滚冒烟。
- [ ] `<done>` 生产 URL 可访问，线上版本与数据库迁移一致，回滚步骤可复现。

## 6. 收口

- [x] `<files>` 更新 `CONTEXT.md`、`README.md`、`ARCHITECTURE.md` 和 OpenSpec tasks。
- [x] `<action>` 运行 Review 查 Bug，然后做第一性原理精简。
- [x] `<verify>` 原免费基础层验证通过；Marketplace apply 后已重新通过 148 项便携 pgTAP、161 项正式 pgTAP、134 项单元测试、12 条真实 Chrome E2E 和 27 页本地构建；最终 OpenSpec strict 复验等待用户允许固定第三方包执行。
- [ ] `<done>` 将 change 归档并同步正式 specs。

## 7. Blueprint 交易平台重新定位

- [x] `<files>` 读取当前首页、导航、路由、Demo 详情、sitemap、数据库、`README.md`、`UI_SPEC.md`、`COMMERCE_SPEC.md` 和 `ROADMAP.md`。
- [x] `<action>` 审计商品化、支付、会员、购买后交付和 Blueprint 详情页；确认当前实现只支持免费浏览与收藏。
- [x] `<action>` 定义 Demo、Blueprint、Entitlement 三类对象、目标页面树、商品详情、CTA 状态和首个真实成交闭环。
- [x] `<action>` 把首阶段限定为本站自营精选商店，并让 Demo 内容增长与 Blueprint #001 并行。
- [x] `<files>` 创建 `MARKETPLACE_IA.md`、审计数据和 `reframe-blueprint-marketplace-ia` 独立 OpenSpec 提案；同步 README、架构、路线、商业契约和上下文。
- [x] `<verify>` 两轮独立 Review 查 Bug、第一性原理精简和文档一致性检查通过；范围不再误报支付/会员已实现。
- [x] `<done>` 用户确认新提案后进入 apply；本轮不接支付、不发布假商品。

## 8. ColorSnap Blueprint #001 本地商品闭环

- [x] `<files>` 新增 Blueprint 商品基础、12 个公开决策区块、七类资料摘要、私有资料、访问权和双闸门。
- [x] `<action>` 首页以购买价值为主，免费 Demo 明确导向 ColorSnap 商品；商品页展示完整 12 区块并提供模拟获取入口。
- [x] `<action>` 登录后由 RPC 幂等创建本地试用访问权，进入本人资料库；不创建订单、支付、收入、会员或下载记录。
- [x] `<verify>` 已补商品状态/价格组合约束、撤下后资源不可读、生产开关精确 false、托管环境拒绝本地试用和措辞真实性边界。
- [x] `<verify>` 重新运行本轮修改后的数据库、lint、typecheck、unit、E2E、build；OpenSpec strict 仍待固定 CLI 权限。
- [ ] `<done>` 用户验收后归档；归档不代表真实交易闭环完成。

## 9. ColorSnap Marketplace MVP 打磨（2026-07-18）

- [x] `<files>` 审计并重做首页、Blueprint 商品页和购买后资料页，保持只有 ColorSnap #001。
- [x] `<action>` 首页改为 Marketplace-first：Featured/Popular/Latest/Categories、搜索、评分和精确主张。
- [x] `<action>` 商品页补齐 Market Opportunity、用户画像、商业模式、技术栈、Blueprint Score、Build Timeline、What's Included 和 Buy Blueprint。
- [x] `<action>` 购买后改为 Launch Dashboard，加入 8 个启动模块、下一步、Launch Checklist、时间线和资料样品。
- [x] `<verify>` 本地 migration/seed、148 项便携 pgTAP、134 个单元测试、12 条 E2E、lint、typecheck、27 页构建全部通过。
- [ ] `<done>` 用户体验本地 MVP 后再决定是否进入真实商品化；不在本轮新增支付、会员或后台。

## 10. AI Demo Marketplace 信息架构重定义（2026-07-18，已被第 11 节细化）

- [x] `<files>` 读取当前上下文、经验记录和 Blueprint-first 实现边界。
- [x] `<action>` 将主商品改为可复用模块，保留 Bundle 和高级 App Blueprint 两个商品层。
- [x] `<action>` 定义 `/explore`、模块详情、购买后 Demo Library、Bundle 和次级 Blueprint 的页面树与导航主次。
- [x] `<verify>` 明确模块资产包、价格假设、评分维度和权利边界，不把未实现的商品或交易写成事实。
- [x] `<files>` 同步 `MARKETPLACE_IA.md`、`README.md`、`CONTEXT.md`、`ARCHITECTURE.md`、`UI_SPEC.md`、`lessons.md` 和进度记录。
- [ ] `<action>` 用户确认后再迁移代码对象模型、首页、目录和模块详情；本轮不接支付、会员或后台。

## 11. Capability Package 核心模型复核（2026-07-18）

- [x] `<files>` 重新读取 `CONTEXT.md`、`lessons.md` 和当前 Marketplace IA。
- [x] `<action>` 将对象拆为 `Capability → DemoPreview → CapabilityPackage`，并把 Bundle、App Blueprint、Library Item 作为独立关系层。
- [x] `<action>` 把搜索定义为首页第一入口，分类改为开发者检索词，不增加行业目录页面族。
- [x] `<action>` 补齐 ColorSnap 的 11 个独立 Capability 拆解、组合关系和 planned 状态。
- [x] `<verify>` 增加自研重实现、许可证、归属和可再分发记录作为 Package 上架门槛；未满足时只能 Preview。
- [x] `<verify>` 明确本轮没有修改 UI、运行代码、支付、会员或后台。
- [ ] `<done>` 用户确认结构合理后，再进入 UI 和对象模型迁移 apply。

## 12. Launch Version 本地公开演示（2026-07-18）

- [x] `<files>` 新增 Capability 静态目录、搜索优先首页、`/explore` 列表/详情、Bundle 规划、My Library 空状态和 About/License/Copyright。
- [x] `<action>` 新增 Color Extraction 自研 Package 的源码、Cursor/Claude Prompt、README、参数、Integration Guide 和 manifest。
- [x] `<action>` 更新品牌导航、元数据、Open Graph、favicon、sitemap、robots、404 和隐私文案。
- [x] `<verify>` lint、typecheck、135 个单元测试、3 条 Chrome Launch E2E、移动端宽度、SEO/404 和 45 页本地构建通过。
- [ ] `<action>` 配置生产 Supabase、域名、Vercel 和公网部署；未配置前不声称已公开上线。
