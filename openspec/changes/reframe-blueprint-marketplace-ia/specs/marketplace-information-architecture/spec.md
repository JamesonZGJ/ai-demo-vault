# Blueprint marketplace information architecture delta

## ADDED Requirements

### Requirement: Blueprint-first positioning

系统 SHALL 把 Blueprint 复刻资料包作为核心产品，把 Demo 作为免费发现与信任入口，不得把免费案例库描述成最终交易产品。

#### Scenario: Visitor enters the home page

- **GIVEN** 公共商城已经通过上线闸门
- **WHEN** 游客打开首页
- **THEN** 首屏先解释购买 Blueprint 后获得的完整复刻结果
- **AND** 主操作进入 Blueprint 目录，免费 Demo 为第二操作

#### Scenario: Reviewer opens the pre-release experience

- **GIVEN** 公共商城闸门仍为关闭
- **AND** 审核者进入受访问控制的非生产部署
- **WHEN** 审核者打开首页或一个 `private/draft` Blueprint 预览
- **THEN** 页面按 Blueprint 优先结构展示真实空态或合格候选
- **AND** 页面强制 `noindex`、不发送公开分析事件；没有激活 Price 时显示“价格未决定”
- **AND** 不提供生产结账、订单、会员或下载入口

#### Scenario: Production user tries to enable preview

- **GIVEN** 请求到达生产环境
- **WHEN** 用户通过查询参数、Cookie 或普通账号尝试开启 Blueprint 预览
- **THEN** 系统拒绝预览并执行正常公开可见性规则
- **AND** 不泄露 `private/draft` 商品、价格或文件存在

#### Scenario: No Blueprint has passed the sale gate

- **GIVEN** 当前没有可售且可真实交付的 Blueprint
- **WHEN** 页面渲染商品区域
- **THEN** 系统显示真实准备状态或保持商城未公开
- **AND** 不生成假商品、假价格、假销量或可用购买按钮

### Requirement: Separate Demo and Blueprint

系统 SHALL 独立保存 Demo 和 Blueprint，并用显式关系说明免费案例与商品的来源、原创和许可边界；本 change 不创建 Entitlement 或把收藏当成购买权利。

#### Scenario: Third-party Demo has an original rebuild

- **GIVEN** 一个公开 Demo 来自第三方产品
- **AND** 本站有一个自行实现且权利通过的 Blueprint
- **WHEN** 两者建立商品关系
- **THEN** 关系标记为 `original_rebuild`
- **AND** 商品页显示“本站原创复刻方案，非原产品官方源码”

#### Scenario: Demo has no sellable Blueprint

- **GIVEN** 一个公开 Demo 没有通过销售门槛的关联 Blueprint
- **WHEN** 用户查看卡片或详情
- **THEN** 系统不显示购买操作
- **AND** 不把仓库、外部链接或第三方源码包装成本站商品

### Requirement: Blueprint catalog and product detail

系统 SHALL 在本地/预发布提供独立 Blueprint 目录和商品详情，并只允许通过内容、版本、权利和验证门槛的商品进入可公开候选；激活 Offer 与精确 Price 只决定能否购买，生产公共入口继续由成交闸门关闭。

#### Scenario: Sellable Blueprint is opened

- **GIVEN** Blueprint 当前版本被冻结且八类交付物、权利和构建验证全部通过
- **AND** 它绑定激活 Offer、精确 Price 和已批准政策版本
- **WHEN** 用户打开商品详情
- **THEN** 页面显示成品、交付清单、复刻要求、版本、许可、更新、支持、退款和精确价格
- **AND** 页面不暴露私有文件路径、对象键或未公开证据

#### Scenario: Draft or withdrawn Blueprint is opened publicly

- **GIVEN** Blueprint 未通过可售门槛或已经撤下
- **WHEN** 公开用户访问其 slug
- **THEN** 系统返回真实 404 和 `noindex`
- **AND** 不泄露草稿、旧价格或私有包存在

### Requirement: Independent publication and sale states

系统 SHALL 分别保存内容审核、公开可见性、版本可售性、Offer、Price 和商城闸门状态，不得用一个 `status` 同时表达内容公开与能否结账。

#### Scenario: Public product pauses sales

- **GIVEN** Blueprint 内容已批准、公开可见且版本仍为 `sellable`
- **AND** 当前 Offer 从 `active` 变为 `paused`
- **WHEN** 公开用户打开商品详情
- **THEN** 页面继续显示已批准的商品内容并写“暂停销售”
- **AND** 系统不显示购买操作或创建结账

#### Scenario: Version fails rights or validation

- **GIVEN** Blueprint 版本的文件权利或验证未通过
- **WHEN** 系统计算可售状态
- **THEN** 该版本不能进入 `sellable`
- **AND** 不能通过公开商品页或暂停销售状态泄露失败包

### Requirement: Versioned product foundation

系统 SHALL 保存固定 Blueprint Version、Offer Version、Policy Version 和不可变精确 Price 的商品基础；本 change 不创建订单或结账。

#### Scenario: Price changes

- **GIVEN** 一个 Price 已经激活或进入订单快照
- **WHEN** 运营方调整金额、币种、周期或含税方式
- **THEN** 系统创建新的价格版本
- **AND** 任何既有引用继续指向原始不可变价格

#### Scenario: Policy changes

- **GIVEN** 客户许可、退款、更新或支持内容已经批准
- **WHEN** 运营方修改其中任何内容
- **THEN** 系统创建新的 Policy Version 或 Offer Version 与内容哈希
- **AND** 不原地覆盖已经批准的版本

### Requirement: File-level package evidence

系统 SHALL 为每个 Blueprint Version 保存逐文件 manifest、文件哈希、文件级权利与不可变验证批次，不能只保存八类标签和一个压缩包哈希。

#### Scenario: Archive differs from manifest

- **GIVEN** 数据库已经登记 Blueprint Version 的逐文件路径、大小和 SHA-256
- **WHEN** 实际压缩包多一个文件、少一个文件或任一文件字节变化
- **THEN** 版本验证失败
- **AND** 该版本不能进入 `sellable`

#### Scenario: File rights are missing

- **GIVEN** 一个包内文件没有 `approved_for_sale` 的文件级权利记录
- **WHEN** 系统检查 Blueprint Version
- **THEN** 整个版本不能进入 `sellable`
- **AND** 八类 Artifact 已齐全不能绕过该失败

### Requirement: Commerce dependencies remain unavailable

系统 SHALL 在订单、支付、权益、下载、会员和咨询的独立 change 完成前保持对应生产入口不可用，不创建只有页面没有后端的假流程。

#### Scenario: User follows an unimplemented commerce route

- **GIVEN** 结账、资料库、订单、会员或咨询依赖尚未完成
- **WHEN** 用户从生产导航或商品页寻找这些入口
- **THEN** 系统不显示对应链接或购买操作
- **AND** 不创建禁用按钮、假成功页、占位订单或模拟权益

#### Scenario: Demo is favorited

- **GIVEN** 用户收藏了对应 Demo
- **WHEN** Blueprint 目录或商品详情计算拥有状态
- **THEN** 收藏不被解释为订单、会员领取或 Entitlement
- **AND** 用户仍然没有下载或更新权

### Requirement: First-party launch boundary

系统 SHALL 在首个交易阶段只支持本站统一销售的 Blueprint，不得隐式承诺第三方卖家市场能力。

#### Scenario: External creator requests to sell

- **GIVEN** 多卖家合同、KYC、分账、税务、提现和争议系统尚未通过独立提案
- **WHEN** 第三方创作者请求入驻或收款
- **THEN** 系统不创建卖家账户、分账或提现能力
- **AND** 该需求进入独立 Marketplace change

### Requirement: Public marketplace release gate

系统 SHALL 在至少一个自营 Blueprint 完成真实购买、权益、私有下载、退款和对账前阻止把公共站声明为可成交商城。

#### Scenario: Storefront code exists but payment loop is incomplete

- **GIVEN** Blueprint 页面已经实现
- **AND** 生产购买、退款或对账仍缺少一项证据
- **WHEN** 执行公共商城发布检查
- **THEN** 检查失败并列出真实缺口
- **AND** 不使用沙箱、点击购买或本地构建替代生产成交证据
