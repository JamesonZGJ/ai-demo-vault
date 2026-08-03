# 文本选区工具栏

英文内部名：`Text Selection Toolbar`

用户选中文字后，在选区附近显示一组上下文操作；取消选择后自动隐藏。适合 AI 写作、翻译、知识库和富文本编辑器。

## 已实现

- 只在有效文本选区内出现
- 根据 `Range.getBoundingClientRect()` 跟随选区定位
- 靠近容器左右边缘时自动收住
- 上方空间不足时切换到选区下方
- 按下工具栏时保留原选区
- 编辑器滚动或窗口缩放后重新定位
- 支持自定义操作和回调
- 360px 移动端布局

## 使用

```tsx
<TextSelectionToolbar
  actions={[
    { id: "rewrite", label: "改写" },
    { id: "shorten", label: "精简" },
    { id: "explain", label: "解释" },
  ]}
  onAction={({ actionId, selectedText }) => {
    console.log(actionId, selectedText);
  }}
>
  <p>选择这段文字，查看上下文工具栏。</p>
</TextSelectionToolbar>
```

本组件只负责选择、定位和操作入口，不包含模型请求。接入真实 AI 时，必须由业务层处理请求、错误、取消和结果写回。

当前资料免费公开，无需支付；打包下载尚未开放。
