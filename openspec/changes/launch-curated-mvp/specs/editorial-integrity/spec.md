# Editorial integrity delta

## ADDED Requirements

### Requirement: Evidence-backed claims

每个公开事实主张 SHALL 关联一个已核验来源；编辑推断和产品假设 SHALL 显示对应标签。

#### Scenario: Missing source

- **WHEN** 事实主张没有来源或核验日期
- **THEN** 内容校验失败
- **AND** 该主张不能出现在公开详情

#### Scenario: Editorial inference

- **WHEN** 痛点、目标用户或商业模式是编辑推断而非产品官方声明
- **THEN** 页面明确显示“编辑推断”或“产品假设”
- **AND** 不将其描述为已验证事实

### Requirement: Primary claims

每个公开案例 SHALL 为产品概述、成立原因、痛点、解决方案、目标用户、核心功能、AI 实现、技术实现、盈利方式、真实性边界和创业改造各保存且仅保存一条主要主张；详情正文与标签 SHALL 读取同一条主要主张。

#### Scenario: Missing primary claim

- **WHEN** 11 个详情区块中任一项没有主要主张
- **THEN** 数据库拒绝发布或删除事务
- **AND** 案例不能通过公开查询读取

#### Scenario: Primary fact on detail

- **WHEN** 主要主张类型是事实
- **THEN** 详情正文显示该主张本身、来源和核验日期
- **AND** 不从另一份未标注字段替换正文

### Requirement: Source code status

每个公开案例 SHALL 独立记录 `open_source` 或 `closed_source`；`not_disclosed` SHALL 保持草稿。

#### Scenario: Open-source evidence

- **WHEN** 案例声明 `open_source`
- **THEN** 同一案例存在非镜像的规范仓库链接，且开源证据指向同一 URL
- **AND** 页面提醒代码许可证不自动覆盖商标、截图、模型或第三方素材

#### Scenario: Concurrent dependency removal

- **GIVEN** 已发布案例有两份满足同一发布门禁的依赖记录
- **WHEN** 两个编辑事务并发删除最后两份仓库、发布方、主要主张或真实产品展示依赖
- **THEN** 两个事务先按案例锁定同一父行并串行校验
- **AND** 至少一份必要依赖保留，不能产生不完整的 `published` 数据

#### Scenario: Closed-source evidence

- **WHEN** 案例声明 `closed_source`
- **THEN** 同一案例不挂仓库链接或开源证据
- **AND** 页面不暗示第三方源码可购买、下载或转售

### Requirement: Media rights

公开素材 SHALL 保存版权方、许可或授权状态、来源和替代文本。

#### Scenario: Unapproved media

- **WHEN** 素材授权状态不是 `approved`
- **THEN** 该素材不能出现在公开页面

#### Scenario: Approved image or GIF

- **WHEN** 公开案例展示图片或 GIF
- **THEN** 素材具有有效替代文本
- **AND** GIF 同时提供静态封面，减少动态效果的用户不被强制播放动画

#### Scenario: Representative product media

- **WHEN** 案例准备公开
- **THEN** 至少一份 `approved` 媒体是由本站在许可允许范围内实际运行后采集，或取得权利人明确授权的真实产品截图、GIF 或视频
- **AND** 纯抽象封面、第三方宣传图链接或未授权重制图不能满足该门槛

#### Scenario: Remove the last product preview

- **GIVEN** 已发布案例只有一份合格产品展示媒体
- **WHEN** 内容操作尝试删除该媒体或把授权状态降为非 `approved`
- **THEN** 数据库拒绝事务，除非同一事务先撤下案例或补入另一份合格产品展示媒体

#### Scenario: Approved video

- **WHEN** 公开案例展示视频
- **THEN** 视频可以暂停、默认无声且不会自动播放声音
- **AND** 含口述信息的视频提供字幕或等价文字摘要

#### Scenario: Failed optional media

- **WHEN** 已批准的可选图库媒体读取失败
- **THEN** 页面不显示空媒体槽，并用明确文字说明当前状态
- **AND** 系统不自动替换成未授权第三方素材

### Requirement: Verification level

案例 SHALL 用一个实现成熟度区分概念、可交互原型、真实 Demo 和正式产品；开源、公开采用、定价和商业服务作为可并存的独立证据展示。

#### Scenario: Prototype with simulated features

- **WHEN** 案例包含本地模拟功能
- **THEN** 详情页分别列出已实现、模拟和未实现能力
- **AND** 不使用“已验证产品”描述

#### Scenario: Empty truth boundary

- **WHEN** 已实现、模拟和未实现三组能力全部为空
- **THEN** 发布校验失败
- **AND** 页面不能隐藏空区块后把案例伪装成完整拆解

#### Scenario: Mixed evidence

- **WHEN** 一个案例既有开源仓库又提供商业服务
- **THEN** 页面同时展示两种证据
- **AND** 不强迫案例进入单一“开源”或“商业”类别

### Requirement: Commercial potential note

每个公开案例的商业潜力 SHALL 作为 1–5 分编辑判断，并保存规则版本、理由、依据和核验日期。

#### Scenario: Missing rationale

- **WHEN** 案例缺少商业潜力分数、理由、依据、规则版本或核验日期
- **THEN** 发布校验失败，案例保持草稿
- **AND** 系统不能生成缺少商业潜力判断的公开卡片

#### Scenario: Full score system deferred

- **WHEN** MVP 上线
- **THEN** 不显示五维 1–5 评分中的创新性、开发难度、市场竞争、复刻价值或综合创业排名
- **AND** 可以继续显示入门、中等、进阶三档实现难度标签
