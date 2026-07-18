# Proposal: Simulate ColorSnap preview acquisition

## Why

Marketplace 信息架构只能证明“页面像商品”，不能证明用户能从免费 Demo 走到资料获取。用户已经明确要求优先验证 Blueprint #001：浏览 ColorSnap Demo、查看 Blueprint、模拟购买并取得资料，同时暂缓会员和复杂支付。

本 change 建立一个仅限本地环境的持久试用获取闭环。它不扣款、不创建真实订单、不记录收入，也不代替生产支付验收。

## In scope

- ColorSnap 作为 Blueprint #001 的本地预发布商品样品，明确保留“当前非 AI、闭源、无后端、无商业验证”的事实边界。
- 独立 Blueprint 目录、商品详情的 12 个产品决策区块，以及 7 类可获取资料样品：产品拆解、商业模式、UI 资源、PRD、Prompt、技术方案、营销方案。
- 免费 ColorSnap Demo 预览到 Blueprint 商品页的显式转化入口。
- 登录后通过窄范围 RPC 幂等创建 `pilot_preview` 资料访问权，并进入“我的资料库”。
- 本人资料库可下载一份仅含七类编辑样品的 Markdown 导出；不包含源码、Figma、第三方图片或客户许可。
- 应用私有环境变量与数据库开关双闸门；本地 seed 开启，migration 默认关闭。
- Blueprint 预览页、模拟获取页和资料库均 `noindex`，不发送公开分析事件。

## Out of scope

- Stripe、支付宝、微信支付、真实扣款、真实订单、发票、退款、收入或对账。
- Builder Pass、Pro、订阅、额度、咨询和多卖家市场。
- 把站长提交文件的位置当作权利证明，或把 ColorSnap 当前原型描述成 AI 成品。
- 公开下载源码、Figma、第三方 mock 图片或任何未完成逐文件权利核验的资产；本地仅允许本人下载编辑样品导出。
- 在生产或普通预览部署开启模拟获取。

## Success criteria

1. 本地首页先解释 Blueprint 购买价值，免费 Demo 为第二入口。
2. `/demos/colorsnap` 明确展示当前原型事实，并能进入 `/blueprints/colorsnap-blueprint`。
3. 商品页完整展示 12 个产品决策区块和 7 类资料样品、价格未决定、版本、来源与未实现边界。
4. 未登录用户先登录；已登录用户确认“不扣款、不创建支付交易”后只生成一条幂等资料访问权。
5. 资料库只能由本人读取，跨用户和直接写表均被 RLS 拒绝。
6. 已获取用户能下载一份标记为样品、无客户许可的 Markdown 导出；未获取用户和生产环境下载 URL 返回 404。
7. 生产环境即使访问 URL 或直接调用 RPC，也不能看见商品、创建访问权或读取资料。

## Confirmation

用户于 2026-07-17 明确要求模拟 ColorSnap Blueprint #001 完整商品闭环，本 change 直接进入 apply。
