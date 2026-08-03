# 智能聊天输入框

英文内部名：`Prompt Composer`

面向 AI 对话和生成任务的复合输入组件，统一处理长文本、附件、快捷发送、中文输入法和生成中的停止状态。

## 已实现

- 文本区域随内容自动增高
- Enter 发送、Shift + Enter 换行
- 输入法组合期间不误发送
- 附件标签与移除操作
- 发送与停止共用主操作位置
- 字符计数、禁用状态和清晰按钮名称

## 使用

```tsx
<PromptComposer
  attachments={attachments}
  onChange={setValue}
  onSubmit={sendPrompt}
  value={value}
  working={working}
/>
```

## 来源与边界

自动增高参考 [MDN HTMLTextAreaElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLTextAreaElement)，键盘行为使用浏览器原生 `KeyboardEvent.isComposing`。源码和视觉均为本项目自研。

在线预览只改变本地状态，不发送提示词或附件。当前资料免费公开，无需支付；打包下载尚未开放。
