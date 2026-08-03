# 流式聊天回复接入指南

1. 复制 `src/StreamingChat.tsx` 和 `src/streaming-chat.css` 到项目。
2. 在全局样式入口引入 `streaming-chat.css`。
3. 将请求开始映射为 `waiting`，收到首段内容后切换为 `streaming`。
4. 每次收到新文本时更新 `response` 和 `visibleCharacters`。
5. 数据流结束后切换为 `complete`；请求失败时切换为 `error`。

组件不负责网络请求和模型协议。SSE、WebSocket 或 ReadableStream 应由业务层处理，再把真实状态传入组件。
