# MVP 与 Blueprint 本地预览 UI 规格

> 本文件记录上一阶段已经实现的 Blueprint-first 首页、免费 Demo 入口，以及仅限本地的 ColorSnap Blueprint #001 预览闭环。新的 AI Demo Marketplace 目标结构以 `MARKETPLACE_IA.md` 为准；本轮只重思信息架构，没有修改 UI 或运行代码。真实价格、订单、支付、会员、客户权益和生产下载不在本轮。

## 1. 体验原则

| 原则 | 实施要求 |
|---|---|
| 商品优先 | 首页先讲 Featured Blueprint 的购买价值，免费 Demo 作为发现入口 |
| 证据优先 | 详情按“看机会 → 看产品 → 看 Blueprint → 看边界”排列 |
| 判断透明 | Blueprint Score 与 Market Opportunity 明确标注编辑估计，不冒充市场数据 |
| 不制造热度 | Popular/Latest 只有真实商品状态，不伪造销量、价格或热度 |
| 不猜技术 | 只显示已核验工具；未知时写“技术工具未公开” |
| 不暗示源码 | 闭源案例明确标注，不显示“下载源码”或禁用假按钮 |
| 素材合规 | 只显示 `approved` 素材；失败时显示文字状态，不换成未授权图片 |
| 原创风格 | 不复制 Product Hunt 投票、Linear 光晕、Vercel 标志或其具体卡片结构 |

## 2. 路由与权限

| 路由 | 页面 | 权限 | SEO/统计 |
|---|---|---|---|
| `/` | 首页 | 公开 | 可索引；统计匿名聚合访问 |
| `/demos` | 案例库 | 公开 | 可索引；统计匿名聚合访问 |
| `/demos/[slug]` | 案例详情 | 仅合格公开案例 | 可索引；统计匿名聚合访问 |
| `/blueprints` | Blueprint 预览目录 | 仅本地双闸门 | `noindex`；不发送分析事件 |
| `/blueprints/[slug]` | Blueprint 商品详情（评分、时间线、启动包） | 仅本地双闸门 | `noindex`；不发送分析事件 |
| `/checkout/[slug]` | 模拟获取确认 | 登录前可读，提交需登录 | `noindex`；不发送分析事件 |
| `/account/library` | 我的 Blueprint 资料库 | 登录用户；本地试用访问权 | `noindex`；不发送分析事件 |
| `/account/library/[slug]` | Launch Dashboard 与七类资料样品 | 访问权本人 | `noindex`；不发送分析事件 |
| `/account/library/[slug]/download` | Markdown 资料样品导出 | 访问权本人 | `noindex`；私有、不缓存 |
| `/login` | 登录 | 游客 | `noindex`；不发送分析事件 |
| `/register` | 注册 | 游客 | `noindex`；不发送分析事件 |
| `/auth/check-email` | 邮件确认提示 | 游客 | `noindex`；不发送分析事件 |
| `/auth/confirm` | 邮件确认回调 | 游客 | `noindex`；不发送分析事件 |
| `/favorites` | 我的收藏 | 登录用户 | `noindex`；不发送分析事件 |
| `/privacy` | 数据与隐私说明 | 公开 | 可索引；不发送分析事件 |
| 404 | 案例不存在或不可见 | 公开 | `noindex` |

全局页头在本地预览包含 Blueprint、免费 Demo、我的资料和账号状态；生产关闭 Blueprint 入口。360px 使用全屏导航抽屉。页脚只放产品定位、案例库、编辑规则、隐私说明和真实性声明，不显示未实现支付或会员功能。

## 3. Marketplace 首页

| 顺序 | 区块 | 内容与规则 |
|---|---|---|
| 1 | Hero | 固定主张 “Build your next AI product in days, not months.”；主按钮 Explore Featured Blueprint，次按钮 Preview a free Demo |
| 2 | Featured Blueprint | 大卡片展示 ColorSnap、Blueprint Score、7 launch assets 和商品入口 |
| 3 | Popular Blueprints | 只显示真实预览商品；单商品时明确显示首发样品，不伪造热度 |
| 4 | Latest Blueprint | 以商品更新时间展示最新一项，不重复制造商品数量 |
| 5 | Categories | AI Design、AI Video、AI Writing、AI Marketing、AI Learning、AI Productivity |
| 6 | Search | 搜索名称、短句和摘要，进入 `/blueprints?q=` |
| 7 | Free discovery | 低视觉权重导向 Demo，不把首页变成案例列表 |

Hero 固定文案：

> Build your next AI product in days, not months.<br>
> Founder-ready product blueprints with the thinking, prompts, UI, and launch plan to move from idea to first build.

编辑榜声明：

> 按编辑判断排序，不代表用户热度、市场验证或投资建议。

## 4. 案例库

页面顺序：标题 → 搜索 → 筛选 → 排序 → 已选条件 → 真实结果数 → 网格 → 分页。

```text
/demos?q=&category=&tool=&difficulty=&region=&sort=&page=
```

| 项目 | 规则 |
|---|---|
| 搜索 | 只搜名称、短句和摘要；可见标签与明确提交按钮 |
| 筛选 | 分类、开发工具、难度、发布方地区均为单选 |
| 排序 | 最新、商业潜力编辑判断、真实收藏数、编辑精选 |
| 分页 | 每页最多 12 条；不用无限滚动 |
| URL | 条件变化后页码回到 1；非法值 307 到清理后的 canonical URL |
| 手机筛选 | 全屏对话框；底部固定真实结果数与重置；关闭后焦点回触发按钮 |

发布方地区标签：`mainland_china`=中国大陆发布方，`international`=海外发布方，`mixed`=跨地区主体；`unknown` 不得公开。`beginner`=入门，`intermediate`=中等，`advanced`=进阶。GitHub、ModelScope、官网等显示为独立的“来源平台”，不混入地区筛选。

## 5. 案例卡

卡片容器使用 `article`，不是整卡按钮。封面和标题共用详情链接；收藏按钮为独立兄弟元素，禁止交互元素嵌套。

| 顺序 | 字段 | 规则 |
|---|---|---|
| 1 | 封面 | `16:10`，已批准素材与真实 alt |
| 2 | 分类/来源 | 主分类、发布方地区和来源平台分别显示；`international` 写“海外发布方”，不写“全球来源” |
| 3 | 名称/短句 | 各最多两行 |
| 4 | 工具 | 最多 2 个，剩余显示 `+N`；未知则显示未公开 |
| 5 | 成熟度 | 概念、可交互原型、真实 Demo、正式产品 |
| 6 | 难度 | 入门、中等、进阶 |
| 7 | 商业潜力 | `商业潜力·编辑判断 4/5`；公开卡必须显示，资料不全时案例保持草稿 |
| 8 | 收藏 | 数据库真实整数和独立收藏按钮；读取失败显示错误，不用 0 代替 |

收藏按钮状态：

- 未收藏：读屏名称“收藏《案例名》”。
- 已收藏：`aria-pressed="true"`，读屏名称“取消收藏《案例名》”。
- 提交中：禁用、显示“处理中”、`aria-busy="true"`。
- 游客：前往 `/login?returnTo={站内路径}`，不建立匿名收藏。
- 失败：恢复原状态与原计数，通过 live region 宣布“收藏失败，请重试”。

## 6. Demo 详情页

| 顺序 | 区块 | 内容 |
|---|---|---|
| 1 | 面包屑 | 首页 / 案例库 / 当前案例 |
| 2 | 产品 Hero | 分类、来源、成熟度、名称、短句、工具、难度 |
| 3 | 操作 | 已核验发布方、在线体验、仓库、最后核验日期和收藏 |
| 4 | 产品媒体 | 主封面，以及至少一份获准使用的真实产品截图、GIF 或视频；纯抽象封面不能代替产品展示 |
| 5 | 真实性与证据 | 开源、公开采用、公开定价、商业服务等可并存证据 |
| 6 | 实现边界 | 原型分别列“已实现”“模拟”“未实现” |
| 7 | 产品拆解 | 产品是什么、为什么成立、痛点、方案、用户、功能、AI 实现、技术、盈利 |
| 8 | 商业潜力 | 分数、理由、规则版本、日期和免责声明 |
| 9 | 创业改造 | 改变谁、改变什么、改变场景、形成什么新机会 |
| 10 | 来源 | 主来源、其他逐条引用和核验日期 |
| 11 | 页尾 | 返回案例库、收藏当前案例 |

创业改造必须是结构化内容：

| 字段 | 示例表达 |
|---|---|
| 改变谁 | 设计师 → 房地产客户 |
| 改变什么 | 家装 → 商业空间规划 |
| 改变场景 | 个人灵感 → 企业售前展示 |
| 新机会假设 | 面向地产销售的空间改造提案工具 |

内容标签：`fact`=有来源事实，`editorial_inference`=编辑推断，`hypothesis`=产品假设。

## 7. Blueprint 商品详情页

商品页首屏必须把购买判断放在资料长文之前：

| 顺序 | 区块 | 当前 ColorSnap 内容 |
|---|---|---|
| 1 | Hero | 产品名称、一句话机会假设、Demo 预览、Buy Blueprint |
| 2 | Market Opportunity | 需求习惯、切入点和待验证问题，全部标注 hypothesis |
| 3 | Target Users | 设计师/创作者、独立开发者、产品团队三类用户画像 |
| 4 | Business Model | 免费核心、付费表达的商业假设与验证条件 |
| 5 | Tech Stack | 当前原型技术栈与后续升级路径 |
| 6 | Blueprint Score | Market Demand、Competition、Build Difficulty、Revenue Potential、AI Compatibility 与综合分 |
| 7 | Build Timeline | Import Prompt → Deploy Database → Deploy Frontend → Connect Stripe → Launch；耗时、难度和产出逐步展示 |
| 8 | What's Included | PRD、Prompt、UI、Code、Database、Deploy Guide、Marketing Kit、Launch Checklist，逐项区分样品和路线图 |
| 9 | 12 decision layers | Product Overview、Target Users、Problem、Solution、Feature Map、User Flow、UI Screens、PRD、Tech Stack、Prompt Templates、Monetization Model、Marketing Strategy |
| 10 | Evidence & limits | 折叠展示已实现、模拟、缺失和权利边界，不抢购买焦点 |

按钮写 `Buy Blueprint`；当前按钮进入本地无扣款模拟获取，旁边必须说明正式价格与支付尚未开放。

## 8. Launch Dashboard

获取后页面不再只是下载页，而是启动控制台：顶部展示版本、访问状态和 Blueprint Score；随后展示下一步 `Import your Prompt`、8 个启动模块、Build Timeline、Launch Checklist 和可展开的资料样品。Code、Database、Deploy Guide 等若没有真实文件，显示 `Build plan` 或 `Tech sample`，不能写成源码已交付。

媒体规则：

- 图片/GIF 必须有 alt；视频必须可暂停，默认无声，不自动播放声音。
- 视频有口述信息时提供字幕或等价文字摘要。
- 尊重 `prefers-reduced-motion`；不支持 GIF 暂停时同时提供静态封面。
- 没有合格产品展示媒体时案例保持草稿；已批准媒体读取失败显示真实错误，不换用第三方替代图。
- 在线体验或仓库失效/未核验时不显示按钮；闭源产品不显示源码操作。

## 9. 登录、注册与邮件确认

登录：邮箱、密码、显示/隐藏密码、提交按钮和注册入口。无效凭据统一显示“邮箱或密码不正确，请重试”，不得暴露邮箱是否存在。

注册：邮箱、密码、确认密码和“创建账号”；密码规则必须与 Supabase 实际配置一致。注册后显示脱敏邮箱与“确认邮件已发送”。

回跳只接受单个 `/` 开头的站内相对路径；绝对 URL、`//`、反斜杠或解析失败值统一回首页。

首版不显示第三方登录、忘记密码或其他未实现入口。

## 10. 我的收藏

标题“我的收藏”，显示当前仍公开可见的真实数量、标准案例卡和分页。草稿、归档或撤下案例不泄露。

空状态：

> 还没有收藏案例<br>
> 浏览案例库，把值得继续研究的产品放在这里。<br>
> 浏览案例库

未登录访问跳转 `/login?returnTo=/favorites`。

## 11. 空、错与加载状态

| 场景 | 显示 | 禁止 |
|---|---|---|
| 无公开案例 | “案例正在整理中，完成来源和素材核验后会在这里出现。” | 不生成示例卡 |
| 无收藏数据 | 隐藏“收藏最多”区 | 不注入 0 以外的假计数 |
| 无结果 | “没有符合当前条件的案例”与“清除筛选” | 不自动放宽条件 |
| 收藏为空 | 收藏空状态 | 不预填默认收藏 |
| 列表失败 | “暂时无法加载内容，请重试” | 不显示成 0 条 |
| 详情不可见 | 统一 404“没有找到这个案例” | 不暴露草稿存在 |
| 图片失败 | “封面暂时无法显示” | 不替换未授权图 |
| 收藏失败 | 回滚状态与计数 | 不保留乐观假状态 |
| 加载 | 同尺寸骨架与 `aria-busy` | 不显示假名称、分数或计数 |

错误区域必须有“重试”。日志不得包含密码、Token 或管理密钥。

## 12. 响应式

| 项目 | 360px | 768px | 1440px |
|---|---|---|---|
| 页面边距 | 16px | 24px | 32px |
| 最大宽 | 100% | 100% | 1280px 居中 |
| 网格 | 1 列 | 2 列 | 3 列 |
| 导航 | 全屏抽屉 | 完整导航 | 完整导航 |
| 筛选 | 全屏对话框 | 折叠筛选行 | 左侧 240px 粘性栏 |
| 详情 | 单列 | 单列 | 主内容约 820px + 目录 240px |
| 最小操作面积 | 44×44px | 44×44px | 44×44px |

不得横向溢出；长名称和 URL 安全换行；放大 200% 后核心流程仍可用；固定元素不得遮挡错误、分页或主要操作。

## 11. 无障碍

| 项目 | 要求 |
|---|---|
| 结构 | “跳到主要内容”；每页一个 H1；使用 `header/nav/main/footer` |
| 焦点 | DOM 与视觉顺序一致；2px 蓝色焦点环；不用正数 `tabindex` |
| 对话框 | 焦点陷阱、Esc 关闭、关闭后焦点回触发按钮 |
| 收藏 | 真实 button、`aria-pressed`、完整案例名、live region |
| 搜索 | form、可见标签、明确提交；结果数通过 live region 宣布 |
| 表单错误 | `aria-invalid`、`aria-describedby`、可聚焦错误摘要 |
| 图片/视频 | 真实 alt；视频键盘可控；不只靠颜色表达状态 |
| 对比度 | 正文 4.5:1；大字及组件边界 3:1 |
| 自动检查 | 首页、案例库、详情、登录页无 serious/critical 问题 |

## 12. 设计 Token

### 颜色

| Token | 值 | 用途 |
|---|---:|---|
| `--canvas` | `#F7F7F4` | 页面背景 |
| `--surface` | `#FFFFFF` | 卡片、输入框 |
| `--surface-muted` | `#F0F0EC` | 骨架、弱区块 |
| `--text` | `#111111` | 主文字 |
| `--text-muted` | `#575754` | 次文字 |
| `--border` | `#D6D6D0` | 普通边框 |
| `--border-strong` | `#74746D` | 输入边界 |
| `--accent` | `#1D4ED8` | 链接、焦点、选中 |
| `--accent-hover` | `#1E40AF` | 悬停 |
| `--accent-soft` | `#EFF6FF` | 已收藏、选中背景 |
| `--danger` | `#B42318` | 错误 |
| `--success` | `#067647` | 成功 |

蓝色是唯一交互强调色；分类、成熟度和难度标签使用灰阶。主按钮黑底白字，次按钮白底黑字。卡片默认无阴影，悬停只提高边框并加极轻阴影，不上浮、不发光、不用渐变。

### 字体与尺寸

字体：系统无衬线，中文依次使用 `PingFang SC`、`Microsoft YaHei`。正文 16px/1.65，辅助 14px/1.55，标签 12px/1.4；桌面 Hero 52px，移动 Hero 34px。

间距序列：4、8、12、16、24、32、48、64、96px。控件高 44px；卡片圆角 14px；大媒体圆角 18px；正文最大行宽 720px；交互动效 140ms，面板 180ms。

## 13. 关键文案

| 场景 | 文案 |
|---|---|
| 定位 | 不是链接导航，而是可复刻的 AI 产品案例库 |
| 主操作 | 浏览全部案例 |
| 精选 | 今日精选 |
| 收藏排序 | 收藏最多 |
| 最新 | 最新收录 |
| 榜单 | 创业灵感编辑榜 |
| 判断 | 商业潜力·编辑判断 |
| 推断 | 编辑推断 |
| 假设 | 产品假设 |
| 闭源 | 当前没有经过核验的公开源码。 |
| 无结果 | 没有符合当前条件的案例。 |
| 错误 | 暂时无法加载内容，请重试。 |
