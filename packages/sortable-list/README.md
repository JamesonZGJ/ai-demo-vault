# 拖拽排序列表

《每天拆一个 AI 产品》第 007 期。

`Sortable List` 是一个自研的列表重排组件。用户可以拖动手柄调整项目顺序，也可以使用上下按钮或键盘方向键完成相同操作。适合提示词步骤、AI 工作流、任务优先级、素材队列和看板列表。

## 包含内容

- `src/SortableList.tsx`：自研 React 组件与纯排序函数
- `parameters.json`：参数、状态和可访问性说明
- `prompts/cursor.md`：Cursor 实现提示词
- `prompts/claude.md`：Claude 实现提示词
- `INTEGRATION_GUIDE.md`：接入步骤与验收清单
- `LICENSE`：本包的 MIT License

## 设计拆解

1. 拖动开始后保留原位置的占位，避免列表突然塌陷。
2. 浮动卡片跟随指针，其余卡片提前移动，让落点在松手前可见。
3. 重排只改变数组顺序，不把视觉坐标写进业务数据。
4. 指针捕获让鼠标或手指移出手柄后，拖动仍能连续完成。
5. 上下按钮和键盘方向键提供不依赖拖拽的替代操作。
6. `aria-live` 会播报项目的新位置，方便辅助技术确认结果。

## 来源边界

本期研究参考了 [Pointer Events 的指针捕获说明](https://developer.mozilla.org/en-US/docs/Web/API/Element/setPointerCapture)、[getBoundingClientRect](https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect) 和 [WCAG 2.2 拖拽替代操作说明](https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements.html)。同时观察了 dnd-kit 的公开交互能力与 MIT 许可证，但没有复制其源码、示例视觉或品牌素材。

## 真实状态

当前在线预览只在浏览器内调整静态示例顺序，不保存到服务器。资料免费公开，无需支付；打包下载尚未开放。
