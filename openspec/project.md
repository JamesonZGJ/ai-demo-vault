# Legacy project conventions mirror

OpenSpec 1.6.0 的有效配置是 `config.yaml`。本文件仅保留给人阅读；用户确认 apply 后由初始化流程处理，不能作为 CLI 配置来源。

- 产品文案使用中文，产品名和工具名保留官方写法。
- UI 为黑白极简、截图优先；不照搬 Linear、Product Hunt 或 Vercel 的具体页面。
- TypeScript 开启严格模式；不使用 `any` 绕过模型。
- 数据库变更只能通过版本化 SQL migration。
- 所有公开案例必须有来源、真实性等级、许可状态和核验日期。
- 所有数据库公开权限必须有 pgTAP 测试。
- 不创建分支或 worktree，除非用户明确同意。
- 不伪造用户数、收藏数、收入、排名或商业验证。
- 代码注释使用中文，只解释必要的业务约束。
- 每次 apply 后执行 Review 查 Bug，再做第一性原理精简，最后运行 `pnpm verify`。
- 目标产品是 AI Product Blueprint Marketplace；Demo 是免费发现层，Blueprint 是可售商品，Entitlement 是购买后权利。
- 首阶段只做本站自营精选 Blueprint；没有真实购买、授权、下载、退款和对账证据时，不得把公共站声明为可成交商城。
