# Cursor 提示词：智能聊天输入框

请在 React + TypeScript 项目中实现可复用的 `PromptComposer`。

要求：

1. 使用受控 `value`、`onChange` 和 `onSubmit`。
2. 文本区域根据 `scrollHeight` 自动增高，并设置最大高度。
3. Enter 发送，Shift + Enter 换行。
4. `isComposing` 为真时禁止提交，避免中文输入法误发送。
5. 支持附件标签和移除按钮，但不在组件内伪造上传。
6. 生成中禁用输入，并把主按钮切换为停止。
7. 空文本不能提交，按钮有清晰可访问名称。
8. 提供组件、样式、示例和键盘规则测试。
