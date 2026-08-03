# Cursor 提示词：图片桌宠

请在现有 React + TypeScript 项目中实现一个可复用的 `ImageDesktopPet`。

要求：

1. 接受 PNG、JPG、WebP 和 Blob URL，不伪造通用背景移除能力。
2. 使用 Pointer Events 和 Pointer Capture 实现拖拽。
3. 位置由指针起点差值计算，不在每一帧累加误差。
4. 角色始终限制在父容器边界内。
5. 父容器变化时重新校正位置。
6. 提供方向键移动和可读操作名称。
7. 待机状态使用轻微呼吸动作，拖动时给出明确反馈。
8. 支持 `prefers-reduced-motion` 和 360px 移动端。
9. 交付组件、样式、参数说明、接入示例和纯函数测试。

如果目标是系统桌宠，只把组件作为角色层；透明、置顶、无边框和点击穿透交给 Electron 或 Tauri 窗口层。
