# 《每天拆一个 AI 产品》视频工程

这是独立于主站的视频制作目录，不参与网站构建。栏目内容以设计拆解、交互分析、前端实现和产品思考为主，所有行动都留在内容平台内。

## 文件说明

- `DESIGN.md`：视觉和安全规范
- `SERIES_TEMPLATE.md`：每期脚本、字幕、封面和发布模板
- `SCRIPT.md` / `narration.txt`：总栏目示例口播
- `STORYBOARD.md`：总栏目示例分镜
- `episodes/`：按期整理的口播、字幕、封面和平台文案
- `remotion/`：Remotion 竖屏编排工程
- `remotion/renders/`：最终 MP4 输出目录

## 当前成片

- 第 001 期：`remotion/renders/episode-001-glass-card.mp4`
- 第 001 期字幕版：`remotion/renders/episode-001-glass-card-captions.mp4`
- 第 002 期：`remotion/renders/episode-002-magic-card.mp4`
- 第 002 期字幕版：`remotion/renders/episode-002-magic-card-captions.mp4`

两期均为 1080×1920、30fps、42 秒竖屏视频。旁白使用 HyperFrames 的中文语音生成，背景音乐保持低音量。

## 制作命令

在 `remotion/` 目录执行：

```bash
npm install
npm run studio
npm run render:episode001
npm run render:episode001:captions
npm run render:episode002
npm run render:episode002:captions
```

生成中文旁白时使用 HyperFrames CLI，输入文件为对应期数目录中的 `narration.txt`。如本机 Python 不在 PATH，再设置 `HYPERFRAMES_PYTHON`。

## 内容边界

- 画面使用自制示意、原创代码排版和获得授权的素材。
- 参考效果只用于短暂分析，不完整搬运第三方视频、Logo、源码或插画。
- 旁白、字幕和封面不出现工具名、站点名、URL、二维码、下载、外部链接或站外 CTA。
- 不虚构热度、作者身份、互动数据或产品成绩。
