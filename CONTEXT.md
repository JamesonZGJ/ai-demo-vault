# 当前进度

2026-08-03 已为生产站接通独立 Supabase 项目与真实账号注册：新项目只承载 AI Demo Vault，现有 migration 和首发目录已迁移；Vercel Production 只配置公开 URL 与 Publishable Key，没有 Service Role Key、数据库密码或本地环境文件。生产 Auth 已连接 QQ SMTP（`smtp.qq.com:587` + TLS），授权码只保存在 Supabase Auth 配置中；直连测试邮件发送成功，邮箱确认已重新开启。正式流程为“注册 → 检查邮箱 → 点击确认 → 账号创建成功 → 返回原目标页”，Supabase 回调固定为 `https://ai-demo-vault.vercel.app/auth/confirm`。本地 Blueprint seed 已通过生产开关关闭，匿名用户不可读。192 个单元测试、lint、TypeScript、60 页生产构建和生产数据库契约通过；等待提交部署后由用户用真实 QQ 邮箱完成最终收件确认。旧公网回归脚本仍有首页旧文案与固定 Analytics 路径两条过时断言，不能作为当前页面验收依据。

2026-08-03 已补齐《每天拆一个 AI 产品》第003期“流式聊天回复”的网站内容：新增自研 `Streaming Chat` Build Block、本地等待/生成/完成演示、逐段文字、自动滚动、中文源码说明、Cursor/Claude Prompt、参数、接入指南、许可证和免费公开 manifest。至此第001～017期均已同步到网站内容目录；189 个单元测试、17 条 Build Block / Launch E2E、lint、TypeScript 和无 Supabase 的 59 页生产构建通过。线上发布只包含网站源码和 Package，不包含登录状态、内容运营缓存、旁白音频或视频成片。

2026-08-03 已将公开网站统一调整为免费内容库：已有真实资料的 Build Block 显示“免费开放”，卡片和详情页不再展示 Mock 价格或购买按钮，主按钮直接定位源码、Prompt 和接入说明；未完成内容继续显示“准备中”。Bundle 和 Blueprint 已移除价格及 checkout 入口，旧 `/checkout/[slug]` 只重定向回 Blueprint 内容页；About、Library、License、Copyright、Demo 目录、登录页和页脚同步删除收费表达。未新增下载、支付、会员或权益功能，旧商业化数据结构未删除。

本轮新增免费开放状态单元测试和 Launch E2E 断言；3 个新增规则测试、186 个全量单元测试、lint、TypeScript、3 条 Launch E2E 和 58 页生产构建均通过。

2026-08-03 已完成《每天拆一个 AI 产品》第017期“AI 操作授权确认卡”：新增自研 `AI Action Approval Card` Build Block，清楚展示动作、影响对象和风险，并支持待确认、已允许、已拒绝、执行中、已完成和失败状态；允许只作用于当前请求，拒绝后立即终止。网站预览只运行本地状态模拟，不执行真实删除；中文 Package 已包含源码、Cursor/Claude Prompt、README、参数、接入指南、许可证和 manifest，¥9 仅为 Mock 展示价。

第017期已完成六句中文口播、逐句字幕、六幕分镜、44.29 秒有声版、无旁白字幕版、3:4 与 4:3 封面和平台内发布文案。旁白、字幕和画面来自同一份脚本；成片只讲动作范围、允许/拒绝分支和结果反馈，不出现工具、站点、下载、URL、二维码或站外行动。183 个单元测试、lint、TypeScript、本期 Chrome E2E、58 页零配置生产构建、六幕视觉抽帧和两版媒体检查均通过。

2026-08-03 已启动《每天拆一个 AI 产品》首次账号级 Cheat 汇总。`cheat-status` 显示现有 16 期尚未登记为 published/prediction，只有 3 个校准样本、无播放基线、无待复盘文件，抖音适配器也没有本地登录态，因此不能伪造正式 `cheat-retro`。已知第010期公开截图为 3,450 浏览、40 赞、34 收藏、3 评论，收藏/点赞比 85%，且评论集中询问 AI 工作台和工具栏；当前暂定主方向为 AI 原生交互和 AI 工作台组件，等待用户授权只读现有 Chrome 登录态或提供后台数据后完成全部作品复盘。

2026-08-03 已完成当天《每天拆一个 AI 产品》候选选题核实与评分，排除第001～016期并降低连续重复候选后，保留 AI 操作授权确认卡、AI 编程分屏调节、AI 实时预览浏览器、AI 语音状态波形和 AI 行内引用预览。首推第017期候选“AI 操作授权确认卡”（95分）；已核实官方 Demo、仓库热度、更新时间和许可证，当前只完成选题报告，等待确认后再制作，没有修改网站或下载第三方素材。

2026-08-02 已完成《每天拆一个 AI 产品》第016期“AI 思考过程面板”：新增自研 `AI Reasoning Panel` Build Block，支持等待、生成、完成、失败和手动查看状态，生成时展开、完成后延迟收起，用户手动操作后暂停自动关闭；页面明确只展示可公开的处理摘要，不展示模型私密思维链。中文 Package 已包含源码、Cursor/Claude Prompt、README、参数、接入指南、许可证和 manifest，¥9 仅为 Mock 展示价。

第016期已完成六句中文口播、逐句字幕、六幕分镜、44.57 秒有声版、无旁白字幕版、3:4 与 4:3 封面和平台内发布文案。旁白、字幕和画面关键词来自同一份脚本；成片只讲状态反馈、自动展开/收起和手动查看，不出现工具、站点、下载、URL、二维码或站外行动。

2026-08-02 当天其余候选为图片前后对比滑块、AI 工具调用状态卡、鼠标放大停靠栏和 AI 上下文用量表，继续保持待评估状态。

2026-08-01 已完成首页 Marketplace 视觉重构：参考 Uiverse 的“搜索优先、预览优先、轻量分类、密集卡片网格”，但没有复制其品牌、文案或组件资产。首页改为浅色单列 Hero、中文大搜索、横向分类筛选、6 个精选与 6 个最新模块；公共商品卡为不同能力生成独立缩略预览，并保留真实状态、展示价格和详情路径。导航同步收紧为轻量工具型样式，数据、支付、账号和详情页技术结构未改变。

本轮 lint、TypeScript、176 个单元测试、3 条 Launch E2E 和 55 页零配置生产构建全部通过；桌面端与 390px 移动端截图已人工检查，无阻塞级无障碍问题或横向溢出。

2026-08-01 已完成《每天拆一个 AI 产品》第015期“卡片变形弹窗”：新增自研 `Morphing Dialog` Build Block，记录源卡片矩形并过渡到居中目标矩形，关闭时沿原路径返回。组件支持遮罩、焦点循环、Esc、点按外部、滚动锁定、焦点恢复、响应式和减少动画；中文 Package 已包含源码、Cursor/Claude Prompt、README、参数、接入指南、许可证和 manifest，¥9 仅为 Mock 展示价。

第015期已完成六句中文口播、逐句字幕、六幕分镜、44.54 秒有声版、无旁白字幕版、3:4 与 4:3 封面和平台内发布文案。旁白、字幕和画面关键词来自同一份脚本；成片只讲视觉对应、源/目标矩形、连续变形、焦点与关闭路径，不出现工具、站点、下载、URL、二维码或站外行动。

2026-08-01 当天候选中的第015期“卡片变形弹窗”已完成；其余候选为图片前后对比滑块、鼠标放大停靠栏、AI 思考过程面板和数据滚动计数器，继续保持待评估状态。

2026-08-01 已完成《每天拆一个 AI 产品》第014期“圆形主题切换”：新增自研 `Circular Theme Reveal` Build Block，按按钮中心计算动画原点，以到容器最远角的距离作为最终半径，并通过覆盖层与 Web Animations API 完成圆形揭示。组件支持双向切换、键盘操作、重复触发保护和减少动画偏好；中文 Package 已包含源码、Cursor/Claude Prompt、README、参数、接入指南、许可证和 manifest，¥6 仅为 Mock 展示价。

第014期已完成六句中文口播、逐句字幕、六幕分镜、44.65 秒有声版、无旁白字幕版、3:4 与 4:3 封面和平台内发布文案。旁白、字幕和画面关键词来自同一份脚本；成片只讲点击原点、最远半径、切换顺序和减少动画，不出现工具、站点、下载、URL、二维码或站外行动。

2026-07-30 已完成《每天拆一个 AI 产品》第013期“文本选区工具栏”：新增自研 `Text Selection Toolbar` Build Block，支持真实文本选区、选区矩形定位、上下自动放置、左右边界限制、滚动/缩放更新和按下操作时保留选区。中文 Package 已包含源码、Cursor/Claude Prompt、README、参数、接入指南、许可证和 manifest；在线预览只模拟改写/精简/解释的交互结果，不调用模型，¥9 仅为 Mock 展示价。

第013期已完成六句中文口播、逐句字幕、六幕分镜、44.9 秒有声版、无旁白字幕版、3:4 与 4:3 封面和平台内发布文案。旁白、字幕和画面关键词来自同一份脚本；视频只讲选区、定位、边界和失焦处理，不出现工具、站点、下载、URL、二维码或站外行动。

2026-07-29 已完成《每天拆一个 AI 产品》第012期“图片桌宠”：新增自研 `Image Desktop Pet` Build Block，支持本地 PNG/JPG/WebP 载入、Pointer Events 拖拽、边界限制、键盘移动、窗口变化重算和轻微待机呼吸。中文 Package 已包含源码、Cursor/Claude Prompt、README、参数、接入指南、许可证和 manifest；页面明确说明透明图片效果最好，不伪造通用自动抠图能力，¥9 仅为 Mock 展示价。

第012期已完成六句中文口播、逐句字幕、六幕分镜、44.6 秒有声版、无旁白字幕版、3:4 与 4:3 封面和平台内发布文案。视频画面只讲透明轮廓、拖拽、边界和待机动作，不出现工具、站点、下载、URL、二维码或站外行动。

2026-07-27 已完成《每天拆一个 AI 产品》第011期“堆叠通知”：新增自研 `Toast Stack` Build Block，支持新增、折叠、展开、关闭、连续补位、状态类型、进度条、ARIA Live Region 和 360px 响应式预览。中文 Package 已包含源码、Cursor/Claude Prompt、README、参数、接入指南、许可证和 manifest；¥6 仅为 Mock 展示价，支付、购买成功和下载均未开放。

第011期已完成六句中文口播、逐句字幕、六幕分镜、42.9 秒有声版、纯字幕版、3:4 与 4:3 封面和平台内发布文案。旁白使用 HyperFrames 分段生成，Remotion 按真实音频边界编排；视频画面不出现工具、站点、下载、URL、二维码或站外行动。

2026-07-27 已完成《每天拆一个 AI 产品》第008～010期：

- 第008期“骨架屏加载”：新增 `Skeleton Loader` Build Block，支持结构占位、确定性行宽、流光、减少动画和真实内容原位替换。
- 第009期“智能聊天输入框”：新增 `Prompt Composer` Build Block，支持自动增高、附件、Enter 发送、Shift + Enter 换行、输入法组合保护和发送/停止状态。
- 第010期“可折叠侧边栏”：新增 `Collapsible Sidebar` Build Block，支持完整导航、图标导航、当前项、移动抽屉和 Escape 关闭。

三项能力均已同步中文在线预览、源码、Cursor/Claude Prompt、README、参数、Integration Guide、License 和 manifest；价格继续明确为 Mock，支付、购买成功和下载仍未开放。

三期视频均完成中文口播、逐句字幕、六幕分镜、有声版、纯字幕版、3:4 与 4:3 封面和平台内发布文案。HyperFrames 使用同一中文音色按六段生成旁白，Remotion 按真实音频边界编排：第008期 43.84 秒，第009期 44.89 秒，第010期 44.76 秒。口播与字幕逐字一致，视频内不出现工具、站点、下载、URL、二维码或站外行动。

2026-07-26 已完成《每天拆一个 AI 产品》第007期“拖拽排序列表”：新增自研 `Sortable List` Build Block、中文在线预览、Pointer Events 拖动、槽位中心碰撞判断、FLIP 让位动画、松手确认、上下按钮、方向键、响应式布局、源码、Prompt、README、参数、接入指南和许可证；价格仍为展示策略，支付和下载未开放。

第007期已完成中文口播、逐句字幕、43 秒竖屏分镜、有声版、纯字幕版、3:4 与 4:3 封面和平台内发布文案。HyperFrames 生成六段中文旁白，实测 42.97 秒；Remotion 使用同一版文本与真实音频边界编排六幕，视频内不出现工具、站点、下载、URL、二维码或站外行动。

2026-07-24 已完成《每天拆一个 AI 产品》第006期“智能文件上传区”：新增自研 `File Upload Dropzone` Build Block、中文在线预览、文件类型/大小/数量校验、拖拽/点击/键盘输入、处理进度、完成反馈、源码、Prompt、README、参数、接入指南和许可证；在线预览只在浏览器本地模拟进度，不会上传文件，价格为展示策略，支付和下载仍未开放。

第006期已完成中文口播、逐句字幕、42 秒竖屏分镜、3:4 与 4:3 封面和平台内发布文案。视频采用“效果先出现”的新结构，四种状态为默认、拖入、处理中和完成；HyperFrames 生成六段中文旁白，Remotion 按 41.45 秒真实音频边界编排，口播与字幕逐字一致，画面不出现工具、站点或站外行动。

2026-07-24 已完成《每天拆一个 AI 产品》第005期“命令面板”：新增自研 `Command Palette` Build Block、中文在线预览、即时过滤、结果分组、鼠标与键盘选择、回车执行、退出关闭、源码、Prompt、README、参数、接入指南、许可证和来源边界；商品页为展示价格 ¥9，支付与下载仍未开放。

第005期已完成中文口播、逐句字幕、45 秒竖屏分镜、3:4 封面和平台内发布文案。HyperFrames 生成六段中文旁白，Remotion 按真实音频边界渲染有声版与纯字幕版；视频内不出现工具、站点、下载、URL、二维码或站外 CTA。

2026-07-23 已完成《每天拆一个 AI 产品》第004期“连接光束”：新增自研 `Connection Beam` Build Block、中文在线预览、源码、Prompt、README、参数、接入指南、许可证和来源边界；网站可调速度、弯曲和方向，节点或容器变化时使用 `ResizeObserver` 重算 SVG 贝塞尔路径。

第004期视频已完成中文口播、字幕、分镜、封面和平台内文案。旁白使用现有中文音色生成，实际时长 41.47 秒；六段字幕和画面根据真实停顿重新校准。Remotion 已导出 42 秒有声版和纯字幕版，关键帧检查通过，视频内不出现工具、站点、下载、URL、二维码或站外 CTA。

2026-07-21 已完成《每天拆一个 AI 产品》平台内容优先重做：新增 `video/ai-demo-vault-intro/SERIES_TEMPLATE.md`，更新 DESIGN、素材清单、栏目 README，并把第001期“玻璃拟态卡片”和第002期“玻璃光斑卡片”统一改为设计拆解/交互分析/重新实现/平台内评论 CTA。两期旁白、字幕、封面和 Remotion 成片已重新生成；视频内不出现工具、站点、下载、外链、URL、二维码或站外行动。

2026-07-21 已用 Remotion 重新导出四条 42 秒竖屏 MP4，抽帧检查通过；第001期旁白重新生成并压到 42 秒内，第002期旁白重新生成。网站代码未修改。

旧的产品介绍视频不再注册为可渲染 composition，Remotion 工程默认只保留两期平台内容，避免误把站外宣传片当成栏目成片。

2026-07-21 已将视频口径同步到网站：首页、搜索页、能力模块卡片、`/explore/[slug]` 详情页、预览控件、资产状态、导航和页脚改为中文优先；英文只保留 Glass Surface、Magic Card、React、CSS 等内部或技术名称。第001期和第002期内容说明也补充了中文模块信息、交付状态和接入指引。

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

- 第015期 2 个矩形单元测试、TypeScript、lint 和 1 条 Chrome E2E 通过：打开、Esc 关闭、焦点恢复和 360px 移动端无横向溢出。
- 第015期两条 Remotion 成片均为 1080 × 1920、30fps、44.54 秒；有声版含 AAC 旁白，无旁白字幕版音轨为 -91 dB 静音，六幕抽帧与两种封面检查通过。
- 178 个单元测试通过；标准 `pnpm build` 成功生成 56 个静态页面进度项。
- 第014期 3 个单元测试、TypeScript、lint 和 1 条 Chrome E2E 通过：双向主题切换、按钮语义和 360px 移动端无横向溢出。
- 第014期两条 Remotion 成片均为 1080 × 1920、30fps、44.65 秒；有声版含 AAC 旁白，无旁白字幕版音轨为 -91 dB 静音，六幕抽帧与两种封面检查通过。
- 176 个单元测试通过；标准 `pnpm build` 成功生成 55 个静态页面进度项。

- 第013期 TypeScript、lint、3 个定位单元测试和 1 条 Chrome E2E 通过：选区显示/隐藏、操作反馈，以及 360px 移动端无横向溢出。
- 第013期两条 Remotion 成片均为 1080 × 1920、30fps、44.9 秒；有声版含 AAC 旁白，无旁白版不含旁白，六幕抽帧与两种封面检查通过。
- 173 个单元测试通过；标准 `pnpm build` 成功生成 54 个静态页面进度项。
- 第012期 3 个单元测试、TypeScript、lint 和 1 条 Chrome E2E 已通过：图片载入说明、拖拽、重置、键盘提示和 360px 移动端无横向溢出。
- 第012期两条 Remotion 成片均为 1080 × 1920、30fps、44.6 秒；有声版旁白正常，无旁白版音轨静音，六幕抽帧与两种封面检查通过。
- 第011期 1 条 Chrome E2E 通过：通知新增、展开、关闭、连续补位，以及 360px 移动端无横向溢出。
- 第011期两条 Remotion 成片均为 1080 × 1920、30fps、42.9 秒；有声版旁白正常，纯字幕版音轨静音，六幕抽帧与两种封面检查通过。
- 第008～010期 3 条 Chrome E2E 通过：骨架屏内容切换、智能聊天输入框附件/键盘/停止状态、侧边栏桌面折叠/移动抽屉/Escape，以及 360px 移动端无横向溢出。
- 第008～010期六条 Remotion 成片均为 1080 × 1920、30fps，三条有声版均有旁白音轨；三期逐句文本、字幕边界和旁白边界完全一致。
- 第008～010期 18 张逐幕抽帧、6 张封面和 Remotion TypeScript 检查通过。
- 第007期拖拽排序列表的真实指针拖动、按钮、方向键和 360px 移动端无溢出 E2E 通过。
- 第006期智能文件上传区的文件选择、进度、完成、重置和 360px 移动端无溢出 E2E 通过。
- 第005期命令面板桌面搜索、键盘执行、关闭和 360px 移动端无溢出 E2E 通过。
- 3 条 Chrome Launch E2E（首页、搜索、商品详情、移动端、SEO/404）通过。
- TypeScript、lint、零配置 `pnpm build`（53 个静态生成页面进度项）通过。
- 第005期两个 Remotion composition、TypeScript、六幕抽帧、视频音轨、1080 × 1920 分辨率和 45.056 秒时长通过。
- 第006期两个 Remotion composition、TypeScript、六幕抽帧、两种封面、视频音轨、1080 × 1920 分辨率和 42.048 秒时长通过。
- 第007期两个 Remotion composition、TypeScript、六幕抽帧、两种封面、视频音轨、1080 × 1920 分辨率和 43.051 秒时长通过。
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

## 2026-07-22（cheat-init）

- 已为短视频教程/Builder内容初始化 `cheat-on-content` v0评分脚手架：日更、校准样本估值3条、Notion候选池、抖音自动复盘待适配器完成、对标账号待补充。
- 已创建 `.cheat-state.json`、`rubric_notes.md`、`rubric-memo.md`、`script_patterns.md`、`WORKFLOW.md`、`STATUS.md`、`benchmark.md` 及 `predictions/`、`videos/`、`samples/`目录。
- Playwright已安装（v1.61.0），Chromium首次下载曾超时但随后已完成，已验证可启动；hook文件已复制但本机缺少 `jq`，预测锁和SessionStart状态报告未验证生效，state中的 `hooks_installed` 保持 `false`。
- 已将 `rubric_notes.md` 从观点视频 v0 替换为技术拆解 v0，采用 HK / VP / BD / RU / TC / CL / SE 七个等权维度，服务《每天拆一个 AI 产品》连续100期内容。

## 2026-07-22

- 只修正第002期：字幕逐句对应旁白，画面参数标签与口播统一中文，片尾改为口播中的评论区引导；第001期未修改。
- 已重新渲染旁白版和字幕版，均为 42.048 秒；TypeScript、抽帧检查和 `git diff --check` 通过。

## 2026-07-22（第003期）

- 已确认并制作第003期《流式聊天回复》：新增中文口播、字幕、分镜、来源分析、封面和平台内文案。
- Remotion 新增两个第003期合成，旁白版和字幕版均已渲染为 42.048 秒；旁白实际时长 41.045 秒。
- 本期只展示自制聊天界面和流式状态，不修改网站，不出现工具名、站点名、URL、二维码或站外 CTA。
# 2026-08-01 Galaxy / Uiverse 结构级 UI 重构

- 已审计 Uiverse 首页、目录、详情、搜索、分类、卡片、作者/收藏与移动端，并在 `reports/uiverse-audit/AUDIT.md` 记录布局参数、对应关系和版权边界。
- 首页改为短 Hero + 大搜索 + 横向 AI 能力分类 + 真实 Demo 高密度网格；目录改为 210px 分类栏、即时筛选和 4～5 列网格；详情改为 Preview/真实源码 58:42 同屏工作台。
- 新增统一 Design Tokens、AI 能力分类和双语检索、本地真实 Package 文件读取、源码/Prompt 标签面板；没有的框架、热度、支付和下载不显示为已提供。
- 360/390/430px 使用横向分类、单列预览和纵向详情工作台；修复命令面板初次挂载导致窄屏自动滚动的问题。
- 当前仅本地预览，未提交、未推送、未发布。预览地址：`http://localhost:3000`。
- 验证：lint、TypeScript、176 个单元测试、3 条 Launch E2E 和 55 项静态页面构建进度通过。

## 2026-08-03（抖音内容汇总）

- 已启动《每天拆一个 AI 产品》系列的首次账号级 Cheat 汇总；现有作品尚未登记到 Cheat 的 publish/predict 流程，抖音适配器也没有本地登录态。
- 用户已授权并完成项目本地 `.auth` 抖音只读登录；会话已被 `.gitignore` 排除，未读取或输出 Cookie 值。
- 已读取 17 条作品，其中 16 条有效、1 条为 0 播放重复上传；有效作品共 41,134 播放，播放中位数 1,994，收藏率 1.34%。
- 数据显示“完整产品结果”和“高频产品交互”显著高于脱离场景的抽象能力，后续方向确定为“产品场景做入口，Build Block 做内容”。完整报告见 `DOUYIN_CONTENT_REVIEW.md`。
- 当前抖音详细留存与评论管理接口已变化，未获取完播率和 3 秒留存；公开评论页只读拿到第010期两条评论，均在追问完整 AI 工作台或周边工具栏。

## 2026-08-03（当前选题方向复核）

- 结合账号实绩与当日公开趋势，当前最值得持续验证的是“AI 原生工作台 / AI 同事 / 跨应用执行”，其次是“带语音、记忆和行动能力的 AI 陪伴角色”；两者都应以完整产品结果开场，再拆一个 Build Block。
- 当前仓库最新只到第016期《AI 思考过程面板》，没有第017期脚本或选题记录，需用户补充第017期名称后才能做精确去留判断。
- 每日自动任务的执行时间无需改变，但选题逻辑需要从“泛 UI 动效候选”改成“产品场景优先”：完整结果 40%、高频交互 40%、底层能力 20%；纯组件必须先找到具体产品语境。
- 抖音公开关键词搜索触发验证码，未取得可核实的全站搜索数据，因此没有引用或猜测抖音全站播放量；国内判断只使用本账号创作者中心实绩和可核实的 B 站公开页面。
