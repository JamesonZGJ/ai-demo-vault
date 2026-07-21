# 《每天拆一个 AI 产品》第 002 期：玻璃光斑卡片

## Build Block

- 内部名称：`Magic Card`
- 中文标题：玻璃光斑卡片
- 编号：`#002`
- 分类：UI Interaction
- 状态：已完成自研 Preview，等待商品发布流程确认

## 来源核查

- 参考产品：Magic UI Magic Card
- 原始链接：https://magicui.design/docs/components/magic-card
- 代码仓库：https://github.com/magicuidesign/magicui
- 作者/维护方：Magic UI / magicuidesign
- 当前页面可见信号：GitHub 页面显示约 21.6k Stars、1.1k Forks
- 许可证：参考仓库标注 MIT；本包只参考交互规律，不复制第三方源码、Logo 或素材

## 本期拆解

1. 用 Pointer Events 读取卡片内部坐标。
2. 用 radial-gradient 绘制局部光斑。
3. 用半透明边框和阴影建立空间边界。
4. 用限制在 3° 以内的倾斜提供反馈。
5. 离开时回到中心，减少动效时关闭倾斜。

## 包内资产

- Live Preview：`/explore/magic-card`
- Source：`packages/magic-card/src/MagicCard.tsx`
- Cursor Prompt
- Claude Prompt
- README
- Parameters
- Integration Guide
- License

## 真实性边界

当前网站仍未连接支付、订单和下载。页面中的价格是展示策略，不代表已售卖。视频只展示短暂的来源说明和自研复刻，不搬运第三方视频。
