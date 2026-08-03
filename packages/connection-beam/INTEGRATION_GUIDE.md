# 连接光束接入指南

## 1. 复制组件

将 `src/ConnectionBeam.tsx` 放入 React / Next.js 项目，并保留文件顶部的 `"use client"`。

## 2. 准备节点引用

```tsx
const containerRef = useRef<HTMLDivElement>(null);
const inputRef = useRef<HTMLDivElement>(null);
const modelRef = useRef<HTMLDivElement>(null);
```

容器必须使用相对定位，两个节点需要处于同一容器坐标系中。

## 3. 添加光束

```tsx
<div ref={containerRef} style={{ minHeight: 320, position: "relative" }}>
  <div ref={inputRef}>输入</div>
  <div ref={modelRef}>模型</div>
  <ConnectionBeam
    containerRef={containerRef}
    fromRef={inputRef}
    toRef={modelRef}
    curvature={0.45}
    duration={2.4}
  />
</div>
```

## 4. 接入检查

- 调整窗口尺寸，确认路径仍连接节点中心。
- 测试横向、纵向和斜向排列。
- 页面隐藏或折叠节点时，不要保留指向不可见节点的光束。
- 减少动效场景应保留静态路径，并允许关闭流动高光。
- 不把第三方 Logo、源码或受保护素材放入商品包。
