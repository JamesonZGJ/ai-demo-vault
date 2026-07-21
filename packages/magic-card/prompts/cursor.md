# Cursor Prompt：实现玻璃光斑卡片

请在当前 React / Next.js 项目中实现一个自研的 `MagicCard` 组件，中文展示名为“玻璃光斑卡片”。内部不要复制任何第三方仓库源码、Logo 或素材。

要求：

1. 只使用 React、TypeScript 和 CSS，不新增动画库。
2. 通过 Pointer Events 读取卡片内部的指针坐标。
3. 使用径向渐变绘制跟随指针的光斑，并让边框强度随 Hover 提升。
4. 支持 `spotlightSize`、`glowOpacity`、`tiltDegrees`、`className` 和 `onClick` 参数。
5. 指针离开时平滑回到中心，触摸设备仍保持内容可读。
6. 支持 `prefers-reduced-motion`：减少动效时关闭 3D 倾斜。
7. 输出 README、参数说明、Integration Guide 和测试清单。
