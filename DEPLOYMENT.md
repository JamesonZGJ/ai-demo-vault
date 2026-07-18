# AI Demo Marketplace 生产部署

AI Demo Marketplace 使用独立的 Supabase 生产项目与 Vercel 项目。Web 运行时只持有可公开密钥，不持有数据库密码或 Service Role Key。

## 0. 无 Supabase 的 Vercel Preview

在正式 Supabase 建好之前，可以先部署只读 Preview，验证首页、Capability 目录、详情页、Bundle、My Library 空状态和法律/SEO 页面。Preview 不初始化 Supabase，不开放登录、收藏、Blueprint 试用、支付、订单或下载。

Vercel 项目只需配置以下 Preview 环境变量：

| 变量 | 值 |
|---|---|
| `APP_DEPLOYMENT_TIER` | `preview` |

Vercel 自动提供 `VERCEL_URL`，因此 Preview 可不设置 `NEXT_PUBLIC_SITE_URL`。应用会使用 `https://<VERCEL_URL>` 生成 canonical、Open Graph、sitemap 和 robots。不要把本地 Supabase 地址、占位密钥或任何 Service Role Key 填入 Preview。

Preview 构建命令使用项目默认的 `pnpm build`，Install Command 使用 `pnpm install --frozen-lockfile`，Node.js 使用 `20.x` 或更高版本。生产环境不能保留 `APP_DEPLOYMENT_TIER=preview`。

## 1. 必需配置

| 位置 | 名称 | 说明 |
|---|---|---|
| Vercel | `NEXT_PUBLIC_SUPABASE_URL` | 生产 Supabase Project URL |
| Vercel | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | 生产 Publishable Key；不是 Service Role Key |
| Vercel | `NEXT_PUBLIC_SITE_URL` | 唯一生产 origin，不带路径或末尾斜杠 |
| 部署终端 | `SUPABASE_ACCESS_TOKEN` | 仅供 Supabase CLI 部署使用，不进入 Vercel |
| 部署终端 | 数据库密码 | 只在受控终端输入，不写入仓库、脚本或日志 |
| 发布与冒烟 | `EXPECTED_SUPABASE_PROJECT_REF` | 20 位 Project Ref；生产 URL 必须与它精确匹配 |
| 发布预检 | `EXPECTED_RELEASE_COMMIT_SHA` | 本次已验证的完整 Git commit SHA；必须等于当前 `HEAD` |
| 公网冒烟 | `PRODUCTION_BASE_URL` | 已上线的唯一公网 HTTPS origin；只供独立 Playwright 配置读取 |
| 公网冒烟 | `PRODUCTION_SUPABASE_URL` | 生产 Supabase 公网 HTTPS origin；不复用本地 `NEXT_PUBLIC_*` |
| 公网冒烟 | `PRODUCTION_SUPABASE_PUBLISHABLE_KEY` | 生产 Publishable Key；只读数据库验收专用 |

任何 `service_role`、JWT secret、SMTP 密码或数据库密码都不得使用 `NEXT_PUBLIC_*` 名称。

## 2. 发布顺序

1. 先把项目保存为干净、可回溯的 Git commit，运行完整本地验证，并填写一份 `DEPLOYMENT_RECORD_TEMPLATE.md`：

   ```powershell
   pnpm verify
   $releaseCommit = (git rev-parse HEAD).Trim()
   ```

   把 `$releaseCommit` 的完整值写入发布记录，并在后续步骤保留同一变量；变量或会话丢失时必须重新运行本步骤，不能临时改成另一个 commit。

   此时不要运行 `release:preflight`：详情页的 `generateStaticParams()` 会在生产构建时读取已发布 slug，生产数据库尚未迁移时必然失败。
2. 在 Supabase 创建独立生产项目，记录 Project Ref；首次发布的“发布前数据库版本”明确记录为新项目初始状态。在部署终端登录并链接项目。执行迁移前，先把 schema dump、迁移列表及 SHA-256 写入受限发布记录目录：

   ```powershell
   pnpm exec supabase login
   pnpm exec supabase link --project-ref <PROJECT_REF>
   pnpm exec supabase migration list --linked
   pnpm exec supabase db dump --linked --file <RESTRICTED_RELEASE_DIR>\pre-deploy-schema.sql
   pnpm exec supabase db push --dry-run
   pnpm exec supabase db push
   ```

   `db push` 必须同时应用 schema、基础目录内容和 12 条首发内容三组版本化 migration。生产环境不运行 `--include-seed`；本地 seed 只用于 reset，其内容会由自动测试与生产数据 migration 逐字比对。

3. 在 Supabase SQL Editor 核对最新迁移版本、RLS 已启用、Web 运行角色没有内容写权限，并执行以下发布后断言：

   ```sql
   select
     count(*) filter (where status = 'published') as published,
     count(distinct category_id) filter (where status = 'published') as categories,
     count(*) filter (where status = 'published' and publisher_region = 'mainland_china') as mainland,
     count(*) filter (where status = 'published' and publisher_region = 'international') as international
   from public.demos;
   ```

   首次发布必须精确返回 `12 / 10 / 4 / 8`；不符合时停止 Web 发布，不手工补数据。随后从部署终端用专用生产变量运行匿名只读验收：

   ```powershell
   $env:EXPECTED_SUPABASE_PROJECT_REF='<PROJECT_REF>'
   $env:PRODUCTION_SUPABASE_URL='https://<PROJECT_REF>.supabase.co'
   $env:PRODUCTION_SUPABASE_PUBLISHABLE_KEY='<PRODUCTION_PUBLISHABLE_KEY>'
   pnpm test:production:db
   ```

4. 创建并链接 Vercel 项目但先不部署，确定唯一生产 origin，启用 Web Analytics，并配置三项 `NEXT_PUBLIC_*` 生产变量。按第 3 节先完成 Supabase Auth、精确回调白名单和自有 SMTP；缺任一项不得公开注册入口。
5. 在部署终端导出与 Vercel 完全相同的三项生产公开变量，再运行生产发布预检：

   ```powershell
   $env:EXPECTED_RELEASE_COMMIT_SHA=$releaseCommit
   $env:EXPECTED_SUPABASE_PROJECT_REF='<PROJECT_REF>'
   $env:NEXT_PUBLIC_SITE_URL='https://<PRODUCTION_ORIGIN>'
   $env:NEXT_PUBLIC_SUPABASE_URL='https://<PROJECT_REF>.supabase.co'
   $env:NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY='<PRODUCTION_PUBLISHABLE_KEY>'
   pnpm release:preflight
   ```

   预检会在构建前后两次核对完整 commit 与干净工作区，并核对 Supabase Project Ref、固定 CLI、三个 migration 及其 seed 镜像；随后通过已迁移的生产数据库执行 `VERCEL_ENV=production` 真实构建并扫描浏览器产物中的秘密格式。把唯一一行 `RELEASE_PREFLIGHT_EVIDENCE=...` 原样写入发布记录；其中包含完整 commit、构建 ID、锁文件与迁移哈希、实际 Supabase CLI 和部署必须使用的 Vercel CLI 版本。失败或证据缺失时不得发布。
6. 先部署 Preview；Preview 使用同一生产数据库完成公开只读检查后，再部署 Production：

   ```powershell
   if ((git rev-parse HEAD).Trim() -ne $releaseCommit) { throw 'commit 已变化，必须重新预检' }
   if (git status --porcelain -- .) { throw '工作区已变化，必须重新预检' }
   pnpm dlx vercel@56.2.1 --meta "releaseCommitSha=$releaseCommit"
   pnpm dlx vercel@56.2.1 --prod --meta "releaseCommitSha=$releaseCommit"
   ```

   发布合同固定 Vercel CLI `56.2.1`，不得改用 `@latest`；升级版本必须作为一次可审查的代码与文档变更。两次部署都把同一个 commit 写入 Deployment metadata。
7. Production 部署完成后执行第 5 节公网冒烟；全部通过后才切换自定义域流量，并把最终 Deployment ID、metadata 中的 commit SHA 和迁移版本写入同一发布记录。首次发布没有上一 Web 版本，失败时保持或撤销域名切换，不回退数据库历史。

## 3. Auth 与邮件

Supabase Auth 的密码最短长度固定为 8。生产环境必须配置自有 SMTP，不能依赖 Supabase 默认试用邮件服务。

在 Supabase Dashboard 明确完成并记录：

- 服务端最短密码长度为 8，开启邮箱确认；不能只依赖网页表单校验。
- 配置自有 SMTP 发件域，关闭会改写确认 URL 的邮件链接追踪。
- SPF、DKIM、DMARC 验证通过；从目标用户常用邮箱服务实收一封确认邮件。
- 依据公开注册风险决定 CAPTCHA 和 Auth rate limit；决定与数值进入发布记录，不能保持未知默认值。

允许的 Redirect URL 只登记实际 origin：

- `<NEXT_PUBLIC_SITE_URL>/auth/confirm`

不要添加 `*`、临时预览域名或任意子域通配符。站点 URL 必须与 `NEXT_PUBLIC_SITE_URL` 完全一致。本地开发单独保留 `http://localhost:3000/auth/confirm`，不要复制到生产项目。

SMTP 配置完成后，用一个专用测试邮箱走完“注册 → 收件 → 确认 → 登录”，并检查邮件中的 host、HTTPS 和回跳路径。

## 4. Analytics 与隐私

Vercel Web Analytics 只允许首页、`/demos` 和公开详情页发送匿名聚合 pageview。以下路径必须在客户端 `beforeSend` 中返回 `null`：

- `/login`
- `/register`
- `/auth/*`
- `/favorites`
- `/privacy`

发送前移除查询参数；不得传邮箱、用户 ID、收藏内容、Token 或自定义用户标识。线上冒烟需要在浏览器 Network 中逐页核对。

## 5. 线上冒烟

先运行不写生产数据的两组自动检查：

```powershell
$env:PRODUCTION_BASE_URL='https://<PRODUCTION_ORIGIN>'
$env:EXPECTED_SUPABASE_PROJECT_REF='<PROJECT_REF>'
$env:PRODUCTION_SUPABASE_URL='https://<PROJECT_REF>.supabase.co'
$env:PRODUCTION_SUPABASE_PUBLISHABLE_KEY='<PRODUCTION_PUBLISHABLE_KEY>'
pnpm test:production:public
pnpm test:production:db
```

生产公开 Playwright 不启动本地服务器；数据库脚本只使用 Publishable Key 执行匿名只读查询。Auth、收藏、取消收藏和跨用户隔离会创建测试账号及关系，必须在用户明确允许产生这些记录后人工执行并记录清理结果。

公网测试默认使用 Playwright Chromium；若受控终端已安装系统 Chrome，可设置 `$env:PLAYWRIGHT_CHANNEL='chrome'`。该变量只选择浏览器通道，不能绕过公网 HTTPS origin、生产数据库合同或密钥检查。

| 检查 | 通过条件 |
|---|---|
| 首页、目录、详情 | 200；只显示合格公开案例 |
| 草稿与未知 slug | 统一 404，不泄露是否存在 |
| 搜索筛选 | URL 可分享；非法值 307 到规范 URL |
| 注册确认 | 自有 SMTP 邮件可达，确认链接只回本站 |
| 登录与退出 | 会话生效；退出后私有页回登录 |
| 收藏与取消 | 刷新后保持；计数只变化一次且不为负 |
| 跨用户隔离 | 用户甲无法读写用户乙收藏 |
| SEO | canonical、sitemap、robots 使用唯一生产 origin |
| 私有 SEO | 登录、注册、确认、收藏均 `noindex` |
| Analytics | 只在三类公开路由发送，不含查询参数或敏感值 |
| 密钥 | 客户端产物和 Network 中不存在 Service Role Key、数据库或 SMTP 密码 |

## 6. 监控

- Vercel：部署状态、函数错误率、公开路由 5xx。
- Supabase：Auth 错误、数据库连接、RLS 拒绝、迁移版本。
- 内容：公开链接和核心事实每 90 天人工复核；失效案例先撤下，再修复。

日志不得记录密码、确认 Token、Cookie、Authorization header 或完整邮箱。

## 7. 回滚

数据库迁移采用向前修复，不在生产直接执行手写删除或回退 SQL。

1. 发布前保存当前 Vercel Production Deployment ID、当前迁移版本和 `supabase db dump --linked --file <RESTRICTED_RELEASE_DIR>\pre-deploy-schema.sql` 输出到受限发布记录。Supabase CLI 2.109.1 默认 dump schema，不存在 `--schema-only` 参数。
2. Web 失败且数据库兼容时，用 Vercel 把上一已验证 Deployment 重新提升为 Production。首次发布没有上一版本时，不切换自定义域 DNS；失败就撤销待切换记录并保留原站点。
3. 数据库迁移失败时停止 Web 发布，不重跑未知状态命令；先查询 `supabase_migrations.schema_migrations`，再提交一条新的修复迁移。
4. 若新 Web 依赖尚未完成的迁移，先恢复兼容旧 schema 的 Web 版本，再做向前修复。
5. 回滚后重跑公开路由、Auth、收藏、RLS、SEO 和密钥冒烟，并记录数据库版本与 Web Deployment ID。

生产发布完成标准是公网冒烟全部通过；本地构建或 Vercel Preview 不能替代。
