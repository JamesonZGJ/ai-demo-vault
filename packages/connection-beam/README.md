# 连接光束

《每天拆一个 AI 产品》第 004 期。

`Connection Beam` 是一个自研的流程连接动效模块。它读取两个节点的真实位置，用 SVG 贝塞尔曲线建立路径，再让高光沿路径循环移动。适合 AI 工作流、Agent 编排、上传处理、自动化流程和产品集成图。

## 包含内容

- `src/ConnectionBeam.tsx`：自研 React 组件
- `parameters.json`：默认参数和取值范围
- `prompts/cursor.md`：Cursor 实现 Prompt
- `prompts/claude.md`：Claude 实现 Prompt
- `INTEGRATION_GUIDE.md`：接入步骤与边界说明
- `LICENSE`：本包的 MIT License

## 设计拆解

1. 读取起点、终点和容器的边界。
2. 把节点中心点转换成容器内坐标。
3. 根据节点方向生成三次贝塞尔曲线。
4. 用短线段和阴影形成沿路径移动的高光。
5. 节点或容器尺寸变化时重新计算，减少错位。

本实现只参考公开的流程连接动效规律，没有复制第三方源码、Logo、插画或页面素材。

## 真实状态

这是本站的自研复刻包。当前资料免费公开，无需支付；打包下载尚未开放。
