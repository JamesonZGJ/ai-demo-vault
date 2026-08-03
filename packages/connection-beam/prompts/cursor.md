# Cursor Prompt：实现连接光束

请在当前 React / Next.js 项目中实现一个自研的 `ConnectionBeam` 组件，中文展示名为“连接光束”。不要复制第三方仓库源码、Logo 或素材。

要求：

1. 使用 React、TypeScript、SVG 和 CSS，不新增动画库。
2. 接收容器、起点和终点的 Ref，读取两个节点中心点。
3. 根据横向或纵向布局生成三次贝塞尔曲线路径。
4. 在静态路径上增加循环移动的短高光，支持方向、速度、颜色和宽度参数。
5. 使用 `ResizeObserver`，容器或节点尺寸变化时重新计算路径。
6. 支持 `prefers-reduced-motion`：减少动效时保留静态路径并关闭流动高光。
7. 输出 README、参数说明、Integration Guide 和测试清单。
