# 玻璃光斑卡片接入指南

## 1. 复制组件

将 `src/MagicCard.tsx` 放入 React / Next.js 项目，并保留文件顶部的 `"use client"`。

## 2. 使用组件

```tsx
import { MagicCard } from "./MagicCard";

export function PromptCard() {
  return (
    <MagicCard spotlightSize={32} glowOpacity={0.72} tiltDegrees={1.8}>
      <span>AI PROMPT</span>
      <h2>生成一张产品海报</h2>
      <p>Move your cursor to preview the interaction.</p>
    </MagicCard>
  );
}
```

## 3. 容器样式

组件只负责表面和交互，调用方负责尺寸、内边距和内容颜色：

```css
.prompt-card {
  min-height: 220px;
  padding: 28px;
  border-radius: 20px;
  color: #f8fafc;
}
```

## 4. 接入检查

- 桌面端确认光斑会跟随指针，离开后回到中心。
- 触摸设备仍能正常阅读内容，不依赖 Hover 才能使用。
- 页面已有全局 `prefers-reduced-motion` 策略时，保留内容并关闭倾斜。
- 不把第三方 Logo、源码或受保护素材放入商品包。
