# 堆叠通知

英文内部名：`Toast Stack`

一个把多条状态反馈组织成稳定队列的通知组件。新通知进入时，旧通知依次后退；展开后可以阅读完整内容，关闭任意一条后其余通知会连续补位。

## 已实现

- 受控通知队列
- 折叠堆叠与展开列表
- 最多显示 1–6 条通知
- 默认、成功、提醒和失败四种状态
- 可控进度条、操作按钮和关闭按钮
- `aria-live`、状态文本和键盘可操作按钮
- `prefers-reduced-motion` 时关闭位移动画
- 360px 移动端布局

## 使用

```tsx
<ToastStack
  expanded={expanded}
  items={toasts}
  onDismiss={(id) => setToasts((items) => items.filter((item) => item.id !== id))}
/>
```

## 来源与边界

交互规律参考 [Sonner](https://sonner.emilkowal.ski/) 的通知堆叠方式；参考项目采用 MIT License。本站组件的源码、视觉、参数和接入方式均为重新实现，没有复制第三方代码或品牌页面。

当前资料免费公开，无需支付；打包下载尚未开放。
