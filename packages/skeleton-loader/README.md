# 骨架屏加载

英文内部名：`Skeleton Loader`

一个接近最终内容结构的加载占位组件。它保留头像、标题、正文和操作区的位置，让真实内容出现时不需要重新推开页面。

## 已实现

- 受控 `loading` 状态
- 1–8 行稳定骨架结构
- 可选头像占位
- `aria-busy` 与加载状态文本
- `prefers-reduced-motion` 时关闭流光
- 内容出现前后保持同一张卡片尺寸

## 使用

```tsx
<SkeletonLoader loading={loading} rows={4}>
  <ProjectSummary />
</SkeletonLoader>
```

## 来源与边界

状态语义参考 [WAI-ARIA 1.2 的 aria-busy](https://www.w3.org/TR/wai-aria/#aria-busy)。源码、视觉和接入方式均为本项目自研，没有复制第三方组件代码或品牌页面。

当前资料免费公开，无需支付；打包下载尚未开放。
