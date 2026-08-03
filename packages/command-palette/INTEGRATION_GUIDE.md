# 命令面板接入指南

## 1. 复制组件

将 `src/CommandPalette.tsx` 放入 React / Next.js 项目。组件使用浏览器键盘事件，因此需要保留文件顶部的 `"use client"`。

## 2. 准备命令

```tsx
const commands = [
  {
    id: "new-project",
    label: "新建项目",
    description: "创建一个空白工作区",
    group: "项目",
    keywords: ["create", "新建", "workspace"],
    shortcut: "N",
  },
  {
    id: "open-settings",
    label: "打开设置",
    group: "系统",
    keywords: ["settings", "偏好"],
    shortcut: "S",
  },
];
```

每条命令必须有稳定且唯一的 `id`。`keywords` 用于补充中文、英文和业务别名，不显示在界面中。

## 3. 接入执行逻辑

```tsx
<CommandPalette
  commands={commands}
  onRun={(command) => {
    if (command.id === "new-project") {
      openProjectCreator();
    }
  }}
/>
```

组件只负责发现和选择命令；路由跳转、弹窗、API 调用等业务动作由 `onRun` 处理。

## 4. 接入检查

- 在 macOS 测试 `Command + K`，在 Windows 测试 `Ctrl + K`。
- 确认输入中文、英文和别名时都能找到正确命令。
- 用上下方向键循环选中，确认选项会自动滚入可见区域。
- 用回车和点击分别执行同一条命令，结果应一致。
- 用 `Escape` 和点击遮罩关闭，焦点不应被困住。
- 检查无结果状态、长列表、移动端和屏幕阅读器标签。
- 不把第三方品牌皮肤、Logo 或未授权素材放入商品包。
