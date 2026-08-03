# 卡片变形弹窗接入指南

## 1. 复制组件和样式

复制 `src/MorphingDialog.tsx` 与 `src/morphing-dialog.css` 到项目组件目录，并在全局样式入口导入 CSS。

## 2. 提供连续内容

```tsx
<MorphingDialog
  eyebrow="AI MODULE"
  title="AI 回复结构"
  description="查看输入、检索和生成状态。"
  visual={<ModuleDiagram />}
>
  <p>这里放完整详情、参数或操作。</p>
</MorphingDialog>
```

`visual` 会同时出现在卡片和弹窗顶部。标题、视觉和边界保持一致，才能形成清楚的空间连续性。

## 3. 不要嵌套交互按钮

触发卡片本身是按钮，`visual` 内不要再放按钮、输入框或链接。需要交互的内容放进弹窗正文。

## 4. 调整目标尺寸

通过 `maxWidth` 和 `maxHeight` 控制桌面端目标尺寸。组件会自动减去视口边距，移动端不会超出屏幕。

## 5. 验收

- 打开时从触发卡片原位置开始。
- 关闭时回到同一张卡片。
- Esc、关闭按钮和点击遮罩均可关闭。
- Tab 不会离开弹窗，关闭后焦点回到原卡片。
- 弹窗打开时页面不能继续滚动。
- 开启减少动画后不播放过渡。
- 360px 宽度下没有横向滚动。
