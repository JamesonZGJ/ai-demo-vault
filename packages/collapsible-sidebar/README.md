# 可折叠侧边栏

英文内部名：`Collapsible Sidebar`

一套同时覆盖桌面展开、图标收起和移动端抽屉的导航侧栏。收起后保留当前项、图标和辅助提示，移动端通过独立按钮打开并支持 Escape 关闭。

## 已实现

- 桌面展开与图标收起
- 当前页面高亮
- 图标模式的 `aria-label` 与 `title`
- `aria-expanded` / `aria-controls`
- 移动端遮罩与抽屉
- Escape 关闭移动端导航
- 点击导航后关闭移动端抽屉

## 使用

```tsx
<CollapsibleSidebar
  activeId={activeId}
  collapsed={collapsed}
  items={items}
  mobileOpen={mobileOpen}
  onCollapsedChange={setCollapsed}
  onMobileOpenChange={setMobileOpen}
  onSelect={setActiveId}
/>
```

## 来源与边界

展开语义参考 [WAI Disclosure Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/disclosure/)，响应式行为参考 [MDN matchMedia](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia)。实现、视觉和数据均为本项目自研。

当前资料免费公开，无需支付；打包下载尚未开放。
