# 命令面板

《每天拆一个 AI 产品》第 005 期。

`Command Palette` 是一个自研的全局操作入口。用户可以通过 `Command/Ctrl + K` 唤起面板，输入关键词过滤命令，再用方向键选择、回车执行或 `Escape` 关闭。它适合操作较多的 AI 工具、后台、编辑器和知识产品。

## 包含内容

- `src/CommandPalette.tsx`：自研 React 组件
- `parameters.json`：参数、命令数据结构和交互状态
- `prompts/cursor.md`：Cursor 实现 Prompt
- `prompts/claude.md`：Claude 实现 Prompt
- `INTEGRATION_GUIDE.md`：接入步骤与验收清单
- `LICENSE`：本包的 MIT License

## 设计拆解

1. 用全局快捷键把高频操作收进一个入口。
2. 输入后即时过滤，并支持中文、英文和关键词别名。
3. 用分组保留信息层级，避免结果变成无结构列表。
4. 让鼠标移动、上下方向键和选中态保持同步。
5. 回车或点击执行后给出明确反馈，`Escape` 随时退出。

## 来源边界

本期研究参考了 Paco Coursey 创建的开源项目 [cmdk](https://github.com/dip/cmdk)。参考项目采用 MIT License。本包没有复制其源码、品牌皮肤、Logo 或演示页面，组件结构、视觉、中文内容和实现均为重新制作。

## 真实状态

这是本站的自研复刻包。当前资料免费公开，无需支付；打包下载尚未开放。
