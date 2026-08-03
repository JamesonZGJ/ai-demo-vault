# AI 思考过程面板接入指南

## 1. 复制组件与样式

复制 `src/AIReasoningPanel.tsx` 和 `src/ai-reasoning-panel.css`，并在项目样式入口导入 CSS。

## 2. 由业务层提供状态

```tsx
<AIReasoningPanel
  status="streaming"
  summary="正在整理问题范围与可公开的处理步骤。"
  durationLabel="2.4 秒"
>
  <p>识别问题范围</p>
  <p>整理相关信息</p>
</AIReasoningPanel>
```

状态支持 `idle`、`waiting`、`streaming`、`complete` 和 `error`。组件只负责展示；真实请求、取消、错误与数据安全由业务层处理。

## 3. 使用公开摘要

`summary` 和正文应使用面向用户的处理摘要，例如“正在检索相关资料”或“正在整理答案结构”。不要把模型隐藏推理、系统提示词或敏感内部日志直接暴露给用户。

## 4. 调整完成后的收起时间

使用 `autoCloseDelay` 控制完成后延迟，默认 1200 毫秒。用户手动展开或收起后，组件会优先保留用户选择。

## 5. 验收

- 等待与生成状态会自动展开。
- 完成或错误状态会延迟收起。
- 手动切换后不会被自动关闭覆盖。
- 按钮具备 `aria-expanded` 与 `aria-controls`。
- 状态变化有可读文字，不只依赖颜色。
- 360px 宽度下没有横向滚动。
- 开启减少动画后不播放展开过渡。
