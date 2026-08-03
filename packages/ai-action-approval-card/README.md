# AI 操作授权确认卡

`AI Action Approval Card` 是一个给 AI 工作台和 Agent 使用的受控确认组件。它在敏感操作真正执行前，明确展示动作、影响对象和风险，让用户选择“允许一次”或“拒绝”，并把执行结果留在原位置。

## 适合场景

- 删除或覆盖文件
- 发送消息、邮件或通知
- 发布内容或部署版本
- 修改数据库和外部服务
- 产生费用或改变账号权限

## 组件边界

这个组件只负责展示状态和收集决定，不直接执行任何真实操作。业务层必须在服务端重新验证当前用户、请求对象、授权范围和幂等键，不能把前端按钮点击当成最终权限凭证。

## 状态

- `pending`：等待用户确认，显示允许和拒绝按钮
- `approved`：用户已允许当前请求
- `rejected`：用户拒绝，操作必须立即结束
- `executing`：业务层正在执行
- `complete`：操作成功完成
- `error`：执行失败，需要展示真实错误摘要

## 文件

- `src/AIActionApprovalCard.tsx`：React 组件和状态文字
- `src/ai-action-approval-card.css`：基础样式
- `parameters.json`：参数说明
- `INTEGRATION_GUIDE.md`：接入步骤
- `prompts/`：重新实现提示词
- `LICENSE`：MIT 许可证
