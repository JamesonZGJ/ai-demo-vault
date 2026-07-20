# 玻璃拟态卡片接入指南

## 1. 复制组件

将 `src/GlassCard.tsx` 放入你的 React / Next.js 项目，并确保文件顶部保留 `"use client"`。组件只依赖 React，不需要额外的动画库。

## 2. 使用组件

```tsx
import { GlassCard } from "./GlassCard";

export function ResultCard() {
  return (
    <GlassCard blur={20} opacity={0.14} glowOpacity={0.2}>
      <p>AI 生成结果</p>
    </GlassCard>
  );
}
```

## 3. 给容器补充尺寸

组件只负责表面和交互，不强行决定布局。调用方应设置 `padding`、`border-radius`、`min-height` 和内容颜色：

```css
.result-card {
  min-height: 180px;
  padding: 24px;
  border-radius: 20px;
  color: #f8fafc;
}
```

## 4. 接入检查

- 深色背景比纯白背景更容易看到玻璃层次。
- 同一屏最多使用两到三层玻璃，避免内容对比度下降。
- 保持文本对比度，必要时提高 `opacity` 或减少背景噪声。
- 对需要键盘触发的操作，结合 `onClick` 并补充可见的焦点样式。
- 动效敏感场景请在宿主项目中根据 `prefers-reduced-motion` 降低倾斜效果。

## 5. 边界

组件不包含设计系统、支付、下载和第三方素材。所有参数都可以由宿主项目覆盖。
