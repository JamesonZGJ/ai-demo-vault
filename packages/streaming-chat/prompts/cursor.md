# Cursor Prompt：流式聊天回复

请在现有 React + TypeScript 项目中实现一个流式聊天回复组件：

- 使用受控的 `status`、`prompt`、`response` 和 `visibleCharacters`。
- 明确展示等待、生成、完成和失败状态，不只依赖颜色。
- 等待阶段显示轻量反馈，生成阶段显示逐步到达的文本和光标。
- 新文本到达后自动滚动到消息末尾，但不要滚动整个页面。
- 为状态和回复区域提供合适的 `aria-live`。
- 支持窄屏和 `prefers-reduced-motion`。
- 不在组件内部模拟网络请求；业务层负责 SSE、WebSocket 或 ReadableStream。
