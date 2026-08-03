# Cursor Prompt：实现命令面板

请在当前 React / Next.js 项目中实现一个自研的 `CommandPalette` 组件，中文展示名为“命令面板”。不要复制第三方仓库源码、品牌皮肤、Logo 或演示素材。

要求：

1. 使用 React、TypeScript 和 CSS，不新增命令菜单依赖。
2. 支持 `Command/Ctrl + K` 唤起、`Escape` 关闭。
3. 输入后即时过滤，支持 label、group、description 和 keywords 别名。
4. 支持上下方向键循环选择、回车执行、鼠标选择和自动滚入视口。
5. 支持分组、快捷键提示、无结果状态和执行反馈。
6. 使用 dialog、combobox、listbox、option 和 `aria-activedescendant` 建立可访问性关系。
7. 把业务动作通过 `onRun(command)` 交给调用方，不在组件里写死路由或接口。
8. 输出 README、参数说明、Integration Guide 和测试清单。
