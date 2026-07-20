# AI Demo Vault Product Intro Video

这是独立于 Next.js 主站的视频制作目录，不参与 Vercel 构建。

## 交付物

- `DESIGN.md`：视频专用视觉规范
- `SCRIPT.md` / `narration.txt`：口播与 TTS 文本
- `STORYBOARD.md`：七个场景的分镜和素材审计
- `captions.srt`：纯字幕版参考字幕
- `capture/screenshots/`：从 `https://ai-demo-vault.vercel.app` 抓取的真实页面截图
- `hyperframes/index.html`：HyperFrames 开场标题源文件
- `remotion/`：Remotion 竖屏编排工程
- `renders/`：最终 MP4 输出目录

## 系列第 001 期

《每天拆一个 AI 产品》第 001 期的中文资产与视频位于 `episodes/001-glass-card/`，对应 Remotion composition：

- `Daily-AI-Product-001-GlassCard`：中文旁白版
- `Daily-AI-Product-001-GlassCard-Captions`：无旁白字幕版
- `remotion/renders/episode-001-glass-card.mp4`：成片
- `remotion/renders/episode-001-glass-card-captions.mp4`：无旁白成片

## 制作命令

在 `remotion/` 目录执行：

```bash
npm install
npm run studio
npm run render:voice
npm run render:captions
```

HyperFrames 源文件位于 `hyperframes/index.html`。如果本机已安装 HyperFrames CLI，可以在该目录运行：

```bash
npx hyperframes lint
npx hyperframes validate
npx hyperframes preview
```

中文旁白使用 HyperFrames 的 Kokoro voice `zf_xiaobei` 生成。重新生成时，如果 Python 路径不在 PATH 中，先设置 `HYPERFRAMES_PYTHON`，再运行：

```bash
hyperframes tts narration.txt --voice zf_xiaobei --speed 1.8 --output remotion/public/narration.wav
```

## 素材原则

网站页面截图来自公开部署地址；来源平台只使用文字标签。没有授权的第三方视频、Logo 或 UI 不进入成片。网站当前显示为 Preview 状态的内容，在视频中也保持 Preview 或 Coming soon 文案。
