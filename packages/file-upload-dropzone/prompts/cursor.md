# Cursor 提示词：实现智能文件上传区

请在当前 React / Next.js 项目中实现一个自研的 `FileUploadDropzone` 组件，中文展示名为“智能文件上传区”。不要复制第三方组件源码、品牌皮肤、Logo 或演示素材。

要求：

1. 使用 React、TypeScript 和 CSS，不新增上传组件依赖。
2. 同时支持原生文件输入、点击选择、键盘操作和文件拖放。
3. 展示默认、拖入、处理中、完成和错误状态。
4. 支持 `accept`、`maxSizeBytes`、`maxFiles` 和 `multiple` 参数。
5. 文件校验函数可独立测试，返回已接受文件与具体错误。
6. 上传动作由调用方处理；组件只接收 `state`、`progress` 和文件数据，不伪造远端上传。
7. 使用 `aria-live` 和 `progressbar` 说明状态，拖拽必须有点击替代操作。
8. 输出 README、参数说明、接入指南和测试清单。
