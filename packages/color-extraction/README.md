# Color Extraction Capability Package

一个不依赖第三方代码的图片取色能力模块。输入浏览器 `ImageData`，输出可直接用于 UI 主题、渐变和分享卡片的主色与 HEX 值。

当前版本：`0.1.0-preview`

## 运行边界

- 浏览器端运行，不上传图片。
- 需要 `CanvasRenderingContext2D` 读取像素。
- 当前实现提供稳定的平均色提取；聚类调色板是后续版本。

## 资产

- `src/index.ts`：自研实现。
- `prompts/cursor.md`：Cursor 接入 Prompt。
- `prompts/claude.md`：Claude 接入 Prompt。
- `parameters.json`：输入、输出和默认参数。
- `INTEGRATION_GUIDE.md`：接入步骤和已知限制。
