# 拖拽排序列表接入指南

## 1. 准备数据

每个项目需要稳定且唯一的 `id`：

```ts
const items = [
  { id: "prompt", title: "整理提示词", description: "确认输入结构" },
  { id: "model", title: "选择模型", description: "匹配任务类型" },
];
```

不要使用数组下标作为 `id`，否则排序后焦点和状态容易错位。

## 2. 接入组件

```tsx
const [items, setItems] = useState(initialItems);

<SortableList
  ariaLabel="工作流步骤"
  items={items}
  onChange={setItems}
/>
```

## 3. 保存顺序

`onChange` 返回新的完整数组。需要持久化时，只把 `id` 顺序提交给业务接口：

```ts
const order = items.map(({ id }) => id);
```

## 4. 交互要求

- 拖动时保留占位，不让列表高度变化。
- 浮动卡片使用 `pointer-events: none`，确保能检测其下方的目标。
- 手柄设置 `touch-action: none`，列表其余区域仍保留页面滚动。
- 提供上下按钮，满足单次点击或触摸的替代操作。
- 手柄聚焦后支持 `ArrowUp` 和 `ArrowDown`。
- 排序结果通过 `aria-live="polite"` 播报。

## 5. 验收清单

- [ ] 鼠标可以把第一项拖到最后
- [ ] 触屏拖动过程中页面不会误滚动
- [ ] 上下按钮可以完成全部排序
- [ ] 键盘方向键可以完成全部排序
- [ ] 第一项的上移按钮禁用
- [ ] 最后一项的下移按钮禁用
- [ ] 取消拖动后恢复原顺序
- [ ] 360px 宽度下没有横向溢出
