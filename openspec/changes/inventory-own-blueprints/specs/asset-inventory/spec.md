# Own asset inventory delta

## ADDED Requirements

### Requirement: Explicit asset discovery

系统 SHALL 为 ColorSnap、游戏、AI 动画和 UI 改造分别记录 `located`、`location_required` 或 `user_declared_unavailable`，不得根据回忆、文件名或相邻项目猜测资产存在。

#### Scenario: Missing project path

- **WHEN** 用户尚未提供游戏、AI 动画或 UI 改造的准确目录或归档
- **THEN** 对应资产保持 `location_required`
- **AND** 系统不生成文件、功能、权利或可售结论

#### Scenario: File found in the workspace

- **WHEN** 扫描发现一个可能相关的文件或目录
- **THEN** 只有用户确认它属于该资产且进入审计范围后才能标记 `located`
- **AND** 文件存在本身不被当作作者或再分发权证据

### Requirement: File-level evidence

每个已定位资产 SHALL 保存交付相关文件的稳定路径、字节数、SHA-256、来源类型、审计日期和权利状态。

#### Scenario: File changes after audit

- **WHEN** 同一路径的大小或 SHA-256 与清单不一致
- **THEN** 校验失败并要求重新审计
- **AND** 旧的运行、权利和商业结论不自动继承

#### Scenario: Directory-only claim

- **WHEN** 资产只登记一个目录但没有逐文件清单
- **THEN** 该资产不能进入 `package_candidate`
- **AND** 系统不能用截图或文件数量替代哈希清单

### Requirement: Capability truth

每项功能 SHALL 标记为 `verified`、`simulated`、`missing` 或 `not_applicable`，并保存可复核证据。

#### Scenario: Simulated behavior

- **WHEN** 界面使用固定数据、本地样例或假交互呈现功能
- **THEN** 功能标记为 `simulated`
- **AND** 报告不得描述为真实服务、真实用户数据或已上线能力

#### Scenario: Verified behavior

- **WHEN** 功能标记为 `verified`
- **THEN** 清单包含实际操作步骤、预期、结果、环境和核验日期
- **AND** 干净副本可以按同样步骤重新验证

### Requirement: AI truth boundary

资产 SHALL 只有在真实模型 API 或本地模型推理链路有证据时声明 AI 能力；确定性算法、模板和文案不得冒充模型推理。

#### Scenario: Deterministic color comparison

- **WHEN** ColorSnap 使用 CIEDE2000 或其他确定性颜色距离计算
- **THEN** `ai_boundary` 记录为 `none`
- **AND** 页面和资产报告不使用 AI 模型、AI 识别或 AI 推荐描述该计算

#### Scenario: Unknown AI implementation

- **WHEN** 只能看到 AI 文案但无法确认模型调用或本地推理
- **THEN** `ai_boundary` 记录为 `unknown`
- **AND** 资产不能进入 `package_candidate`

### Requirement: Rights by asset class

每个已定位资产 SHALL 分别核验代码、模型、字体、图片、音频、视频、品牌和生成内容的权利，开源代码许可不得扩张到其他类别。

#### Scenario: Generic license without item provenance

- **WHEN** 图片只有平台总许可页但缺逐项作者和原始链接
- **THEN** 图片权利状态为 `third_party_unverified`
- **AND** 这些图片不能进入公开或付费 Blueprint 包

#### Scenario: User ownership assertion

- **WHEN** 用户确认某些代码或素材由自己创作
- **THEN** 清单保存确认日期、范围和相反证据检查结果
- **AND** 未包含在确认范围内的依赖与素材继续单独核验

### Requirement: Privacy exclusion

资产盘点 SHALL 排除浏览器 profile、账号、令牌、私钥、客户数据和个人敏感信息。

#### Scenario: Browser profile exists

- **WHEN** ColorSnap 源目录包含 `.chrome-profile`
- **THEN** 系统只登记该目录为永久排除项，不读取、遍历、复制或哈希内部文件
- **AND** 任何清单、日志、仓库或交付包都不包含其内容

#### Scenario: Secret detected

- **WHEN** 允许扫描的源文件出现令牌、私钥、密码或带凭据 URL
- **THEN** 审计失败并记录文件位置与秘密类型，不输出秘密值
- **AND** 资产保持 `not_sellable` 或 `rework_required`

### Requirement: Reproducible run evidence

每个已定位项目 SHALL 从干净副本按登记环境和步骤打开或构建，失败结果不得被截图替代。

#### Scenario: Clean run fails

- **WHEN** 项目从干净副本无法按登记步骤打开或构建
- **THEN** 保存真实错误摘要并标记 `rework_required`
- **AND** 系统不创建兜底 Demo 冒充原项目通过

### Requirement: Commercial status gate

资产 SHALL 只有在文件、功能、AI、运行、权利、隐私和名称边界全部满足时进入 `package_candidate`；本 change 不直接证明商品 `sellable`。

#### Scenario: ColorSnap current state

- **WHEN** ColorSnap 仍使用未逐项核验的模拟图片、冲突名称或非 AI 定位
- **THEN** 商业状态保持 `rework_required`
- **AND** 不创建“AI App Blueprint #001 已可售”的结论

#### Scenario: Inventory completed

- **WHEN** 资产盘点通过全部校验
- **THEN** 报告只说明可进入后续 Blueprint 制作提案的候选和具体阻断项
- **AND** 不生成 Prompt、PRD、Figma、HTML、React、数据结构、商品、价格或下载权益
