# Cursor 提示词：AI 思考过程面板

请在现有 React + TypeScript 项目中实现一个可复用的 AI Reasoning Panel。

要求：

1. 支持 idle、waiting、streaming、complete、error 五种状态。
2. 等待和生成时自动展开，完成或错误后延迟收起。
3. 用户手动展开或收起后，当前任务内不得用自动逻辑覆盖用户选择。
4. 标题按钮提供 `aria-expanded`、`aria-controls` 和清晰的键盘焦点。
5. 每个状态同时提供文字和视觉反馈，不允许只靠颜色表达。
6. 支持 `prefers-reduced-motion: reduce`。
7. 只展示可公开的处理摘要，不暴露模型隐藏推理、系统提示词或内部日志。
8. 不复制第三方组件源码，输出组件、CSS、参数说明、接入示例和测试。
