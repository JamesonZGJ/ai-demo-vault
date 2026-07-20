# AI Build Blocks Marketplace 内容生产流水线

这套流程把一次灵感变成一个可复用、可验证、可发布、可传播的 Build Block。

```text
Discover → Evaluate → Breakdown → Rebuild → Package → QA → Publish → Distribute → Maintain
```

## 1. 生产目标

### 每日目标

- 每天投入 1–2 小时。
- 每天完成 1 个 Micro Block，或推进 1 个 Medium Block 的一个阶段。
- 每天至少留下 1 条可追踪的来源记录、1 次评分、1 个明确的下一步。
- 不以收藏链接数量为产出，以“可复用 Package 已通过 QA”为产出。

### 三种生产规格

| 规格 | 适合内容 | 建议周期 | 完成标准 |
| --- | --- | --- | --- |
| Micro Block | Hover、Loading、Glass、Card、Color Picker | 1 天 | 一个清晰输入、一个清晰输出、可独立预览 |
| Medium Block | Upload Flow、Chat UI、Canvas、Image Cropper | 2–5 天 | 多状态交互、README、Prompt、Integration Guide 完整 |
| Blueprint | 多页面产品、账号、数据、商业模式、完整流程 | 1–3 周 | 明确产品边界，不伪装成单一模块 |

默认先做 Micro Block。任何需要多页面、账号、数据库或复杂业务规则的内容，不强行压缩成一天完成。

## 2. 每日 90–120 分钟 SOP

| 时间 | 动作 | 产出 |
| --- | --- | --- |
| 0–10 分钟 | 清空昨日 Inbox，去重来源 | 今日候选 3–5 个 |
| 10–30 分钟 | 浏览优先渠道，保存真实链接和截图 | 1 个主候选 + 2 个备选 |
| 30–40 分钟 | 评分和版权初筛 | 分数、淘汰原因、下一步 |
| 40–55 分钟 | 拆解成一个 Block 的边界 | Breakdown Card |
| 55–85 分钟 | 从零复刻核心交互 | 可运行 Preview |
| 85–105 分钟 | 生成 README、Prompt、参数和接入说明 | Package 草稿 |
| 105–120 分钟 | QA、写发布文案、更新数据库 | 发布记录和明日任务 |

如果 30 分钟后仍无法写出“这个 Block 解决什么问题”，当天不开发，退回候选池。

## 3. Discover：发现渠道

浏览的目的不是找“看起来很酷的产品”，而是找一个能被独立复用的交互、视觉或 AI 工作流。

### 优先级和用法

| 优先级 | 渠道 | 每日时间 | 最适合找什么 | 使用方法 |
| --- | --- | ---: | --- | --- |
| ★★★★★ | X | 20 分钟 | 新鲜 Demo、AI Builder、动效、Prompt 工作流 | 用 Lists 和 Topics 建立自己的信息流 |
| ★★★★★ | GitHub Trending | 15 分钟 | 有源码证据的组件、工具、AI 应用 | 按 JavaScript、TypeScript、React、CSS、AI 筛选 |
| ★★★★★ | Product Hunt AI | 10 分钟 | 新产品的核心流程、产品命名和用户价值 | 只看产品 Demo 和首屏，不照搬产品代码 |
| ★★★★★ | Vercel Showcase / Templates | 10 分钟 | 完整产品的页面结构、AI 应用流程 | 重点观察可拆出的 UI 和状态 |
| ★★★★★ | Framer Gallery / Marketplace | 10 分钟 | Hero、Landing、Motion、视觉系统 | Gallery 看完成的网站，Marketplace 看可复用资产；两者不要混为一谈。Framer 官方明确把 Gallery 定位为真实上线网站，把组件、模板和可 remix 资产放入 Marketplace。([官方说明](https://www.framer.com/help/articles/publish-site-to-gallery/)) |
| ★★★★☆ | Cursor Showcase / Forum | 10 分钟 | Rules、Prompt、MCP、Extension、AI Coding Workflow | 先参与讨论再发布自己的内容；出售内容必须主动披露。([Showcase](https://forum.cursor.com/c/showcase/9)、[社区规范](https://forum.cursor.com/faq)) |
| ★★★★☆ | Lovable Gallery | 5–10 分钟 | AI 生成 App 的页面、流程和结构 | 只取交互思路，全部从零重实现 |
| ★★★★☆ | Supabase Examples / Showcase | 10 分钟 | Auth、Chat、Storage、RAG、数据型 AI 流程 | 适合寻找 Medium Block 或 Blueprint 的后端边界 |
| ★★★★☆ | Mobbin | 10 分钟 | Onboarding、Upload、Paywall、Search、Empty State | 参考真实产品流程，不复制截图或素材 |
| ★★★★☆ | Awwwards Collections | 5 分钟 | Landing、Hero、Scroll、Typography、Motion | 只作为视觉质量和动效方向参考。([Collections](https://www.awwwards.com/basic/collections/)) |
| ★★★☆☆ | Dribbble | 5 分钟 | 视觉风格、颜色、卡片、图标 | 不能单独作为开发依据，必须再找真实 Demo |

GitHub Trending 适合发现社区近期关注的仓库，而不是证明产品已经成功；它的官方页面本身描述为“社区当前最兴奋的仓库”。([GitHub Trending](https://github.com/trending)) Product Hunt 的 AI 主题已经按 AI Agents、LLMs、AI Infrastructure、AI Chatbots 等方向组织，可直接用作候选分类参考。([Product Hunt AI](https://www.producthunt.com/topics/artificial-intelligence))

### X 的信息流搭建

X 的 For You 会混合关注的账号、Topics 和推荐内容；Lists 也会影响推荐内容。([X For You](https://help.x.com/en/using-x/x-timeline)、[X Lists](https://help.x.com/en/using-x/x-lists)) 不要依赖随机推荐，按下面步骤训练信息流：

1. 建立 5 个 Lists：`AI Builders`、`UI Engineers`、`Motion`、`Open Source`、`Product Founders`。
2. 每个 List 先放 10–20 个种子账号，不要一开始关注几百人。
3. 官方种子账号：`@vercel`、`@cursor_ai`、`@supabase`、`@framer`、`@lovable_dev`、`@shadcn`。这些账号适合作为入口，不代表每条内容都值得复刻。([Vercel](https://x.com/vercel)、[Cursor](https://x.com/cursor_ai)、[Supabase](https://x.com/supabase)、[shadcn](https://x.com/shadcn))
4. 设计工程方向可长期观察 `@raunofreiberg`、`@jh3yy` 等账号；每月检查一次是否仍有稳定的原创 Demo 和实现细节。
5. 连续 7 天只点赞、收藏、回复与目标有关的内容；对泛娱乐、泛 AI 新闻和无 Demo 的营销内容使用 Not interested 或静音。
6. 每周清理一次：新增 5 个高质量账号，移除 5 个噪音账号；把真正候选复制到 Build Blocks Database，不把 X 收藏夹当数据库。
7. For You 用于发现，Following 用于验证；看到一个候选后，必须打开原始网站、仓库或作者页面核验。

### 来源记录规则

发现时立刻记录：

- 原始 URL、作者、平台、发现日期。
- 原始 Demo 截图或 GIF 的本地路径。
- 是否有源码、许可证、官方说明。
- 你观察到的核心行为，而不是“看起来很酷”。
- 可能拆出的 Block 名称。

不要只保存转发链接。转发内容不是来源，原始作者页面才是来源。

## 4. Evaluate：100 分筛选标准

### 评分表

| 维度 | 分值 | 评分问题 |
| --- | ---: | --- |
| 复用价值 | 20 | 能否放进至少 3 种不同产品？ |
| 交互质量 | 15 | 状态、反馈、动效和边界是否完整？ |
| 视觉表现 | 10 | 是否有明确、可识别的视觉价值？ |
| 商业价值 | 15 | 用户是否愿意为节省时间和试错付费？ |
| 实现复杂度 | 10 | 在现有技术栈中是否能稳定复刻？越容易，分越高。 |
| SEO 潜力 | 10 | 用户是否会搜索这个具体词，如 Glass、Image Cropper、Chat UI？ |
| 可拆解性 | 10 | 能否清楚写出输入、输出、状态和参数？ |
| 购买理由 | 10 | Package 是否比一段免费代码多提供明显价值？ |
| **总分** | **100** |  |

### 决策线

- **80–100：开发**。进入本周生产队列。
- **70–79：验证后开发**。先做 15 分钟技术 Spike，再决定。
- **60–69：收藏**。记录但不投入开发时间。
- **0–59：归档**。写清楚淘汰原因，不反复重看。

### 一票否决

以下任意一项成立，不进入开发，即使分数很高：

- 没有可核验的原始来源。
- 计划直接出售第三方源码、截图、素材或未授权 Prompt。
- 只能依赖一个产品的业务数据，无法独立运行。
- 只能展示静态截图，没有可观察的行为。
- 复刻后无法说明自己的实现、参数和许可证边界。

## 5. Breakdown：拆解模板

每个候选先填写下面的 Breakdown Card，不要直接开始写代码。

```md
# Breakdown Card

Source:
Original URL:
Author / Company:
Captured at:
Rights / License:

## User outcome
用户完成了什么？看到了什么结果？

## Core behavior
触发条件 → 状态变化 → 输出结果

## Inputs
- pointer / click / keyboard / upload / prompt / API

## States
- idle
- loading
- success
- empty
- error
- disabled

## Candidate blocks
- Surface:
- Interaction:
- Motion:
- Feedback:
- AI workflow:
- Data / Canvas:

## One-block boundary
本次只实现：
明确不实现：

## Reuse cases
1.
2.
3.
```

### 常见 Block 词典

`Hero`、`Glass`、`Animation`、`Card`、`Sidebar`、`Navigation`、`Upload`、`Loading`、`Ticket`、`Prompt`、`Image Processing`、`Chat`、`Search`、`Dashboard`、`Canvas`、`Color Picker`、`Workflow`。

### 什么时候拆成多个 Block

满足以下大部分条件时拆开：

- 有独立的输入和输出。
- 可以单独放进另一个产品。
- 有独立的参数或状态。
- 可以在 10 秒内独立 Demo。
- 不依赖同一页面的业务数据。
- 用户可能只想购买其中一部分。

例如一个图片产品可以拆成 `Color Extraction`、`Image Cropper`、`Gradient Background`、`Ticket Poster`，而不是把整个 App 当成一个商品。

### 什么时候做 Blueprint

满足以下任意两项以上时，优先做 Blueprint：

- 超过 3 个互相依赖的页面。
- 需要 Auth、数据库、支付或后台任务。
- 价值来自完整业务流程，而不是某个单点交互。
- 需要产品定位、商业模式、营销和发布计划。
- 用户购买的是“从想法到上线的方法”，而不是一个可插入模块。

Build Block 是零件，Bundle 是同类零件集合，Blueprint 是完整产品图纸。不要为了填充目录，把完整产品压缩成一个假模块。

## 6. Rebuild：通用 Codex Prompt

以后只需把 Demo 视频、网站、GitHub、X 帖子或截图作为输入，使用下面的 Prompt。输入内容只作为参考，不代表获得了复制或再分发权利。

```text
你是 Senior Product Engineer、Interaction Designer 和 Content QA。

任务：分析我提供的参考资料，拆解出一个可独立复用的 AI Build Block，并在当前仓库中从零实现它。

输入资料：
- Demo URL / video / screenshots:
- GitHub URL:
- X post:
- Known license or source statement:

请严格按以下顺序工作：

1. Source audit
   - 列出原始作者、来源、日期、可见许可证和未知权利。
   - 把“观察到的事实”和“你的推断”分开。
   - 不复制第三方源码、图片、视频、字体、商标或 Prompt。

2. Behavior analysis
   - 写出用户目标、输入、输出和核心状态。
   - 列出 idle、loading、success、empty、error、disabled。
   - 说明最重要的交互反馈和动效节奏。

3. Scope decision
   - 提出 3–5 个候选 Build Block。
   - 给每个候选按复用价值、交互质量、视觉表现、商业价值、实现复杂度、SEO、可拆解性和购买理由打分，总分 100。
   - 选择一个最适合本次实现的 Block。
   - 如果它必须依赖多页面、Auth、数据库或业务流程，明确建议改为 Blueprint。

4. Self-owned rebuild
   - 从零实现，不复制参考代码。
   - 遵循仓库现有技术栈、目录结构、命名和事实边界。
   - 不新增未请求的页面、支付、会员、后台或外部服务。
   - 不引入密钥，不写入真实用户数据。
   - 提供键盘操作、焦点状态、移动端布局和 prefers-reduced-motion。

5. Package output
   - Live Demo
   - Source Code
   - Cursor Prompt
   - Claude Prompt
   - README
   - Integration Guide
   - License / attribution note
   - Cover and short GIF
   - SEO description, tags, category, difficulty, dependencies

6. QA report
   - 运行 lint、typecheck、unit tests 和 build。
   - 检查无密钥、无第三方未授权素材、无虚假 Ready/Download/Payment 状态。
   - 输出“已实现 / 未实现 / 计划中 / 未知权利”四张清单。

最终输出：
A. 一句话定位
B. Breakdown Card
C. 评分表和开发结论
D. 文件清单
E. QA 结果
F. Marketplace 发布稿
```

## 7. Packaging：统一 Package 结构

```text
build-blocks/<slug>/
├─ README.md
├─ integration-guide.md
├─ license.md
├─ metadata.json
├─ prompts/
│  ├─ cursor.md
│  └─ claude.md
├─ src/
├─ cover.webp
├─ preview.gif
└─ changelog.md
```

### `metadata.json` 必填字段

```json
{
  "slug": "glass-surface",
  "title": "Glass Surface",
  "category": "Visual Effects",
  "tags": ["glass", "card", "visionos", "surface"],
  "difficulty": "easy",
  "summary": "One sentence describing the reusable outcome.",
  "source_status": "self_owned_prototype",
  "license_status": "reviewed",
  "dependencies": ["React", "CSS"],
  "preview_status": "preview_ready",
  "package_status": "planned"
}
```

### 资产标准

| 资产 | 标准 |
| --- | --- |
| Live Demo | 用户 10 秒内能看到结果；必须包含正常、空、加载或错误状态中的适用状态 |
| Source Code | 自研、可运行、无密钥、依赖版本明确 |
| Cursor / Claude Prompt | 在干净项目中测试过；说明输入、输出和限制 |
| README | 解决什么问题、适合什么场景、不适合什么场景 |
| Integration Guide | 安装、导入、参数、事件、样式覆盖和卸载方式 |
| License | 自研声明、第三方依赖许可证、参考来源和不可再分发内容 |
| Cover | 统一画布、统一字体、单个主视觉，不放长段文字 |
| GIF | 3–8 秒，展示一个核心动作，避免循环过快；没有权利的素材不用 |
| SEO Description | 一句话说明结果和用途，不写空泛的 AI 形容词 |
| Tags | 3–5 个；优先用户会搜索的词，不堆同义词 |

### 命名规则

- 标题使用“结果 + 对象”：`Image Cropper`、`Card Highlight`、`Streamed Chat Input`。
- 不使用 `Amazing`、`Next-gen`、`AI-powered`、`Ultimate` 等空泛修饰词。
- Summary 说明结果，不说明团队愿景。
- Description 说明痛点、输入、输出和接入方式。

## 8. Publish：上线前检查

### 内容和权利

- [ ] 原始 URL、作者、日期和许可证已记录。
- [ ] 所有源码是自研或有明确再分发权利。
- [ ] Cover、GIF、字体、图片和音频均有来源或自行制作。
- [ ] 未把第三方产品名称包装成本站拥有。

### 技术和体验

- [ ] 新环境可以运行 Demo。
- [ ] 没有硬编码密钥、私有 URL 或本地路径。
- [ ] 键盘、焦点、移动端和减少动态效果已检查。
- [ ] 关键状态没有假装为 Ready、Purchased 或 Downloadable。
- [ ] 依赖和浏览器限制写入 README。

### 商品和 SEO

- [ ] 标题、Summary、Description、Category、Tags、Difficulty 已完成。
- [ ] Package 只显示真实拥有的资产；未完成资产标为 Planned 或 Coming soon。
- [ ] 价格如果只是策略展示，明确写 Preview price / checkout not connected。
- [ ] Canonical、Open Graph、Cover 和 GIF 已检查。
- [ ] 详情页能从 Preview 解释“为什么值得复用”。

### Definition of Done

一个 Build Block 只有同时满足以下条件，才允许标记 `published`：

1. Preview 可以独立理解。
2. Source、Prompt、README、Integration Guide 和 License 状态真实。
3. 至少一个非作者的人可以按 README 接入。
4. QA 通过且没有高风险权利问题。
5. Marketplace 文案和传播文案已经生成。
6. Database 已写入发布 URL 和下一次复查日期。

## 9. Marketing：一稿多用，但不一稿多发

每个已发布 Build Block 生成一组内容资产：

```text
1 Block
→ 1 Marketplace 页面
→ 1 Demo GIF / video
→ 1 X post or thread
→ 1 小红书图文
→ 1 Reddit discussion
→ 1 LinkedIn post
→ 1 GitHub Release / changelog
→ 1 Database record
```

### X

```text
我需要的不是又一个完整 App。
我需要一个可以直接复用的 <Block>。

它解决：<具体问题>
Demo：<一句结果>
包含：Live Demo · Source · Prompt · README · Integration Guide

这是我从参考产品中观察后重新实现的版本，不是第三方源码搬运。
Preview：<URL>
```

### 小红书

- 标题：`一个可以直接复用的 <Block>，我把它拆出来了`
- 第 1 张：最终效果。
- 第 2 张：原来难在哪里。
- 第 3 张：拆成哪些状态。
- 第 4 张：如何接入自己的项目。
- 第 5 张：Prompt 和源码包含什么。
- 结尾：明确“参考来源”和“本站重新实现”，不要暗示官方合作。

### Reddit

- 先选择真的相关的 subreddit，再决定是否发布。
- 标题写问题和技术结果，不写“我做了一个很酷的产品”。
- 正文先分享拆解过程，再放链接。
- 不要在无关讨论区投放；有商业关系要主动披露。

### LinkedIn

- 第一段写开发成本或产品问题。
- 第二段写一个可复用的实现决策。
- 第三段放 Demo、技术栈和适用场景。
- 不把简单组件包装成创业成功案例。

### GitHub Release

- Release 标题：`Glass Surface v0.1.0`。
- Changelog 写新增能力、限制、依赖和许可证。
- 关联 Demo、README、Prompt 和 Integration Guide。
- 版本号只在资产真的发生变化时递增。

## 10. Build Blocks Database

第一版可以用 Notion、Airtable 或仓库内 CSV；重点是字段统一，不是工具品牌。

### 字段

| 字段 | 说明 |
| --- | --- |
| `id` / `slug` | 稳定唯一标识 |
| `source_url` | 原始来源，不填转发链接 |
| `source_platform` | X、GitHub、Product Hunt、Framer 等 |
| `author` / `company` | 作者或产品主体 |
| `source_date` / `captured_at` | 原始发布日期和发现时间 |
| `rights_status` | unknown、reference_only、self_owned、licensed |
| `source_media` | 原始截图、视频、仓库记录位置 |
| `candidate_blocks` | 初步拆解结果 |
| `score_total` / `score_breakdown` | 100 分评分和各项分数 |
| `block_type` | micro、medium、blueprint |
| `status` | inbox、scored、breakdown、rebuilding、packaging、qa、published、archived |
| `preview_url` | 在线 Demo 地址 |
| `repo_path` | 自研代码位置 |
| `asset_status` | source、prompt、readme、guide、license、media 的状态 |
| `marketplace_url` | 上线后的商品地址 |
| `published_at` | Marketplace 发布时间 |
| `distribution_status` | X、Reddit、小红书、LinkedIn、Release 各自状态 |
| `last_checked_at` | 上次复查时间 |
| `next_review_at` | 下次复查时间 |
| `update_reason` | 依赖、浏览器、Prompt、权利或内容更新原因 |
| `notes` | 不确定性、淘汰原因和后续判断 |

### 状态流转

```text
inbox → scored → breakdown → rebuilding → packaging → qa → published → promoted
                                      ↘ archived
```

任何状态都可以进入 `archived`。归档必须写原因，不能删除历史记录。

## 11. 长期维护

### 每周

- 周一：清理 Inbox，选出本周 3–5 个候选。
- 周二至周四：完成 Micro / Medium Block。
- 周五：统一 QA、发布、传播和更新数据库。
- 周末：复盘哪些来源带来高分候选，删掉低质量信息流。

### 每月

- 复查所有已发布 Block 的 Demo、依赖、Prompt 和链接。
- 检查原始来源是否下线、改版或改变许可证。
- 统计搜索词、详情页访问、Preview 互动和外部点击；没有数据时不写 Popular。
- 只更新有真实变化的版本，保留 changelog。

### 触发更新的事件

- 浏览器或依赖导致 Demo 失效。
- Prompt 在新模型中产生明显不同结果。
- 依赖许可证变化。
- 原始参考内容下线或被撤回。
- 用户反馈无法接入或 README 不完整。
- 90 天未复查。

## 12. 新人交接清单

新人拿到一个候选后，只需要依次回答：

1. 原始来源是什么，权利边界是什么？
2. 用户具体想完成什么？
3. 这能拆成哪个独立 Build Block？
4. 评分是否达到 80？一票否决是否通过？
5. 输入、输出和所有状态是什么？
6. 能否从零复刻，而不是搬运？
7. Package 的每个资产是否真实存在？
8. README 能否让另一个人接入？
9. Marketplace 页面和传播文案是否一致？
10. 下次复查日期是什么？

答不清第 1、3、4、6、7 项，不得发布。
