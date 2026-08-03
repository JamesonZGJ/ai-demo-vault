# Cursor 提示词：可折叠侧边栏

请在 React + TypeScript 项目中实现 `CollapsibleSidebar`。

要求：

1. 桌面支持完整标题和图标收起两种状态。
2. 移动端改为遮罩抽屉，不挤压主内容。
3. 当前项使用 `aria-current="page"`。
4. 切换按钮使用 `aria-expanded` 和 `aria-controls`。
5. 图标模式给每项保留 `aria-label` 和悬停提示。
6. Escape、遮罩点击和导航选择都能关闭移动端抽屉。
7. 状态由外部控制，不在组件内部持久化。
8. 支持减少动画偏好和 360px 宽度。
9. 输出组件、样式、接入示例和状态测试。
