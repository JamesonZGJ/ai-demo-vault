# Launch Version Checklist

## 已完成（本地可演示）

- [x] 首页第一入口是搜索
- [x] 热门搜索词：Glass、Hover、Loading、Card、Game UI、Chat UI、Color Picker、Agent
- [x] 开发者分类与技术栈筛选
- [x] 精选 Capability、最新 Capability、真实热度空状态
- [x] Capability Preview：Color Extraction、Glass Surface、Card Highlight
- [x] Capability Package 详情：用途、问题、技术栈、源码状态、Prompt、README、参数、Integration Guide、Package 状态
- [x] Color Extraction 自研 Package 资产：源码、Cursor Prompt、Claude Prompt、README、参数、Integration Guide、manifest
- [x] My Library 空状态；没有权益时不显示已拥有或 Download
- [x] Bundle 规划页
- [x] App Blueprint 放在首页最后，并保留旧本地预览路由
- [x] 移动端 360/768/1440px 无横向溢出
- [x] 404、About、License、Copyright、Privacy
- [x] Title、description、Open Graph、favicon、sitemap、robots
- [x] 真实状态边界：无支付不显示购买成功，无下载不显示 Download，无热度不显示排行榜

## 验证结果

- `pnpm lint`：通过
- `pnpm typecheck`：通过
- `pnpm test:unit`：142 个通过
- Launch E2E：3 条通过（Chrome）
- `pnpm build:local`：45 页构建通过
- 无 Supabase Mock Mode：无 `APP_DEPLOYMENT_TIER`，仅带 Vercel Preview origin，43 个路由构建通过
- Lighthouse 本地采样：Accessibility 100、Best Practices 100、CLS 0；Performance 59、SEO 66。该采样使用本地开发环境且首页带 `noindex`，不能当作公网评分。

## 公网发布前仍需完成

- [ ] 配置生产 Supabase URL 和 Publishable Key
- [ ] 配置正式 HTTPS 域名和 `NEXT_PUBLIC_SITE_URL`
- [ ] 建立首个 Git commit，绑定迁移和构建证据
- [ ] 配置 Vercel 项目和部署凭据
- [ ] 生产部署后检查 `/`、`/explore`、Capability 详情、`/about`、`/license`、`/copyright`、`/privacy`、`/robots.txt`、`/sitemap.xml`
- [ ] 生产环境确认不启用 local Blueprint pilot
- [ ] 公网 Lighthouse 使用 production build 重跑
- [ ] 再决定是否接入真实支付和 Package 私有下载

当前公开预览地址：`http://localhost:3000`。由于生产 Supabase、正式域名和 Vercel 凭据尚未配置，本轮没有声称已经部署到公网。

## Vercel Preview 操作

1. 在 Vercel 导入 GitHub 仓库或使用 CLI 连接本地目录。
2. `APP_DEPLOYMENT_TIER=preview` 可选；即使不设置，只要缺少 Supabase 配置也会自动进入 Mock Mode。
3. 不设置本地 Supabase URL，不填占位密钥，不填任何 Service Role Key。
4. 使用 `pnpm install --frozen-lockfile` 安装，构建命令使用 `pnpm build`。
5. 部署后验收 `/`、`/explore`、`/explore/color-extraction`、`/bundles`、`/library`、法律页、`/robots.txt`、`/sitemap.xml` 和随机 404。
6. Preview URL 稳定后，再决定是否配置正式 Supabase 和 Production 环境变量。
