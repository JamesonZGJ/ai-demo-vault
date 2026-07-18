# Design

## Product boundary

```text
Demo（免费证据与拆解）
  └─ BlueprintDemoLink（关系与原创/授权说明）
       └─ Blueprint（商品身份）
            └─ BlueprintVersion（不可变交付版本）
                 └─ Artifact / Rights / Validation
                      └─ Offer / Price（销售范围与精确价格）
```

Demo 和 Blueprint 不共享发布状态。一个 Demo 可以没有 Blueprint，也可以连接多个合法复刻方案；一个 Blueprint 可以引用多个灵感 Demo。关系必须写明 `own_case`、`original_rebuild` 或 `licensed_derivative`，不能用页面文案猜测权利。

## Public route design

| 路由 | 数据要求 | 行为 |
|---|---|---|
| `/` | 至少一个可售 Blueprint 才显示商品区 | Blueprint 为主入口，Demo 为第二入口 |
| `/blueprints` | 只读可售 Blueprint、当前版本和激活价格 | 支持真实空状态，不显示草稿或私有路径 |
| `/blueprints/[slug]` | 商品、固定版本、八类清单、权利摘要、Offer、Price | `private/withdrawn` 或未知 slug 返回 404/noindex；Offer `paused` 保留 200 并隐藏购买 |
| `/demos/[slug]` | 现有公开案例和合法 Blueprint 关系 | 无关系时不创建 CTA；有关系时显示来源边界 |
| `/pricing` | 已批准的免费、单品、会员和 Pro 规则 | 未批准价格标为未开放，不进入结账 |
| `/checkout/[offerId]` | 后续：登录用户、服务端激活 Offer/Price | 本 change 不创建该路由；由订单与支付 change 实现 |
| `/checkout/result/[orderId]` | 后续：本人的服务端订单状态 | 本 change 不创建该路由；未来只能显示服务端状态 |
| `/account/*` | 后续：本人的订单、权益、订阅和咨询 | 本 change 只保留现有收藏页；其余由对应 change 创建 |

首阶段不公开死链接。依赖能力没有实现时，导航不显示对应账号入口；本 change 的 Blueprint 优先首页、导航和商品页只在本地/预发布验收，生产公共入口由 `launch-blueprint-001-sales` 在真实交易闭环通过后启用。目标路由合同仍由 `MARKETPLACE_IA.md` 和本 change spec 保留。

预发布预览只存在于受访问控制的非生产部署：可查看 `private/draft` 商品组件，强制 `noindex`、不发送公开分析事件、没有激活 Price 时写“价格未决定”，并隐藏所有结账与权益操作。生产不能通过 URL 参数、Cookie 或普通账号开启该模式。

## Blueprint detail composition

商品详情由以下稳定区块组成：Hero/成交卡、可信交付、成品预览、八类交付物、文件预览、复刻路线、技术架构、创业改造、版本更新、许可与权利、支持与退款、Demo 关系。

以下成交卡状态是后续订单、会员和权益 change 的目标合同，不属于本 change 的运行时行为。本 change 只在受控非生产预览显示“价格未决定”“暂停销售”或无交易入口：

| 状态 | 行为 |
|---|---|
| 游客且可售 | 登录并购买，保留站内回跳 |
| 登录且未拥有 | 立即购买；服务端创建结账 |
| 会员可领取 | 使用会员权益获取；创建独立权益记录 |
| 已拥有 | 进入资料库，不重复创建订单 |
| 旧版本 | 显示实际升级资格 |
| Offer `paused` | 暂停销售，不创建结账 |
| 受控非生产预览 | 价格/政策未决定，不显示交易操作 |
| `private/withdrawn` | 不提供公开商品页或 CTA |

## Data foundation

本 change 的商品基础对象：

| 对象 | 关键职责 |
|---|---|
| `blueprints` | 商品身份、作者/销售方、内容审核和公开可见性 |
| `blueprint_demo_links` | Demo 关系、关系类型、原创/许可声明 |
| `blueprint_versions` | 不可变版本、发布日期、包清单哈希、验证状态 |
| `blueprint_artifacts` | 八类交付物的逻辑分组与格式 |
| `blueprint_files` | 实际包内逐文件路径、大小、SHA-256 和角色 |
| `artifact_rights` | 逐文件来源、许可、商用/修改/再分发结论 |
| `validation_runs/results` | 不可变验证批次、manifest 哈希和逐文件/整包结果 |
| `offers/offer_versions` | 稳定 Offer 与版本化资源、更新、支持和迟到付款规则 |
| `offer_resources` | Offer Version 明确授予的版本、更新和许可资源 |
| `policy_versions` | 许可、退款、服务条款等完整内容哈希、语言和生效版本 |
| `offer_policy_versions` | Offer Version 按政策类型绑定固定 Policy Version，并声明是否结账必需接受 |
| `prices` | Offer Version、整数最小货币单位、币种、周期、税费口径和版本 |

订单、支付、订阅、权益、下载和对账对象由后续依赖 change 创建，本 change 不创建空表或占位 API；后续实现必须遵守 `COMMERCE_SPEC.md`。公开商品查询不返回私有对象键、原始权利证据或未公开文件。

## Publication predicates

Blueprint 只有同时满足以下条件才能公开为可购买商品：

1. 当前版本状态为 `sellable`，版本内容和清单哈希已冻结。
2. 八类必需交付物各有至少一项验证通过的文件。
3. 实际包与逐文件 manifest 在路径、大小和 SHA-256 上完全一致，所有文件权利为 `approved_for_sale`。
4. 不可变验证批次证明无密钥/隐私数据，HTML 可打开、React 可构建、数据结构可导入，其他文档与 Figma 可读取。
5. 只有进入购买状态时，才要求激活 Offer 绑定当前版本、激活精确 Price，以及已批准的客户许可、退款、服务条款、更新和支持版本。
6. Offer 暂停时可保留已批准的公开商品内容，但只显示“暂停销售”，不创建结账。
7. 生产支付、权益和下载 change 尚未完成时，不允许显示“立即购买”或公开商城已可成交。

## Future commerce security contract

以下是后续订单、支付、权益和下载 change 的依赖合同，不属于本 change 的运行时交付：

- 匿名用户只读公开商品摘要、可售版本摘要和激活价格。
- 登录用户只能读取自己的订单、权益、订阅、条款接受和下载授权。
- 客户端不能插入或更新订单、支付、退款、订阅、权益、支付事件或存储对象。
- 支付回调、下载授权和对账使用隔离的 `server-only` 模块；普通页面继续不持有 Service Role Key。
- 私有包没有匿名或登录用户直接读取策略；服务端先校验权益，再签发短期地址。
- 财务与条款记录不随 Auth 用户级联删除；账号删除按政策保留并去标识化。

## Release sequencing

```text
定位与信息架构
→ Offer、许可、退款和精确价格决定
→ Blueprint #001 八类资料包与权利门槛
→ 订单、权益、私有交付
→ 一个生产支付商
→ 真实购买/下载/退款/对账
→ 公共商城上线
→ Builder Pass
→ Pro
→ 扩到 20 个 Blueprint 与更多支付商
```

Demo 内容运营可以并行，不再阻塞第一笔 Blueprint 交易。
