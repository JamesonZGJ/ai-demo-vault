# AI Agent 任务收件箱接入指南

## 1. 复制组件

复制以下文件到项目：

- `src/AgentTaskInbox.tsx`
- `src/agent-task-inbox.css`

在全局样式入口引入 CSS，然后从工作台页面引入组件。

## 2. 准备任务数据

```tsx
const tasks: AgentTaskItem[] = [
  {
    id: "sync-assets",
    title: "同步首页设计资源",
    status: "needs_attention",
    summary: "发现 2 个同名图标，任务已暂停。",
    attentionReason: "需要确认是否覆盖同名文件",
    updatedAt: "刚刚",
    actionLabel: "处理冲突",
  },
];

<AgentTaskInbox
  tasks={tasks}
  selectedTaskId={selectedTaskId}
  onSelectTask={(task) => openTask(task.id)}
/>
```

## 3. 由业务层提供真实状态

组件不会连接 Agent。服务端或任务系统应提供稳定的任务编号、当前状态、最近进度、更新时间和需要用户处理的原因。任务状态变化后，用新数组更新 `tasks`。

## 4. 保留原执行上下文

用户打开任务时，应回到原对话、审查页或执行详情。不要丢失已经生成的结果，也不要让用户从头重做决定。

## 5. 可用性检查

- 状态同时使用文字和颜色
- 需要处理的原因必须可读
- 筛选按钮提供 `aria-pressed`
- 进度条提供可读的百分比说明
- 所有任务卡支持键盘打开
- 360px 宽度下不产生横向滚动
