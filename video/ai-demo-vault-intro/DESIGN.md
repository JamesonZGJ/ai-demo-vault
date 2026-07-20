# AI Demo Vault Video Design

## Overview

这条视频延续 AI Build Blocks Marketplace 的真实网站视觉：浅灰画布、白色内容面、黑色高对比标题、细边框和少量蓝绿色信息色。画面从“收藏很多但用不上”的问题开始，逐步进入真实首页、搜索页和商品详情页，再回到 Build Block 的核心概念。视频保持编辑器和独立开发者的可信感，不使用夸张的产品广告语言。

## Format

- **Canvas**: `1080 × 1920`
- **Frame rate**: `30fps`
- **Duration**: 45 seconds target
- **Safe area**: top 150px and bottom 220px reserved for platform UI
- **Subtitle area**: lower middle, never cover website controls

## Colors

- **Canvas**: `#f7f7f4` — site background and quiet scenes
- **Surface**: `#ffffff` — cards, device frames and panels
- **Surface Muted**: `#f0f0ec` — secondary blocks and problem-state panels
- **Text**: `#111111` — primary copy and strong contrast
- **Text Muted**: `#575754` — explanations and metadata
- **Border**: `#d6d6d0` — rules, card edges and dividers
- **Accent**: `#1d4ed8` — labels, search focus and CTA emphasis
- **Accent Soft**: `#eff6ff` — highlighted search and prompt chips
- **Success**: `#067647` — real “ready” states only
- **Dark Tour Surface**: `#111827` — used only behind the real product screenshots

## Typography

- **Primary**: `Inter`, falling back to `Segoe UI`, `PingFang SC`, `Microsoft YaHei`, sans-serif.
- **Display**: 88–112px, weight 800–900, tight tracking `-0.05em`.
- **Scene heading**: 58–76px, weight 800, line height 1.04.
- **Body / narration support**: 30–38px, weight 450–600, line height 1.25.
- **Metadata / labels**: 18–24px, weight 700, uppercase where useful, tracking `0.08em`.
- **URL / technical text**: 24–30px, weight 650, tabular numerals where applicable.

## Subtitle style

- 简体中文，单组 1–2 行，每行尽量不超过 16 个汉字。
- 位置在画面下方安全区上方约 250px，黑色半透明圆角底板。
- 普通文字为 `#ffffff`，关键词使用 `#9fe7d5` 或 `#ffffff` 加细蓝线。
- 每次只显示一组字幕；进入为 6–10 帧淡入和上移，结束为 4–6 帧淡出。
- 纯字幕版仍保留背景音乐，但不放旁白。

## Motion

- Remotion 所有运动由 `useCurrentFrame`、`interpolate`、`Sequence` 驱动。
- HyperFrames 开场使用 GSAP 时间线；输出作为开场参考素材并保留源文件。
- 入场 0.25–0.55 秒，强调词可用一次轻微 scale overshoot，镜头移动保持慢而清楚。
- 页面截图使用单一父容器做入场，子图只做 Ken Burns，避免两个时间线同时控制同一 transform。
- 场景之间使用淡入、轻微纵向推移或遮罩擦除，不使用跳跃式 3D、粒子或故障闪烁。
- 不使用 CSS animation、CSS transition、随机数或无限循环。

## Transitions

1. Scene 1 → 2：灰白遮罩向上推移，表达收藏堆积。
2. Scene 2 → 3：蓝色细线扫过，产品名称在其后出现。
3. Scene 3 → 4：截图卡片向前推近，进入真实网站浏览。
4. Scene 4 → 5：白色内容面缩小成一个模块卡片。
5. Scene 5 → 6：来源标签沿同一轨迹进入，形成新的卡片。
6. Scene 6 → 7：所有卡片收束为网址和 CTA。

## What not to do

- 不使用未经许可的第三方视频、Logo 或 UI 录屏；来源只用文字标签。
- 不伪造下载成功、购买成功、用户数量、销量或完成状态。
- 不把“Coming soon”内容说成已经交付的 Package。
- 不使用廉价霓虹、满屏粒子、复杂 3D、过密数据和高频闪烁。
- 不让字幕覆盖真实网站的搜索框、商品状态或导航。
- 不使用“颠覆、赋能、重新定义、保证收益”等空泛营销词。
