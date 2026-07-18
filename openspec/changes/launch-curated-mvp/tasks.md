# Tasks

## 1. Bootstrap

- [x] 1.1 `<files>` 创建 `package.json`、`pnpm-lock.yaml`、Next.js/Tailwind/TypeScript 配置、测试配置、`.env.example` 和 `.gitignore`。
- [x] 1.2 `<action>` 先用 OpenSpec 1.6.0 初始化当前项目，再从官方 `with-supabase` 示例创建最小工程；只保留本 change 需要的依赖。
- [x] 1.3 `<verify>` 严格 TypeScript、lint、Vitest、Playwright 和生产构建可以通过统一 `pnpm verify` 执行。
- [x] 1.4 `<done>` 新环境按 README 一次安装即可启动，不含 Service Role Key、Mock 生产入口或未使用框架。

## 2. Database

- [x] 2.1 `<files>` 创建 `supabase/migrations`、`supabase/seed.sql`、生成的数据库类型和 `supabase/tests`。
- [x] 2.2 `<action>` 建立分类、工具、案例、`demo_publishers`、链接、逐条主张、证据、素材和收藏；实现 11 个主要主张、源码状态、真实性边界、本表内容和跨表证据/产品媒体延迟约束触发器、发布依赖父行并发锁、静态参数化搜索、索引、RLS 与原子收藏计数。
- [x] 2.3 `<verify>` 用 pgTAP 覆盖游客、两个用户、伪造 user_id、重复命令、收藏并发、并发删除最后发布依赖、草稿、缺产品展示媒体、删除/降级主展示媒体、未授权素材、直接 REST/RPC 读取和管理角色。
- [x] 2.4 `<done>` 游客即使绕过页面也只能读取合格公开内容；用户只能读写自己的收藏；收藏计数可从关系表重算且不为负。

## 3. Content

- [x] 3.1 `<files>` 更新 `supabase/seed.sql`，创建 12 张原创封面，并为每项准备至少一份获准使用的真实产品截图/GIF/视频及完整权利记录；保留 ColorSnap 私有草稿。
- [x] 3.2 `<action>` 按 `LAUNCH_CONTENT.md` 写入 12 个首发案例；逐条补案例形态、官方来源、发布方地区、来源平台、成熟度、事实/推断/假设、四项创业改造、难度与商业潜力理由。候选被地区、许可或事实阻断时必须替换，不能强行发布。
- [x] 3.3 `<verify>` 内容测试拒绝缺主来源、主要主张或核验日期、空真实性边界、源码状态与仓库/开源证据不一致、缺四项创业改造、缺授权封面、缺真实产品展示媒体或权利记录、缺商业潜力分数/理由/版本/日期/依据、闭源源码暗示和伪造热度。
- [x] 3.4 `<done>` 10 个优先方向均有案例，中国与海外官方来源均存在；12 项满足发布门槛，ColorSnap 仍不可公开。

## 4. Public experience

- [x] 4.1 `<files>` 创建 `app/(public)`、`components/demo`、`components/media`、`components/filters`、`lib/demos`、SEO 文件和隐私说明页。
- [x] 4.2 `<action>` 实现导航、案例卡、每日确定性精选、最新收录、条件“收藏最多”、创业灵感编辑榜、案例库 URL 搜索筛选分页和完整详情。
- [x] 4.3 `<action>` 实现已批准图片/GIF/视频及静态/文字失败状态；接入只限首页、案例库和公开详情的匿名聚合统计，排除账号、收藏、隐私路径与敏感参数。
- [x] 4.4 `<verify>` 单元与 Playwright 覆盖 canonical URL、搜索、四种排序、分页、空/错/加载、媒体、360/768/1440px、键盘、减少动态效果、metadata、sitemap、robots 和统计排除。
- [x] 4.5 `<done>` 游客能完成公开发现与阅读；草稿、未授权素材和失败请求不会伪装成正常空数据；核心页面无 serious/critical 无障碍问题。

## 5. Account and favorites

- [x] 5.1 `<files>` 创建 `app/(auth)`、`app/auth`、`app/(account)/favorites`、`lib/supabase` 和 `lib/favorites`。
- [x] 5.2 `<action>` 实现邮箱密码注册、确认、登录、退出、安全站内回跳、显式 `setFavorite`、真实收藏计数和个人收藏页。
- [x] 5.3 `<verify>` 使用 Supabase Local Auth 与 Mailpit 完成真实确认邮件、无效凭据、恶意 returnTo、收藏、取消收藏和刷新/重新登录持久化 E2E；使用 pgTAP 覆盖重复收藏、跨用户隔离和案例撤下后的旧收藏删除。
- [ ] 5.4 `<done>` 私有页面不索引、不发送分析事件；生产发布门槛包含自有 SMTP 与精确回调域名白名单。

## 6. Production deployment

- [x] 6.1 `<files>` 创建 `DEPLOYMENT.md`、`DEPLOYMENT_RECORD_TEMPLATE.md`、发布前检脚本、版本化 schema contract 与只读生产数据库校验脚本、生产 Playwright 配置及公网测试，补齐环境变量、迁移、SMTP/回调、canonical origin、监控和回滚步骤。
- [ ] 6.2 `<action>` 创建生产 Supabase 与 Vercel 环境，应用受控迁移；配置自有 SMTP、精确 Auth 回调白名单、Vercel 生产域名或用户提供的自定义域名、Web Analytics 和隐私说明。
- [ ] 6.3 `<verify>` 从公网执行 Auth 邮件确认、登录、收藏、撤销、公开/私有路由、canonical、sitemap、robots、分析排除和密钥泄漏冒烟；执行一次可逆回滚检查。
- [ ] 6.4 `<done>` 生产 URL 可访问，数据库与 Web 版本一致，线上统计不含私有路径或敏感标识，回滚步骤可复现。

## 7. Verification and archive

- [x] 7.1 `<files>` 更新 `CONTEXT.md`、`README.md`、`ARCHITECTURE.md`、`progress.md` 和 OpenSpec tasks；正式 specs 留到 7.4 归档时同步。
- [x] 7.2 `<action>` 运行完整 `pnpm verify`，随后 Review 查 Bug，再做第一性原理精简。
- [ ] 7.3 `<verify>` 数据库、代码检查、单元、端到端、无障碍和生产构建全部通过；人工验收 12 项内容、许可、移动端与生产冒烟证据。
- [ ] 7.4 `<done>` 用户验收后归档 `launch-curated-mvp`，并保留 `ROADMAP.md` 中未完成的后续 change，不把 MVP 归档误写成完整目标完成。
