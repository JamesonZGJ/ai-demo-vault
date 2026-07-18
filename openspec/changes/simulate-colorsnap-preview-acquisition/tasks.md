# Tasks

## 0. Confirmed scope

- [x] 0.1 `<files>` 审计 ColorSnap 原型、当前 Demo 数据、Auth、RLS、生产闸门和 Marketplace OpenSpec。
- [x] 0.2 `<action>` 把试用获取拆成独立 change，禁止污染未来真实订单、支付和收入。
- [x] 0.3 `<done>` 用户于 2026-07-17 明确确认 ColorSnap Blueprint #001 模拟商品闭环。

## 1. Product and data

- [x] 1.1 `<files>` 新增 Blueprint、Demo 关系、12 个公开决策区块、七类交付摘要、私有资料、运行时开关和试用访问权 migration/type/query。
- [x] 1.2 `<action>` 本地 seed 写入一个 ColorSnap Blueprint、12 个公开区块和七类真实编辑资料；production migration 默认关闭且无商品数据。
- [x] 1.3 `<verify>` RLS、RPC 幂等、跨用户隔离、未登录拒绝、直接写表拒绝、状态切换和生产开关拒绝全部通过。
- [x] 1.4 `<done>` 商品内容与访问数据不包含假订单、假付款、假收入或未核验下载文件。

## 2. Marketplace experience

- [x] 2.1 `<files>` 新增 Blueprint 目录/详情、ColorSnap Demo 预览、模拟购买页、资料库和响应式样式。
- [x] 2.2 `<action>` 首页和导航改为 Blueprint 优先，免费 Demo 为第二入口；12 个公开区块与七类资料在商品页完整可判断。
- [x] 2.3 `<verify>` 游客、登录未获取、已获取、关闭试用和未知 slug 状态都显示真实结果。
- [x] 2.4 `<done>` 本地能完成“首页 → Demo → Blueprint → 登录 → 模拟购买 → 资料库 → 下载资料样品”。

## 3. Safety and verification

- [x] 3.1 `<files>` 更新环境验证、SEO/分析边界、sitemap、数据库/单元/E2E/生产关闭测试和项目文档。
- [x] 3.2 `<action>` 运行 Review 查 Bug，再做第一性原理精简；不实现会员和支付。
- [ ] 3.3 `<verify>` 数据库、lint、typecheck、unit、E2E、build 和 OpenSpec strict 全部通过。
- [ ] 3.4 `<done>` 用户验收后归档；归档不代表真实支付或生产商城已上线。
