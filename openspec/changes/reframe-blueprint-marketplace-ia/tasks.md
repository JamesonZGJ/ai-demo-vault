# Tasks

## 0. Proposal

- [x] 0.1 `<files>` 审计首页、导航、路由、Demo 详情、sitemap、数据库、`UI_SPEC.md`、`COMMERCE_SPEC.md` 和 `ROADMAP.md`。
- [x] 0.2 `<action>` 固定 Blueprint 为商品、Demo 为免费入口、Entitlement 为购买后权利，并限定首阶段为本站自营精选商店。
- [x] 0.3 `<verify>` 创建 `MARKETPLACE_IA.md`、审计数据、proposal、design、行为 spec 和 tasks；不把规划写成已实现。
- [x] 0.4 `<done>` 用户于 2026-07-17 确认进入 apply，并要求优先完成 ColorSnap Blueprint #001。

## 1. Product positioning and navigation

- [ ] 1.1 `<files>` 更新首页、全局导航、页脚、metadata、sitemap 和公开分析路径合同。
- [ ] 1.2 `<action>` 在本地/预发布让 Blueprint 市场成为主入口，免费 AI 案例和收藏能力继续可用；生产公共入口保持关闭。
- [ ] 1.3 `<verify>` 无可售 Blueprint 时不显示假商品、假价格或可用购买按钮；404、noindex 和统计边界正确。
- [ ] 1.4 `<done>` 360/768/1440px 的预发布首页与导航主次一致，现有 Demo 流程无回归；未通过成交闸门时生产不宣称商城可用。

## 2. Blueprint product foundation

- [ ] 2.1 `<files>` 新增 Blueprint、Demo 关系、版本、八类 Artifact、逐文件 manifest/权利、验证批次、Offer/Policy Version、资源范围和 Price 的版本化 migration、类型与测试。
- [ ] 2.2 `<action>` 固定多轴状态、版本冻结、逐文件包一致、版本化政策、精确价格、公开候选查询和私有字段边界。
- [ ] 2.3 `<verify>` pgTAP 拒绝缺交付物、包与 manifest 不一致、文件权利未通过、验证缺失、版本原地修改和公开私有路径；无激活 Offer/Price 只拒绝进入购买状态，不误伤 Offer `paused` 的公开 200 商品。
- [ ] 2.4 `<done>` 公开用户只读合格商品摘要，客户端不能写商品发布或价格状态。

## 3. Blueprint catalog and detail

- [ ] 3.1 `<files>` 在本地/预发布新增 `/blueprints`、`/blueprints/[slug]`、商品卡、详情区块、成交卡、空态、错误态和响应式样式；生产入口受商城闸门控制。
- [ ] 3.2 `<action>` 展示成品、可信交付、八类清单、复刻路线、架构、改造、版本、许可、支持、退款和 Demo 关系。
- [ ] 3.3 `<verify>` 生产草稿/撤下商品真实 404；受控非生产预览强制 noindex、无公开分析、无结账且允许“价格未决定”；可售商品 SEO、键盘和无障碍通过；不泄露文件地址。
- [ ] 3.4 `<done>` 用户能在一个页面判断买到什么、能否运行、能否商用、当前价格/政策状态和未来如何交付。

## 4. Demo conversion and pricing explanation

- [ ] 4.1 `<files>` 更新 Demo 卡片/详情查询与对应 Blueprint 模块，新增 `/pricing` 的已批准方案说明。
- [ ] 4.2 `<action>` 只有真实可售关系才显示商品入口；第三方灵感显示原创复刻声明。
- [ ] 4.3 `<verify>` 无商品、停售、草稿、闭源和会员未开放状态都显示真实结果，不生成死链接或禁用假 CTA。
- [ ] 4.4 `<done>` Demo 保持公开 SEO 入口，并可追溯地导向合法商品。

## 5. Dependency and release gates

- [ ] 5.1 `<files>` 建立公共商城发布检查；结账、订单、资料库、会员、咨询和下载只记录在目标文档，不创建运行时路由、API 或空表。
- [ ] 5.2 `<action>` 要求一个自营 Blueprint 的生产购买、下载、退款和对账证据；证据不足时生产 Blueprint 导航、商城声明和购买入口全部关闭。
- [ ] 5.3 `<verify>` 收藏不等于拥有；未实现交易入口不出现在导航或商品页；缺生产证据时发布检查失败。
- [ ] 5.4 `<done>` 后续支付与会员 change 可以在不重写信息架构的前提下接入。

## 6. Review and handoff

- [ ] 6.1 `<files>` 更新 `CONTEXT.md`、`README.md`、`ARCHITECTURE.md`、`ROADMAP.md`、`GOAL_COVERAGE.md` 和测试记录。
- [ ] 6.2 `<action>` 执行 Review 查 Bug，再做第一性原理精简；删除重复概念，不增加兜底路径。
- [ ] 6.3 `<verify>` 运行数据库、单元、E2E、构建和 OpenSpec strict；现有 Demo 与收藏全部回归通过。
- [ ] 6.4 `<done>` 用户验收后归档；归档只表示 Marketplace 信息架构和商品基础完成，不表示支付、会员或 Blueprint #001 已成交。
