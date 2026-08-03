# 玻璃光斑卡片

《每天拆一个 AI 产品》第 002 期。

`Magic Card` 是一个自研的鼠标跟随光斑能力模块。它把指针位置、径向高光、边框反馈和轻微倾斜整理成可复用的 React 组件，适合 AI 产品卡片、Pricing Card、Prompt 结果和 Dashboard。

## 包含内容

- `src/MagicCard.tsx`：自研 React 组件
- `parameters.json`：默认参数和取值范围
- `prompts/cursor.md`：Cursor 实现 Prompt
- `prompts/claude.md`：Claude 实现 Prompt
- `INTEGRATION_GUIDE.md`：接入步骤与边界说明
- `LICENSE`：本包的 MIT License

## 设计拆解

1. 读取卡片内部的指针坐标。
2. 用径向渐变绘制局部光斑。
3. 用半透明边框和阴影建立卡片边界。
4. 用小幅 3D 倾斜提供空间反馈。
5. 离开卡片时回到中心位置，移动端仍保留可读内容。

本实现只参考公开交互规律，不复制 Magic UI 的源码、Logo、插画或页面素材。

## 真实状态

这是 AI Demo Vault 的自研复刻包。当前资料免费公开，无需支付；打包下载尚未开放。
