# 《每天拆一个 AI 产品》第001期：玻璃拟态卡片

## Build Block

- 内部名称：`Glass Surface`
- 展示名称：玻璃拟态卡片
- 编号：`Build Block #001`
- 分类：视觉效果
- 难度：简单
- Mock 价格：¥4

## 为什么 AI 产品喜欢使用玻璃拟态卡片

Glass Card 不是单纯的半透明装饰。它把内容从背景中分离出来，同时保留背景的空间感，因此特别适合 AI 产品里经常出现的结果卡、工具面板、浮层和媒体预览。

### 设计特点

1. 半透明填充：保留背景层次，不让卡片变成完全不透明的色块。
2. 背景模糊：让卡片后面的内容变得柔和，建立前后景深。
3. 细边框：在复杂背景上给卡片一个清晰轮廓。
4. 柔和阴影：把卡片从页面中抬起来，但不制造厚重感。
5. 局部高光：用少量光晕提示卡片的交互区域。

### 交互特点

- 鼠标移动时，高光跟随指针位置变化。
- Hover 时边框和阴影略微增强。
- 触摸设备不依赖 Hover，仍然保持清晰层级。
- Blur、透明度、边框和光晕都可以通过参数调整。

### 为什么舒服

- 它比纯色卡片更有空间感。
- 它比强烈渐变更克制。
- 它能把背景和内容同时保留下来。
- 它给 AI 结果卡增加了“悬浮在工作台上”的感觉。
- 轻微的鼠标反馈让卡片变得可感知，但不会打断阅读。

## 参考产品

本期只研究公开可观察的视觉和交互模式，不复制第三方源码、品牌、Logo 或素材。

- Cursor：深色工作区中的面板分层
- Vercel：高对比页面中的半透明浮层和微光
- Perplexity：结果内容和来源卡片的层级关系
- Raycast：悬浮面板、搜索结果和快速操作
- Linear：克制的边框、阴影和状态反馈
- OpenAI 产品：输入、结果和工具面板的层次分离

## 自研实现

本期实现的是一个独立的 React + CSS Build Block，包含：

- `backdrop-filter: blur()` 背景模糊
- 半透明填充
- 细边框
- 柔和阴影
- 指针跟随光晕
- Hover 状态
- 响应式布局
- `prefers-reduced-motion` 兼容
- 无第三方源码复制

## 内容交付

- Live Demo：网站详情页中的可交互预览
- Source：`packages/glass-surface/src/GlassCard.tsx`
- Cursor Prompt：`packages/glass-surface/prompts/cursor.md`
- Claude Prompt：`packages/glass-surface/prompts/claude.md`
- README：`packages/glass-surface/README.md`
- 参数说明：`packages/glass-surface/parameters.json`
- Integration Guide：`packages/glass-surface/INTEGRATION_GUIDE.md`
- License：`packages/glass-surface/LICENSE`

## SEO 关键词

玻璃拟态卡片、Glass Card、Glassmorphism、React 玻璃效果、AI Dashboard UI、Backdrop Blur、鼠标跟随光晕。
