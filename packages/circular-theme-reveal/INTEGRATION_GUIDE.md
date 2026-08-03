# 圆形主题切换接入指南

## 1. 复制组件

复制 `src/CircularThemeReveal.tsx` 到项目组件目录。

## 2. 渲染两套主题

```tsx
<CircularThemeReveal initialTheme="light">
  {(theme) => <Dashboard theme={theme} />}
</CircularThemeReveal>
```

`children` 会按当前主题渲染内容。切换时组件会短暂渲染下一主题作为覆盖层。

## 3. 添加必要样式

```css
.circular-theme-reveal {
  overflow: hidden;
  position: relative;
}

.circular-theme-reveal-layer {
  min-height: inherit;
}

.circular-theme-reveal-overlay {
  inset: 0;
  pointer-events: none;
  position: absolute;
  z-index: 2;
}

.circular-theme-reveal-trigger {
  position: absolute;
  right: 20px;
  top: 20px;
  z-index: 3;
}
```

## 4. 接入主题状态

通过 `onThemeChange` 把切换后的主题同步到应用状态或本地存储。不要在动画开始前替换当前内容，否则圆形覆盖层会失去对照。

## 5. 验收

- 圆形从按钮中心开始扩张。
- 最终覆盖四个角。
- 快速重复点击不会产生重叠动画。
- Tab 能聚焦按钮，Enter 和 Space 可切换。
- 开启“减少动画”后立即完成切换。
- 360px 宽度下没有横向滚动。
