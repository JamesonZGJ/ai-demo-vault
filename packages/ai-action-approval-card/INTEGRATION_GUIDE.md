# AI 操作授权确认卡接入指南

## 1. 复制组件

复制以下文件到项目：

- `src/AIActionApprovalCard.tsx`
- `src/ai-action-approval-card.css`

在全局样式入口引入 CSS，然后从业务页面引入组件。

## 2. 由业务层保存状态

```tsx
const [status, setStatus] = useState<ApprovalStatus>("pending");

<AIActionApprovalCard
  action="删除临时导出文件"
  target="/exports/draft-preview.png"
  risk="删除后无法从当前任务中恢复"
  status={status}
  onApprove={() => approveRequest()}
  onReject={() => rejectRequest()}
/>
```

组件是受控组件。服务器返回什么状态，页面就展示什么状态；不要只在前端假装执行成功。

## 3. 服务端再次验证

用户点击允许后，发送一次带有请求编号的确认。服务端至少重新检查：

- 当前用户是否仍有权限
- 动作和对象是否与确认时一致
- 请求是否已经执行过
- 授权是否只用于这一次请求
- 操作失败时是否返回可读错误

拒绝后必须终止对应任务，不能继续在后台执行。

## 4. 保留审计信息

建议记录请求编号、动作、对象、风险摘要、决定、决定时间和执行结果。页面可以显示对用户有用的摘要，但不要泄露密钥、内部路径或敏感数据。

## 5. 可用性检查

- 两个按钮使用清楚文字，不只放图标
- 默认焦点不能落在高风险允许按钮上
- 状态变化通过 `aria-live` 读出
- 移动端按钮保持足够点击面积
- 颜色以外还要有文字说明
