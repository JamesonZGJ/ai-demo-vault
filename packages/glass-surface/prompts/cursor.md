# Cursor Prompt：实现玻璃拟态卡片

请在当前 React / Next.js 项目中实现一个可复用的 Glass Card 组件，中文产品名称为“玻璃拟态卡片”，内部组件名使用 `GlassCard`。

要求：

1. 使用 TypeScript 和 React，不引入新的动画库。
2. 通过 props 暴露 `blur`、`opacity`、`borderOpacity`、`shadowOpacity`、`glowOpacity`。
3. 使用 `backdrop-filter`、半透明背景、细边框和内高光建立玻璃表面。
4. 监听 pointer move，在卡片内部显示跟随指针的 radial glow，并加入不超过 2.25° 的轻微倾斜。
5. pointer leave 时恢复中心位置；触摸设备仍需正常展示，不能依赖 hover 才能阅读内容。
6. 不要复制任何第三方产品源码或素材，只参考通用交互原理。
7. 组件不负责布局，调用方通过 className 设置宽度、内边距和圆角。
8. 输出组件、最小使用示例和测试清单，并检查 `prefers-reduced-motion` 的接入边界。
