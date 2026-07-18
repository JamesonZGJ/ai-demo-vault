# ColorSnap pilot acquisition delta

## ADDED Requirements

### Requirement: Local-only Blueprint pilot

系统 SHALL 只在应用和数据库都确认本地环境时展示 ColorSnap Blueprint 试用闭环。

#### Scenario: Local reviewer opens the Blueprint

- **GIVEN** 应用层为 `local`
- **AND** 数据库本地试用开关已开启
- **WHEN** 审核者进入 Blueprint 目录
- **THEN** 系统显示 ColorSnap Blueprint #001
- **AND** 页面明确标记本地预发布、模拟购买和不扣款

#### Scenario: Production user tries the pilot URL

- **GIVEN** 请求到达生产环境或数据库开关关闭
- **WHEN** 用户访问 Blueprint、模拟购买或资料库 URL
- **THEN** 系统返回 404 或真实空态
- **AND** 查询参数、Cookie 和普通账号不能开启试用

### Requirement: Demo-to-product conversion

系统 SHALL 让 ColorSnap 免费 Demo 预览显式导向其本站自有 Blueprint，不得给第三方案例伪造商品关系。

#### Scenario: Visitor finishes reading the ColorSnap Demo

- **WHEN** 游客查看 `/demos/colorsnap`
- **THEN** 页面说明当前原型没有 AI、后端、账号、支付和商业验证
- **AND** 页面提供“查看 ColorSnap Blueprint”操作
- **AND** 商品关系标记为 `own_case`

### Requirement: Complete product decision page

系统 SHALL 在 ColorSnap 商品页展示 12 个产品决策区块，并把其中 7 类资料标记为可获取内容：Product Overview、Target Users、Problem、Solution、Feature Map、User Flow、UI Screens、PRD、Tech Stack、Prompt Templates、Monetization Model、Marketing Strategy。

#### Scenario: Visitor evaluates the package

- **WHEN** 游客打开 ColorSnap Blueprint 商品页
- **THEN** 12 个区块各有可读标题和具体内容
- **AND** PRD、Tech Stack、Prompt Templates、Monetization Model、Marketing Strategy 等 7 类资料各有名称、用途、格式和包含范围
- **AND** 页面显示固定版本、来源声明、实际原型边界和目标方案边界
- **AND** 页面明确显示价格未决定，不出现虚构金额

### Requirement: Non-financial simulated acquisition

系统 SHALL 在用户确认后创建持久试用访问权，但不得创建订单、支付或收入记录。

#### Scenario: Signed-in user confirms acquisition

- **GIVEN** 用户已登录
- **AND** 用户确认当前操作不扣款、不创建支付交易
- **WHEN** 用户提交模拟购买
- **THEN** RPC 原子创建或返回唯一 `pilot_preview` 访问权
- **AND** 系统进入该用户的资料库
- **AND** 页面只写“模拟获取完成”

#### Scenario: User submits twice

- **WHEN** 同一用户重复或并发提交同一 Blueprint
- **THEN** 数据库只保留一条访问权
- **AND** 两次请求都导向同一份资料

### Requirement: Owner-only resource access

系统 SHALL 只允许访问权本人读取 Blueprint 资料正文。

#### Scenario: Another user queries resources

- **GIVEN** 用户甲已经获得 ColorSnap 访问权
- **WHEN** 用户乙直接查询资料表或访问资料库 URL
- **THEN** 用户乙不能读取用户甲的访问权或资料正文
- **AND** 客户端不能直接写入或修改访问权

### Requirement: Owner-only sample export

系统 SHALL 只允许已获得访问权的本人下载一份标记为样品的 Markdown 资料导出。

#### Scenario: Owner downloads the sample

- **GIVEN** 用户已经获得 ColorSnap `pilot_preview` 访问权
- **WHEN** 用户打开资料库下载入口
- **THEN** 响应只包含七类编辑资料正文
- **AND** 响应标记为私有、不缓存和 noindex
- **AND** 文件明确写明不代表支付、订单或客户许可

#### Scenario: Unowned user downloads the sample URL

- **GIVEN** 用户没有该 Blueprint 访问权，或请求来自生产环境
- **WHEN** 用户直接请求下载 URL
- **THEN** 系统返回 404

### Requirement: Pilot pages are not public commerce evidence

系统 SHALL 把 Blueprint 试用页面排除在公开 SEO、分析和生产成交证据之外。

#### Scenario: Search engine or analytics visits a pilot page

- **WHEN** 访问 Blueprint、模拟购买或资料库页面
- **THEN** 页面为 `noindex`
- **AND** 不发送公开页面分析事件
- **AND** sitemap 不列出试用商品
