# 智能文件上传区

《每天拆一个 AI 产品》第 006 期。

`File Upload Dropzone` 是一个自研的文件输入组件。它把默认、拖入、处理中和完成四种关键状态放在同一个区域，并同时支持拖拽、点击和键盘选择。适合图片生成、文档分析、音频转写和知识库导入等 AI 产品流程。

## 包含内容

- `src/FileUploadDropzone.tsx`：自研 React 组件和文件校验函数
- `parameters.json`：参数、状态和可访问性说明
- `prompts/cursor.md`：Cursor 实现提示词
- `prompts/claude.md`：Claude 实现提示词
- `INTEGRATION_GUIDE.md`：接入步骤与验收清单
- `LICENSE`：本包的 MIT License

## 设计拆解

1. 默认状态说明支持的格式与大小，降低第一次操作的不确定感。
2. 文件进入目标区域后立即改变边框、底色和提示语，让用户确认目标正确。
3. 处理中显示文件名和真实业务传入的进度，不把等待留成空白。
4. 完成后保留文件信息和重新选择入口，方便用户核对与纠错。
5. 拖拽之外保留原生文件输入，兼顾触屏、键盘和无法拖拽的使用场景。

## 来源边界

本期研究参考了 [MDN 的文件拖放说明](https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/File_drag_and_drop)、[File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API) 与 [W3C 对拖拽替代操作的说明](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements)。本包没有复制第三方组件源码、品牌皮肤或演示页面，组件结构、视觉、中文内容和实现均为重新制作。

## 真实状态

当前在线预览只在浏览器本地模拟处理进度，不会上传文件。组件把真实上传动作交给业务层；资料免费公开，无需支付，打包下载尚未开放。
