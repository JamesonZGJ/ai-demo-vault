# 图片桌宠

英文内部名：`Image Desktop Pet`

把一张本地图片放进可拖拽的透明角色容器，并补上边界限制、待机呼吸和键盘移动。它适合网页悬浮助手、桌面壳应用和互动角色原型。

## 已实现

- 支持 PNG、JPG、WebP 和浏览器 Blob URL
- Pointer Events 拖拽与 Pointer Capture
- 自动限制在父容器边界内
- 方向键移动和可读操作名称
- 待机呼吸与拖动反馈
- `prefers-reduced-motion` 时关闭待机动画
- 父容器尺寸变化后重新限制位置
- 360px 移动端布局

## 使用

```tsx
<div className="pet-stage">
  <ImageDesktopPet
    alt="我的桌宠"
    size={156}
    src="/my-pet.png"
  />
</div>
```

父容器必须使用 `position: relative` 并提供明确高度。透明 PNG 的效果最好；普通照片也能载入，但模块不会伪装成通用 AI 抠图工具。

## 桌面常驻边界

网页预览只验证图片、拖拽、边界和待机动作。要让角色常驻系统桌面，需要接入 Electron 或 Tauri 的透明、无边框、置顶窗口，并单独处理多显示器与点击穿透。

当前资料免费公开，无需支付；打包下载尚未开放。
