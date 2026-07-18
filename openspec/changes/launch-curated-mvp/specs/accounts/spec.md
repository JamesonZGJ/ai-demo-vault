# Accounts delta

## ADDED Requirements

### Requirement: Email account

系统 SHALL 提供邮箱与密码注册、确认邮件激活、登录和退出。

#### Scenario: Registration confirmation

- **GIVEN** 用户提交有效邮箱和符合要求的密码
- **WHEN** 注册成功
- **THEN** 系统发送确认邮件
- **AND** 未确认账号不能建立正式登录会话

#### Scenario: Valid login

- **GIVEN** 用户账号已完成邮箱确认
- **WHEN** 用户提交已确认账号的有效凭据
- **THEN** 系统建立安全会话并返回原目标页面

#### Scenario: Invalid login

- **WHEN** 用户提交无效凭据
- **THEN** 页面显示明确错误
- **AND** 不建立会话

#### Scenario: Unsafe return target

- **WHEN** 登录回跳参数是绝对 URL、以 `//` 开头、含反斜杠或无法解析
- **THEN** 登录成功后返回首页
- **AND** 不跳转到站外地址

### Requirement: Personal favorites

登录用户 SHALL 能明确收藏或取消收藏案例，结果在刷新和重新登录后保留。

#### Scenario: Save a favorite

- **WHEN** 登录用户请求收藏一个公开且尚未收藏的案例
- **THEN** 数据库只创建一条该用户与案例的关系
- **AND** 真实收藏计数增加一次

#### Scenario: Repeat the same command

- **WHEN** 同一用户重复请求收藏同一案例
- **THEN** 结果保持已收藏
- **AND** 不产生重复关系或重复计数

#### Scenario: Cross-user isolation

- **WHEN** 用户甲尝试读取或删除用户乙的收藏
- **THEN** 系统拒绝该操作
- **AND** 用户乙的数据与公开收藏计数不变

#### Scenario: Forged favorite owner

- **WHEN** 登录用户提交其他用户的标识作为收藏所有者
- **THEN** 系统拒绝创建收藏

#### Scenario: Unpublished target

- **WHEN** 登录用户尝试收藏草稿、归档或未通过发布条件的案例
- **THEN** 系统拒绝创建收藏
- **AND** 公开收藏计数不变

### Requirement: Guest behavior

游客 SHALL 能浏览公开内容，但不能创建收藏。

#### Scenario: Guest clicks favorite

- **WHEN** 游客点击收藏
- **THEN** 系统引导登录并保留返回目标
- **AND** 不写入匿名伪收藏
