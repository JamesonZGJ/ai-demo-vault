# Design

## Architecture

使用 Next.js App Router 直接读取 Supabase。公开页面由 Server Components 渲染；登录和收藏使用 Supabase SSR Auth、Server Actions 和 RLS。首版不建独立 API、ORM、CMS、全局状态库或外部搜索服务。

## Data model

| 表 | 关键字段与约束 |
|---|---|
| `categories` | `slug` 唯一、中文名、排序 |
| `tools` | `slug` 唯一、名称、官网 |
| `demos` | `slug` 唯一、状态、案例形态、实现成熟度、发布方地区、技术披露状态、难度、结构化拆解、四项创业改造、商业潜力判断、规则版本、真实收藏计数、主来源和封面发布字段 |
| `demo_tools` | 可选的已核验工具关系，`demo_id + tool_id` 复合主键；没有公开技术时关系可为零并保存 `not_disclosed` 状态 |
| `demo_publishers` | 发布方名称、地区、角色、官方证据 URL 和核验时间；角色区分开发方、服务运营方和合同主体，跨地区案例保存多条 |
| `demo_links` | 在线体验、仓库、文档等链接、来源平台、canonical/镜像标记及最后核验时间 |
| `demo_claims` | 事实/编辑推断/假设、所属详情区块、是否为唯一主要主张、文字、来源链接和核验时间 |
| `demo_media` | 角色（封面/产品展示/图库）、路径、类型、alt、版权方、许可、授权状态、来源 URL、内容哈希；抽象封面不能代替产品展示媒体 |
| `demo_evidence` | 开源、公开采用、公开定价、商业服务等可并存证据 |
| `favorites` | `user_id + demo_id` 复合主键，关联 `auth.users` |

`publisher_region` 只描述主发布方地区，允许 `mainland_china`、`international`、`mixed`、`unknown`；`mixed` 必须在 `demo_publishers` 逐个记录已核验主体，`unknown` 不能发布。来源平台另存于链接记录，例如 GitHub、ModelScope、官方站、帮助中心或其他官方入口，不能把平台所在地当发布方地区。实现成熟度只允许 `concept`、`interactive_prototype`、`working_demo`、`production_product`。源码状态单独使用 `open_source`、`closed_source`、`not_disclosed`；它不与案例形态、成熟度或素材许可混用。卡片难度是 `beginner`、`intermediate`、`advanced` 三档实现成本标签，不是后期五维评分。

`case_kind` 只允许 `product`、`open_source_project`、`model_demo`、`official_template`、`platform_workflow`、`embedded_feature`。它用于防止把仓库、模型 Demo、starter 模板、平台工作流或内嵌能力写成独立正式产品；开源许可、商业服务和定价仍作为独立证据。镜像仓库必须保存 `source_is_mirror=true` 与 canonical 上游链接，不能重复建案例。

发布基础字段由 `demos` 本表 `CHECK` 强约束：状态为 `published` 时，主来源类型、HTTPS URL、来源核验时间、可确认的发布方地区、非空真实性边界、已确认源码状态、原创/已授权封面、封面 alt、商业潜力分数、理由、规则版本和日期必须齐全。跨表门槛使用 `DEFERRABLE INITIALLY DEFERRED` 约束触发器，在事务提交前同时确认 11 个详情区块各有一条主要主张、开源证据与非镜像规范仓库指向同一 URL、至少一份 `demo_media.role=product_preview`、`status=approved` 的真实产品截图/GIF/视频；删除或降级关系时同样阻止留下不合格的已发布案例。所有影响这些门槛的子表写入先按案例锁定父行，使并发事务也不能分别删除最后两份依赖。抽象封面不能充当产品展示媒体；卡片与详情都读取真实产品展示。公开查询与 RLS 仍复用同一合格谓词。这样即使直接请求 Supabase API，也不能读到草稿、主张或源码证据不完整的内容、缺编辑判断内容或未授权素材。

首发内容同时保存于生产 migration 与本地 seed，两份文件必须字节一致。内容指纹覆盖案例及全部关系声明：指纹变化时重建该案例关系以收敛删除和修订；指纹未变化时完全跳过关系写入，保证公开关系 UUID、`created_at` 和案例 `updated_at` 严格幂等。

内容数据不创建 `profiles`。收藏计数由数据库触发器原子增减；触发函数使用 `SECURITY DEFINER`、空 `search_path` 和完整 schema 名，计数列有非负约束。数据库测试覆盖重复请求、删除、并发和按 `favorites` 重算一致性。

## Security

- `demos`、`demo_publishers`、`demo_links`、`demo_claims` 和 `demo_evidence` 只随合格的 `published` 父案例公开；`demo_media` 还要求授权状态为 `approved`。
- 内容增改不提供 Web 运行时入口，只通过受控数据库迁移执行；部署后的 Web 不持有 Service Role Key。
- `favorites` 的 select/delete 使用 `auth.uid() = user_id`；insert 同时用 `WITH CHECK` 校验本人和目标案例已公开；不开放 update。
- 任何管理密钥不得出现在 `NEXT_PUBLIC_*`、页面数据或日志。
- 登录相关路由不缓存，会话刷新按 Supabase 官方 `proxy.ts` 流程处理。

## Search

筛选状态写入 URL。搜索字段仅为名称、短句和摘要；分类、工具、难度和发布方地区单独筛选。每页固定 12 条，排序只允许 `newest`、`commercial-potential`、`most-favorited` 和 `editor-pick`。

SQL/RPC 使用 `SECURITY INVOKER`、空 `search_path`、完整 schema 名和静态参数化 SQL；排序值映射到固定表达式，禁止拼接动态 SQL。非法筛选值和非法页码由页面 307 重定向到移除非法项后的 canonical URL。数据量超过约 1000 条并有真实慢查询证据后，再评估 `pg_trgm`。

## Editorial integrity

- 每条案例必须有至少一个官方来源。
- `fact` 主张必须关联已核验来源；`editorial_inference` 和 `hypothesis` 必须显示对应标签，不能写成事实。
- 11 个详情区块各有且只有一条主要主张；九个拆解区块的标签、正文和来源读取同一条记录。
- `open_source` 必须同时有仓库和开源证据，`closed_source` 不得挂二者，`not_disclosed` 不能发布。
- 每个公开案例的商业潜力判断必须有分数、规则版本、理由、依据和日期；缺少任一项时不能发布。
- 素材授权状态不是 `approved` 时不能进入公开卡片或详情。
- 闭源产品不能宣称有可下载源码。
- ColorSnap 必须区分“已实现、模拟、未实现”。

## Authentication

首版使用邮箱 + 密码。注册后必须通过确认邮件激活；本地 E2E 使用 Supabase Local 的真实 Auth 与 Mailpit 邮件接口完成确认，不使用生产 Mock。生产发布前必须配置自有 SMTP 和精确回调域名白名单。

登录回跳参数只接受以单个 `/` 开头的站内相对路径；绝对 URL、`//`、反斜杠或解析失败值统一回到 `/`，防止开放重定向。

## Analytics

使用 Vercel Web Analytics 记录公开首页、案例库和详情页的匿名聚合 pageview、visitor 与 referrer。通过 `beforeSend` 排除登录、确认和个人收藏路径，并移除不需要的查询参数；不发送邮箱、用户 ID、收藏内容或令牌。收藏数量与账号行为只从 Supabase 业务数据计算，不把分析平台数据当收藏或商业验证。

上线前提供与实际数据处理一致的隐私说明。该分析只能证明访问与来源，不能证明长期留存；留存测量如有必要必须作为后续带隐私评审的 change。

## Production deployment

生产环境使用独立 Supabase 项目与 Vercel 项目。数据库迁移通过受控部署凭据执行，Web 运行时仍只有 URL 与 Publishable Key。发布前必须配置自有 SMTP、精确 Auth 回调白名单和唯一 canonical origin；有用户提供的自定义域名时使用该域名，否则使用已确认的 Vercel 生产域名。

线上冒烟必须覆盖真实确认邮件、登录、收藏、公开/私有路由、SEO、统计排除和密钥泄漏检查。生产数据库另以公开只读 RPC 返回版本化 schema contract；验收脚本同时直接核对 12 个源码状态和每案 11 个主要主张，不能只记录本地 migration 哈希。部署文档记录数据库与 Web 版本对应关系、迁移失败处理和回滚步骤；不能以本地测试代替生产冒烟。

## Routes

| 路由 | 实现目录 | 边界 |
|---|---|---|
| `/`、`/demos`、`/demos/[slug]`、`/privacy` | `app/(public)` | 公开；前三类发送匿名聚合页面统计，隐私页不发送 |
| `/login`、`/register` | `app/(auth)` | 游客账号流程；`noindex`；不发送分析事件 |
| `/auth/check-email`、`/auth/confirm` | `app/auth` | 邮件提示和回调；`noindex`；不发送分析事件 |
| `/favorites` | `app/(account)` | 登录用户；`noindex`；不发送分析事件 |

详情媒体必须包含至少一份已批准的真实产品截图、GIF 或视频。GIF 必须有静态封面；视频必须可暂停、默认无声，并为口述内容提供字幕或等价摘要。读取失败时显示真实错误，不使用未授权替代图；没有合格产品展示媒体的案例保持草稿。

## UI

- 黑白为主，单一强调色只用于交互状态。
- 首页重点展示大图案例和清晰的真实性标签，不堆装饰。
- 案例卡展示名称、分类、工具、难度、商业潜力编辑判断、成熟度和真实收藏数。
- 今日精选从编辑批准的 featured 案例池按香港日期做确定性轮换，同一天所有用户看到同一结果；它不代表热度。
- “收藏最多”仅在至少一个公开案例的真实收藏数大于 0 时出现，按收藏数降序并用发布时间与 slug 保证稳定并列顺序；它只描述站内收藏，不称为热度。
- 创业灵感编辑榜按明确的人工 `editor_pick_rank` 排序并标注“编辑榜单”，不宣称来自用户热度或综合算法。
- 详情页按“看产品 → 看证据 → 看拆解 → 看改造”排列。
- 创业改造固定为“改变谁、改变什么、改变场景、新机会假设”四项，不混入官方事实。
- 移动端保持筛选、收藏和主要操作可用；键盘和读屏器可访问。

## Known risks

| 风险 | 处理 |
|---|---|
| 第三方素材版权 | 人工核验；先制作原创封面，未批准不发布 |
| 主观判断被误解 | 页面显示“商业潜力·编辑判断”、规则版本和理由；完整五维评分后置 |
| 伪热门 | MVP 不使用“热门”命名；没有真实收藏前隐藏“收藏最多” |
| Supabase SSR API 变化 | 锁定依赖版本，使用官方示例并做登录 E2E |
| 中文搜索质量 | 先验证子串搜索，禁止无证据引入复杂搜索服务 |
| ColorSnap 名称与隐私 | 公开前更名/核查；排除浏览器 profile 和未授权图片 |
