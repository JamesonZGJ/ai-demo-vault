# 素材清单与交付说明

## 已使用

- 真实首页截图：`capture/screenshots/home.png`
- 真实 Explore 截图：`capture/screenshots/explore.png`
- 真实 Glass Surface 详情截图：`capture/screenshots/glass-surface.png`
- 真实 Blueprints 预览截图：`capture/screenshots/blueprints.png`
- 真实搜索结果截图：`capture/screenshots/glass-search.png`
- 项目图标：`app/icon.svg`
- HyperFrames 开场源：`hyperframes/index.html`
- HyperFrames 开场成片素材：`hyperframes/render-opening.mp4`，已导入 Remotion 的 `public/hyperframes-opening.mp4`
- 旁白：`remotion/public/narration.wav`
- 轻量背景音乐：`remotion/public/music.wav`

## 当前不需要补充

- 不需要第三方产品视频或第三方 Logo。
- 不需要购买、下载、用户数量或订单截图。
- 不需要真实支付或会员素材。

## 可选补充

如果后续要做第二版，可以补充：

1. 你的 X / 小红书账号名或二维码。
2. 一个明确的 Demo 提交邮箱或表单链接。
3. 经过授权的产品录屏，用于替换来源文字标签。

没有这些素材不会阻塞当前版本发布。

## 两条视频

- `remotion/renders/ai-demo-vault-intro-voice.mp4`：旁白 + 字幕 + 背景音乐
- `remotion/renders/ai-demo-vault-intro-captions.mp4`：字幕 + 背景音乐，无旁白

两条视频均为 1080×1920、30fps、约 45 秒，H.264 MP4。

## 修改方式

- 文案：修改 `SCRIPT.md`、`narration.txt` 和 `captions.srt`。
- 视觉：修改 `DESIGN.md` 与 `remotion/src/styles.css`。
- 节奏：修改 `remotion/src/Video.tsx` 的场景起止秒数和字幕时间。
- HyperFrames 开场：修改 `hyperframes/index.html`，先运行 lint/validate，再重新渲染 Remotion。
- 最终输出：在 `remotion/` 目录运行 `npm run render:voice` 或 `npm run render:captions`。
