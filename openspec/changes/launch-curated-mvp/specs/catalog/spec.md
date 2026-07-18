# Catalog delta

## ADDED Requirements

### Requirement: Published demo catalog

系统 SHALL 只公开状态为已发布、具有已核验发布方与官方主来源、11 个主要主张、一致源码状态、已批准封面、至少一份已批准真实产品展示媒体和完整商业潜力编辑判断的案例。

#### Scenario: Visitor opens the catalog

- **WHEN** 游客打开案例库
- **THEN** 页面只显示已发布案例
- **AND** 草稿、归档、发布方未知、缺主要主张、源码状态未知或证据不一致、缺来源、封面或产品展示媒体未获准、商业潜力判断不完整的案例即使通过直接数据请求也不可见

### Requirement: Versioned production catalog contract

生产数据库 SHALL 通过只读 RPC 暴露当前目录合同版本、公开案例数、开源案例数、主要主张数和主要区块数；发布验收 SHALL 同时直接复核每个首发案例的源码状态与 11 个主要主张区块。

#### Scenario: Outdated production schema

- **WHEN** 生产数据库缺少当前字段、主要主张区块、首发案例或返回旧合同版本
- **THEN** 只读生产验收失败
- **AND** Web 部署不能把本地 migration 哈希当作远端 schema 已更新的证据

### Requirement: Search and filters

系统 SHALL 在名称、短句和摘要中搜索关键词，并支持分类、工具、难度、发布方地区、排序和分页；所有条件保存在 URL。

#### Scenario: Share a filtered catalog

- **WHEN** 用户选择分类和难度后复制 URL
- **THEN** 另一位用户打开该 URL 时看到相同筛选结果

#### Scenario: Invalid filter input

- **WHEN** URL 包含未知筛选值或非法页码
- **THEN** 系统以 307 重定向到移除非法项后的 canonical URL
- **AND** 不返回草稿或扩大用户原本可读的数据范围

#### Scenario: Stable pagination and sort

- **WHEN** 用户浏览案例库
- **THEN** 每页最多返回 12 条
- **AND** 排序只接受最新、商业潜力、真实收藏数和编辑精选四种公开选项

### Requirement: Publisher region and source platform

案例 SHALL 把主发布方地区与发现/核验来源平台分开保存。发布方地区允许 `mainland_china`、`international`、`mixed`、`unknown`；不能用目标用户、访问地区或平台所在地代替。

#### Scenario: Initial market coverage

- **WHEN** 首批内容发布
- **THEN** 至少有一个 `mainland_china` 案例和一个 `international` 案例
- **AND** `mixed` 案例逐个记录已核验主体，`unknown` 案例保持草稿

### Requirement: Demo detail

每个公开案例 SHALL 展示产品截图或演示、在线体验入口、产品信息、用户痛点、解决方案、目标用户、核心功能、AI 实现方式、技术实现、商业模式、真实性边界、二次创新和证据来源。

#### Scenario: Available product links

- **WHEN** 案例有已核验的在线体验或开源仓库
- **THEN** 详情页显示对应入口及最后核验日期
- **AND** 失效或未核验链接不显示为可用按钮

#### Scenario: Closed-source product

- **WHEN** 案例为闭源产品
- **THEN** 页面明确标注闭源
- **AND** 不显示“下载源码”或暗示第三方源码可售

#### Scenario: Structured venture adaptation

- **WHEN** 用户阅读案例的创业改造区
- **THEN** 页面分别展示“改变谁”“改变什么”“改变场景”和“新机会假设”四个字段
- **AND** 每个尚未被市场数据证明的方向标记为产品假设

### Requirement: Real engagement data

收藏数 SHALL 来自真实账号收藏记录，并在重复收藏或取消收藏后保持一致且不为负数。

#### Scenario: No engagement data

- **GIVEN** 所有公开案例的真实收藏数均为 0
- **WHEN** 用户打开首页
- **THEN** 首页不显示“收藏最多”区
- **AND** 仍显示今日精选、最新收录和创业灵感编辑榜

#### Scenario: Most favorited products

- **GIVEN** 至少一个公开案例的真实收藏数大于 0
- **WHEN** 用户打开首页
- **THEN** 首页显示“收藏最多”区
- **AND** 按真实收藏数降序排列，不注入模拟数量，也不将其描述为市场热度
