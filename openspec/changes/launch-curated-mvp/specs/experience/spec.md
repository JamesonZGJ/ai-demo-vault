# Experience delta

## ADDED Requirements

### Requirement: Home discovery

首页 SHALL 提供今日精选、最新收录和明确标注的创业灵感编辑榜；产生真实收藏后增加“收藏最多”，并突出产品图片、成熟度和分类。“收藏最多”只描述站内收藏，不称为热度。

#### Scenario: Stable daily feature

- **WHEN** 任意用户在同一香港自然日打开首页
- **THEN** 今日精选展示同一个来自编辑批准池的公开案例
- **AND** 下一自然日可以轮换到另一个公开案例

#### Scenario: First visit

- **WHEN** 用户首次打开首页
- **THEN** 首屏显示“不是链接导航，而是可复刻的 AI 产品案例库”及进入案例库的操作

### Requirement: Responsive and accessible UI

核心浏览、筛选、详情和收藏流程 SHALL 支持桌面与移动端，并可通过键盘操作。

#### Scenario: Mobile catalog

- **WHEN** 用户在 360px 宽度设备打开案例库
- **THEN** 卡片不横向溢出
- **AND** 搜索、筛选和收藏操作仍可用

#### Scenario: Keyboard navigation

- **WHEN** 用户只使用键盘
- **THEN** 所有交互控件可聚焦、可触发并显示清晰焦点

#### Scenario: Automated accessibility check

- **WHEN** 对首页、案例库、一个详情页和登录页运行自动无障碍检查
- **THEN** 不存在 serious 或 critical 级问题
- **AND** 正文与交互控件满足 WCAG 2.2 AA 对比度

### Requirement: Search engine metadata

公开页面 SHALL 提供唯一标题、描述、canonical、可索引站点地图和正确 robots 规则。

#### Scenario: Demo detail metadata

- **WHEN** 搜索引擎访问已发布案例详情
- **THEN** 页面元数据来自该案例真实内容
- **AND** canonical 指向唯一公开 URL

#### Scenario: Private route

- **WHEN** 搜索引擎访问登录、注册、确认或个人收藏页
- **THEN** 页面被标记为不索引

#### Scenario: Sitemap contents

- **WHEN** 系统生成 sitemap
- **THEN** 只包含首页、案例库、隐私说明和满足公开条件的详情页
- **AND** 不包含草稿、归档、登录、确认或个人收藏 URL

### Requirement: Privacy-focused traffic measurement

系统 SHALL 统计公开页面的匿名聚合访问、访客和来源，并排除私有账号页面与敏感标识。

#### Scenario: Public page view

- **WHEN** 用户访问首页、案例库或公开详情页
- **THEN** 系统可以发送匿名聚合页面访问与来源数据
- **AND** 不发送邮箱、用户 ID、收藏内容或认证令牌

#### Scenario: Private page view

- **WHEN** 用户访问登录、注册、确认、个人收藏或隐私说明页
- **THEN** 系统不发送页面分析事件

#### Scenario: Privacy explanation

- **WHEN** 用户打开隐私说明页
- **THEN** 页面说明公开路由会处理的聚合访问与来源数据、排除的数据和用途
- **AND** 页面不声称匿名访问统计能够证明长期留存或商业成功
