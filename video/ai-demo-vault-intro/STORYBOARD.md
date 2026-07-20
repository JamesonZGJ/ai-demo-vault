# AI Demo Vault 产品介绍分镜

**Format:** 1080×1920, 30fps, 45s target
**Audio:** Chinese narration + generated low-volume electronic underscore
**VO direction:** 独立开发者、自然、清晰、稍快，不像广告配音
**Style basis:** `DESIGN.md` and real screenshots in `capture/screenshots/`

## Asset audit

| Asset | Type | Scene | Role |
|---|---|---|---|
| `capture/screenshots/home.png` | real website capture | 1, 3, 7 | first impression, product reveal, CTA |
| `capture/screenshots/explore.png` | real website capture | 4 | search and Build Block catalog |
| `capture/screenshots/glass-surface.png` | real website capture | 4 | product detail and package status |
| `capture/screenshots/blueprints.png` | real website capture | 7 | honest advanced-product preview |
| `capture/screenshots/glass-search.png` | real website capture | 4 | search intent proof |
| `app/icon.svg` | owned project mark | 3, 7 | brand mark, copied to video public |
| `hyperframes/index.html` | HyperFrames source | 1 | opening title animation source |

## Scene 1 — 收藏很多，真正用上的很少（0:00–0:04）

**VO:** “我每天都在 X 和各类 Showcase 里，刷到很惊艳的 AI 产品和 UI 动效。收藏越来越多，真正做进项目的，却很少。”

画面从三张真实网站卡片开始：Home、Explore、Glass Surface。卡片像收藏夹一样叠放，轻微错位但不旋转过度。关键词“AI Demo”从左侧进入，随后“只剩收藏”被蓝色细线圈出。最后一帧保留大量留白，为问题场景让路。

**Motion:** 卡片交错进入；最前面的 Glass Surface 做轻微放大；字幕按短句显示。

**Transition:** 灰白遮罩从底部向上推移。

## Scene 2 — 收藏夹没有源码（0:04–0:09）

**VO:** “因为很多 Demo 只有一段视频：没有源码，没有 Prompt，也没有接入说明。”

浅色背景上出现一个“收藏夹”面板，三个条目依次变灰，旁边出现三个清晰标签：没有源码、没有 Prompt、不知道怎么接入。标签只使用抽象文本，不抓取第三方内容。

**Motion:** 条目从亮到灰；问号圆点短暂出现；每个问题按顺序落下。

**Transition:** 一条蓝色 marker sweep 横向扫过，露出产品名称。

## Scene 3 — AI Demo Vault（0:09–0:13）

**VO:** “所以我做了 AI Demo Vault。这里把优秀产品拆成可以直接复用的 Build Blocks。”

真实首页截图放在深色设备框内，左侧显示产品名，右侧显示三个模块芯片：UI、Animation、AI Workflow。主标题用大字号分两行，强调 `Build Blocks`。

**Motion:** Logo 从小到大；截图由模糊缩放到清晰；三个芯片以 90ms 间隔进入。

**Transition:** 截图卡片向前推近，进入 Explore。

## Scene 4 — 搜索、预览、检查包状态（0:13–0:25）

**VO:** “先在线预览，再看每个模块的源码状态、Prompt、README、License 和 Integration Guide。搜索 Glass、Hero、Chat 或 Animation，找到你现在需要的那一块。”

用真实 Explore 截图做竖屏裁切，先显示搜索框和热门搜索，再推近 Glass Surface 卡片。随后切换真实详情页，展示 Live Demo、`Source ready`、`Prompt planned`、`Coming soon` 等诚实状态。标签每次只出现一个，避免堆满画面。

**Motion:** 搜索框局部放大；卡片内容沿纵向滚动；详情页做慢速 Ken Burns；标签用 marker underline。

**Transition:** 白色内容面收束成一个模块卡片。

## Scene 5 — 一个产品，可以拆成多个能力（0:25–0:32）

**VO:** “每个模块都从真实产品和真实交互出发，重新实现，清楚标注完成状态。做 AI 产品时，你可以从一个可靠的模块开始，不必每次面对一张空白页面。”

一个产品窗口在中间拆解成五张卡片：Hero、Glass Card、Chat UI、Upload Flow、Animation。中间保留“Preview → Inspect → Reuse”的小路径。

**Motion:** 窗口缩小，卡片沿五个固定位置展开；每张卡片只做一次轻微上移；不使用随机散落。

**Transition:** 五张卡片沿同一方向排列成来源流。

## Scene 6 — 每天发现，持续拆解（0:32–0:39）

**VO:** “我会持续从 X、GitHub、Product Hunt 和 Showcase 中寻找值得复刻的灵感。每天发现，持续拆解，逐步更新。”

四个来源以文字标签进入：X、GitHub、Product Hunt、Showcase。它们经过一条细线流向新的 Build Block 卡片，卡片内容为 Color Extraction、Glass Surface、Card Highlight，均来自真实站内目录。

**Motion:** 标签按节奏依次进入；细线 scaleX 展开；卡片从右侧滑入。

**Transition:** 所有卡片向中心收束，留下网址。

## Scene 7 — 公开上线，邀请反馈（0:39–0:45）

**VO:** “AI Demo Vault 已上线。把你想让我拆解的 Demo 发给我，也欢迎关注后续的 Build Blocks。”

真实首页和 Blueprints 预览页做成两张小卡，主视觉只保留一句“AI Demo Vault 已上线”。网址 `ai-demo-vault.vercel.app` 停留至少 2 秒，底部显示“把你想拆解的 Demo 发给我”。不展示购买成功或下载成功。

**Motion:** URL 从细线中显现；CTA 轻微 scale 1→1.02→1；最后 2 秒保持稳定。

## Production tree

```text
ai-demo-vault-intro/
├── DESIGN.md
├── SCRIPT.md
├── STORYBOARD.md
├── narration.txt
├── captions.srt
├── capture/screenshots/
├── hyperframes/index.html
└── remotion/
    ├── package.json
    ├── src/
    └── public/capture/
```
