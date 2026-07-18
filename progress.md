# 进度记录

## 2026-07-16

| 项目 | 结果 |
|---|---|
| 工作区审计 | 根目录没有可复用 Web 工程；未创建分支或 worktree |
| 本机环境 | Node 24.14.0、pnpm 11.7.0、Git 2.53.0 可用 |
| 竞品与来源 | 已核对 Vercel、Lovable、Framer、Product Hunt、Hugging Face、v0 官方页面 |
| 技术方案 | 收敛为 Next.js + Supabase + Vercel，不增加 ORM/CMS/独立后端 |
| 首批案例 | 最终 12 项首发清单覆盖 10 类，另有 1 个自有原型草稿 |
| ColorSnap | 首版保持草稿；当前无 AI、后端、用户或付费验证，名称有同类商标风险 |
| OpenSpec | 已生成 config、proposal、design、tasks 和四组 delta specs；1.6.0 strict 校验通过 |
| UI 与内容规范 | 已完成页面路由、响应式、无障碍、四项创业改造、图片/GIF/视频、编辑和发布规则 |
| 完整路线 | 已把 100 个案例、双语、20 个 Blueprint、单品/会员/Pro、三类支付、五维评分和社区拆为 21 个有依赖和验收门槛的后续 change |
| 提案阶段首发复核 | 当时先用 Wan2.2 与 Jasper 收口 12 项事实清单；进入 apply 后又按真实媒体权属重新替换，见下方当前记录 |
| Review | 已修正运行时管理密钥、RLS、发布谓词、收藏计数、真实性分层、主张引用、登录回跳和不可验收描述 |
| 第二轮 Review | 已修正“单次收藏即热门”、来源平台/发布方地区混用、商业阶段验收、工具与评分必填冲突、缺生产部署验收 |
| 首发提案复核 | 已修正运行时权限、真实性、来源、收藏、生产部署等问题；OpenSpec strict 通过 |
| 来源注册表 | 已覆盖用户点名的 22 个国内外发现渠道；自动化分为官方 API、条件 API、商业授权后 API 和人工二验 |
| 第二批内容 | 已核验 18 项，与首发 12 项组成 30 项候选池；0 项新增发布，未用数量替代质量门槛 |
| 第二批独立复核 | 已修正 6 处失效或误导入口，以及 Inspo Canvas 地区、FLUX 地区证据、Figma 代码证据、状态枚举 4 个一致性问题 |
| 完整目标审计 | 已建立 G01–G25 终局验收矩阵；明确候选、本地构建、沙箱支付和单个 Blueprint 都不能冒充完整完成 |
| 商业化契约 | 已统一八类交付物、商品、价格、订单、权益、下载、订阅、退款、支付、咨询和客户许可的未来基础规范 |
| 主体与媒体复核 | 12 个首发案例逐项补齐发布主体、角色、地区和一手证据；真实产品展示媒体成为强制发布门槛 |
| 最终校验 | 内容与文档一致性检查 26 通过、0 失败；OpenSpec 1.6.0 strict 通过 |
| 第一性原理精简 | 先做 100 个可信免费案例，再用自有 Blueprint #001 验证真实交易，成立后才复制到其余 19 个 |
| Apply 确认 | 用户已明确回复“确认提案，进入 apply” |
| 工程实现 | Next.js 16 公开页面、账号、收藏、SEO、隐私统计和响应式 UI 已落地 |
| 数据库实现 | 表、发布门禁、RLS、搜索、显式收藏、并发计数和 PGlite 可重复验证脚本已落地 |
| 首发替换 | 用 CogVideoX、PPTAgent、Open Notebook、Postiz、OpenGame、MaxKB 替换素材或闭源边界较弱的 6 个旧候选 |
| 首发内容 | 12 项覆盖 10 类；国内 4、海外 8；每项有完整拆解、四项创业改造、商业潜力与真实性边界 |
| 媒体与权属 | 12 张原创封面、12 份真实产品预览和 1 份 GIF 海报均有权属/来源/SHA-256 清单，文件哈希全部一致 |
| Seed 校验 | 完整迁移、基础 seed、内容 seed 和第二次重复 seed 在 PGlite 通过；12 项公开、24 份媒体、关系数量稳定，更新时间不虚假变化 |
| 自动测试 | 数据库 reset、103 项便携 pgTAP、106 项正式 pgTAP、数据库 lint、代码检查、TypeScript、106 个单元测试、10 条真实浏览器 E2E、生产构建和 OpenSpec strict 通过 |
| Review 修复 | 修正 8 条许可文本漂移、旧 pgTAP 全表断言、媒体使用依据/海报哈希缺口、seed 旧关系残留和大 GIF 首屏加载 |
| 收口 Review | 修正生产空目录、移动端原图、收藏假更新时间、GIF 无响应、pgTAP 夹具、流式 307 与极大页码溢出 |
| 公开验收 Review | 补齐四种排序、真实 404/noindex、统计只在成功公开页挂载、媒体预水合失败/重试/GIF 停止/视频字幕、移动端对话框/键盘/跳转焦点和收藏局部错误 |
| 发布安全 | 增加生产 HTTPS/公开密钥校验、干净提交与迁移镜像前置检查、客户端密钥扫描、只读生产数据库校验和外部 HTTPS 公网 E2E |
| 可信内容收口 | 卡片改用真实产品预览；11 个详情区块各有主要主张，正文、标签和来源同源；ColorSnap 明示非 AI 与闭源草稿边界 |
| 发布闸门收口 | 拒绝 localhost 与私网/保留 IP 字面量，生产 URL 精确绑定 Supabase Project Ref，预检绑定完整 commit 并输出构建、锁文件和迁移哈希；Vercel CLI 固定为 56.2.1 |
| 发布闸门验证 | `release:preflight` 在补入占位生产公开变量后，按设计拒绝没有 `HEAD` 的仓库；未越过提交基线继续构建或部署 |
| 本地全量验证 | PostgreSQL 镜像已就绪；Supabase reset、真实并发、Mailpit 注册确认、收藏刷新/取消/隔离与 360/768/1440px 浏览器流程通过 |
| 当日阻断 | 父仓库没有首个提交且项目全部未跟踪；另无生产 Supabase/Vercel、最终域名和自有 SMTP，不能形成可回滚部署或执行公网冒烟 |
| 当日状态 | 本地 `launch-curated-mvp` 已完整通过，等待生产配置后部署；尚未归档 change |

## 2026-07-17 Marketplace apply

| 项目 | 结果 |
|---|---|
| 产品定位 | 全站改为 AI Product Blueprint Marketplace；Demo 是免费入口，Blueprint 是核心商品 |
| ColorSnap #001 | 本地完成 Demo → 商品页 → 登录 → 模拟获取 → 本人资料库闭环 |
| 商品详情 | 增加 12 个公开决策区块；获取后提供 7 类编辑资料样品 |
| 商业边界 | 正式价格、订单、支付、收入、会员、客户许可和下载均未实现 |
| 安全 Review | 增加本机 HTTP origin 双校验、状态/定价组合约束、撤下后资料失效、生产开关精确 false 验证 |
| 真实性 Review | 用户/收入/Figma/价格文案改为可证明范围，不把提交材料缺失写成全局事实 |
| 最终分项验证 | 148 项便携 pgTAP、161 项正式 pgTAP、134 项单元测试、12 条 Chrome E2E（含样品下载）、lint 0、typecheck 和 27 页 build 通过 |
| OpenSpec | strict 固定 CLI 复验仍待明确允许执行第三方包 |

## 2026-07-17

| 项目 | 结果 |
|---|---|
| 仓库决定 | 用户选择独立仓库；已在 `ai-demo-vault` 初始化 `main` 并完成提交前暂存，未创建 worktree 或额外分支；本机未配置 Git 作者姓名/邮箱，首个提交等待用户提供身份 |
| 终审修复 | 真实性边界正文改为直接读取主要主张；开源证据必须与非镜像规范仓库同 URL |
| 数据库并发 | 所有发布依赖子表写入先锁父案例；独立 dblink 测试证明并发删除最后仓库时后提交事务失败 |
| Seed 幂等 | 指纹未变化时不再重建关系；测试比较关系 UUID、`created_at`、工具关系与案例更新时间 |
| 生产库合同 | 新增 `launch-curated-mvp-v1` 只读 RPC；生产验收直接核对 12 个源码状态、132 条主要主张和 11 个区块 |
| 密钥检查 | 公开变量名检查不区分大小写并覆盖 `SERVICE_KEY`；构建扫描能识别 legacy `service_role` JWT |
| 本地验证入口 | `pnpm verify` 与 `build:local` 自动读取 Supabase Local，只向子进程注入公开密钥和 Mailpit URL，不创建 `.env.local` |
| 自动测试 | 基础层当时通过；Marketplace apply 后最终分项为 148 项便携 pgTAP、161 项正式 pgTAP、134 个单元测试、12 条真实 Chrome E2E 和 27 页生产构建 |
| OpenSpec | 上一版 strict 已通过；最终数据库/发布合同增量因安全策略要求用户明确允许固定第三方包，尚未复验 |
| 当前阻断 | 首个提交缺 Git 作者身份；另无生产 Supabase/Vercel、最终域名和自有 SMTP，不能执行生产迁移、公网冒烟或归档 change；最终 OpenSpec strict 复验还需用户允许固定第三方包执行 |
| 文档真相复核 | 修正首批内容池仍写 0 项发布就绪和首发清单旧测试数的问题；明确 `pnpm verify` 不会暗中清空本地数据库 |
| 公网浏览器配置 | 生产 Playwright 支持显式 `PLAYWRIGHT_CHANNEL=chrome`，本机已有 Chrome 时不强制下载 Chromium；生产校验边界不变 |
| 产品重新定位 | 用户确认目标不是单纯 Demo 展示站，而是 Blueprint 交易平台；Demo 降为免费获客与信任入口 |
| 信息架构审计 | 初始审计确认只有 Demo 目录/详情、账号和收藏；该结论推动了后续 Blueprint 本地商品闭环改造 |
| 目标 IA | 新增 `MARKETPLACE_IA.md`，固定首页/导航主次、页面树、Demo→Blueprint 转化、商品详情 12 区块和状态化 CTA |
| 商业边界 | Demo、Blueprint、Entitlement 独立；首阶段为本站自营精选商店，不做第三方卖家、分账或提现 |
| 商业契约补强 | 增加 Blueprint、Demo 关系、Offer 资源、结账会话、不可变支付交易、争议、订阅账期、下载授权和对账对象及服务端边界 |
| 路线调整 | Blueprint #001 的真实购买、授权、下载、退款和对账提前；Demo 12→100 改为并行内容流 |
| 新 OpenSpec | `reframe-blueprint-marketplace-ia` 已按用户确认 apply；`simulate-colorsnap-preview-acquisition` 继续记录 ColorSnap 本地试用闭环 |
| 重新定位独立 Review | 两名独立 Reviewer 最终通过；已修正 apply 范围、预发布/生产闸门、逐文件包证据、Offer/Policy 版本、多轴销售状态、支付冲突、会员额度和 1/20 包验收边界 |
| 审计报告 | 交互式 `AI Blueprint 交易平台信息架构审计` 已通过 artifact 校验并渲染；只使用页面族审计数据，不伪造访问、转化或收入 |

## 2026-07-18 Marketplace MVP 打磨

| 项目 | 结果 |
|---|---|
| 首页 | 使用 “Build your next AI product in days, not months.”；Featured/Popular/Latest/Categories、搜索和 Blueprint Score 已落地 |
| ColorSnap 商品页 | 新增 Market Opportunity、用户画像、商业模式、技术栈、Blueprint Score、Build Timeline、What's Included 和 Buy Blueprint |
| 购买后体验 | 资料页改为 Launch Dashboard，展示 8 个启动模块、下一步、时间线、Launch Checklist 和资料样品 |
| 数据 | 新增 `blueprint_score` 与 `build_timeline` migration；本地 seed 已用 UTF-8 重新执行，生产仍默认关闭 |
| 验证 | 148 项便携 pgTAP、134 个单元测试、12 条 E2E、lint、typecheck 和 27 页本地构建通过 |
| 预览 | 开发服务器运行于 `http://localhost:3000`；不新增支付、会员、后台或第二个 Blueprint |

## 2026-07-18 AI Demo Marketplace 信息架构重定义

| 项目 | 结果 |
|---|---|
| 产品定位 | 从 Blueprint-first 改为 AI Demo Marketplace；可复用能力模块是主商品 |
| 商品层级 | Free Demo → Demo Product（¥1.9–9.9）→ Bundle；ColorSnap 保留为高级 App Blueprint |
| 详情交付 | 在线 Demo、源码、Cursor/Claude/AI Prompt、README、参数和复制说明成为模块商品核心 |
| 购买后 | 统一进入 My Demo Library；按商品版本展示复制、Prompt、源码、README 和参数 |
| 页面树 | `/explore` 为主目录，`/bundles` 和 `/blueprints` 为次级；旧 `/demos` 路径保留兼容映射 |
| 代码状态 | 本轮只同步信息架构文档；当前运行代码仍是 ColorSnap Blueprint-first MVP，等待后续 apply 迁移 |
| 范围 | 不新增第二个商品、支付、会员、后台或真实下载 |

## 2026-07-18 Capability Package 核心模型复核

| 项目 | 结果 |
|---|---|
| 产品本质 | 明确为收集、拆解、重构、售卖 Capability Package 的 Marketplace；不是 Product Hunt、Gumroad 或 Blueprint 商店 |
| 对象边界 | `Capability → DemoPreview → CapabilityPackage → My Library`；Bundle 和 App Blueprint 为组合/高级层 |
| 搜索 | 设为首页第一入口；按能力、同义词、技术栈、输入输出和使用场景检索，分类不再按行业组织 |
| 页面控制 | 保持 `/explore`、详情、Bundle、Blueprint、Library 等核心页面；分类与技术栈使用查询筛选，不继续扩张页面族 |
| ColorSnap | 拆出 11 个独立 Capability，全部先记为 `planned`；完整 Blueprint 通过 `blueprint_capabilities` 组合，不重复复制资产 |
| 商品门槛 | 必须有自研重实现源码、Prompt、README、参数、Integration Guide 和权利记录；否则只能免费 Preview |
| 代码状态 | 本轮没有修改 UI、运行代码、数据库、支付、会员或后台 |

## 2026-07-18 Launch Version 本地公开演示

| 项目 | 结果 |
|---|---|
| 首页 | 已改为搜索优先的 AI Demo Marketplace；包含热门搜索、开发者分类、精选/最新 Capability、真实热度空状态、Bundle 和末尾 Blueprint 入口 |
| 搜索与详情 | 新增 `/explore` 与 `/explore/[slug]`；支持关键词、分类、技术栈筛选，展示 Demo Preview、用途、技术栈、Package 资产状态和 Integration Guide |
| 首个 Package | Color Extraction 自研资产已加入 `packages/color-extraction`，包含源码、Cursor/Claude Prompt、README、参数、Integration Guide 和 manifest |
| Library | 新增 `/library` 空状态；无真实权益时不显示已拥有或 Download |
| 静态页 | 新增 About、License、Copyright；更新 Privacy、404、Open Graph、favicon、sitemap、robots |
| 验证 | lint、typecheck、135 个单元测试、3 条 Chrome Launch E2E、移动端 360/768/1440 宽度和 45 页本地构建通过 |
| 公开部署 | 尚未执行；缺生产 Supabase、正式域名、Vercel 凭据和首个 Git 提交，当前预览为 `http://localhost:3000` |
