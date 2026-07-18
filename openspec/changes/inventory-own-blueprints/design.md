# Design

## Deliverables

确认后，apply 阶段新增：

| 文件 | 职责 |
|---|---|
| `content/own-blueprint-inventory.json` | 机器可读资产、文件、功能、权利、隐私、运行和商业状态 |
| `OWN_BLUEPRINT_INVENTORY.md` | 面向用户的逐资产结论与阻断项 |
| `scripts/validate-own-blueprint-inventory.mjs` | 严格校验枚举、证据关系、哈希格式和可售门槛 |
| `tests/unit/own-blueprint-inventory.test.mjs` | 覆盖缺路径、缺权利、模拟冒充真实、AI 冒充、隐私泄漏和错误可售状态 |

源项目不复制进 AI Demo Vault。清单保存审计时的工作区相对定位符、文件哈希和证据；未来真正制作 Blueprint 时再通过独立 change 决定哪些自有文件进入包。

## Inventory model

每个资产至少包含：

| 字段 | 规则 |
|---|---|
| `asset_id` | 稳定唯一 ID，不使用营销名称作身份 |
| `display_name` | 当前名称；名称风险单独记录 |
| `asset_kind` | `web_app`、`game`、`animation`、`ui_redesign` |
| `discovery_status` | `located`、`location_required`、`user_declared_unavailable` |
| `source_locator` | 已定位时为工作区相对路径；禁止绝对个人路径、URL 凭据和 profile 子路径 |
| `audit_date` | ISO 日期，不用文件时间冒充核验时间 |
| `files` | 路径、类型、字节数、SHA-256、来源类型、权利状态 |
| `capabilities` | 功能名称、`verified/simulated/missing/not_applicable`、证据和验证步骤 |
| `ai_boundary` | `none`、`model_api`、`local_model`、`unknown`，并保存实际调用证据 |
| `run_verification` | 环境、命令/操作、预期、实际结果、日期和日志摘要 |
| `rights` | 代码、模型、字体、图片、音频、视频、品牌、生成内容的逐类结论 |
| `privacy_review` | 排除路径、密钥扫描、个人/客户数据检查和结果 |
| `name_risk` | 名称冲突事实、来源、状态；不作法律结论 |
| `commercial_status` | `not_sellable`、`rework_required`、`package_candidate`、`sellable` |
| `blockers` | 具体缺口，不能用“待优化”代替 |

## Source location and privacy

- `source_locator` 只能指向用户明确放入范围的项目根或文件。
- 校验器拒绝 `.chrome-profile`、浏览器数据目录、`.env`、密钥文件、账号导出和客户数据路径。
- `.chrome-profile` 只在排除规则中登记目录名，不遍历、不取哈希、不统计子文件。
- 工作区扫描只用于发现候选，不把相邻第三方仓库、考试文件、简历或服务商品图自动归为自有产品。
- 文件位置只能证明“文件存在”，不能证明作者和再分发权；权属必须有用户声明或原始来源证据。

## Truth model

功能验证按最小可观察行为记录：

- `verified`：审计者在登记环境中实际完成该行为，并保存步骤与结果。
- `simulated`：界面或本地固定数据表现出行为，但没有对应真实服务或计算闭环。
- `missing`：界面宣称或产品计划需要，但当前无法完成。
- `not_applicable`：该资产明确不需要此能力。

AI 能力只有在代码或网络记录中存在明确模型 API 调用，或本地模型推理链路实际运行时，才允许 `model_api` 或 `local_model`。关键词、界面文案、颜色距离、随机数、模板选择和规则算法不能作为 AI 证据。`unknown` 不能进入 `package_candidate`。

## Rights model

每类权利状态只允许：

- `self_authored_confirmed`：用户明确确认且与源文件/历史证据一致。
- `third_party_licensed`：有逐项来源、权利人、许可文本和允许的使用范围。
- `third_party_unverified`：已知第三方来源但缺逐项许可链。
- `mixed`：同类文件含多种状态，必须拆到逐文件记录。
- `unknown`：无法确认。

开源代码许可不扩张到模型、字体、商标、截图、生成内容或第三方素材。网页可访问、CDN 地址或总许可页也不能代替逐文件来源。

## Commercial gate

`package_candidate` 必须同时满足：

1. `discovery_status=located`，全部交付相关文件有稳定哈希。
2. 核心功能均为 `verified`；模拟和缺失能力已从销售范围排除或形成明确重做任务。
3. AI 定位与真实调用证据一致；非 AI 项目不能以 AI App 销售。
4. 干净副本运行/构建成功，命令和依赖可复现。
5. 代码与全部素材权利为可公开、可修改、可再分发的已确认状态。
6. 密钥、账号、客户数据、浏览器 profile 和个人隐私扫描为零。
7. 名称风险已解决或改名任务明确阻止公开。

`sellable` 还需要后续 package standard、许可、商品和交付验收；本 change 的校验器默认拒绝直接写入 `sellable`，除非后续正式规范已归档并被显式引用。

## ColorSnap boundary

ColorSnap 当前只允许记录为 `rework_required`：

- 单页前端原型，可登记已实际验证的取色、比较、收藏和分享行为。
- CIEDE2000 是确定性颜色差计算，不是 AI。
- 本地固定或模拟图片流必须标记 `simulated`。
- 没有后端、用户系统、支付和已验证商业数据。
- 18 张 Unsplash 图片只有总许可说明，缺逐图作者与原始链接，权利为 `third_party_unverified`。
- `ColorSnap` 名称存在同类产品冲突风险；盘点只记录，不作商标法律结论。
- `.chrome-profile` 永久排除。

## Missing assets

游戏、AI 动画和 UI 改造在用户提供准确位置前只建立 `location_required` 记录，不扫描不相关目录来凑数。用户若明确表示某类资产已不存在或不进入商业化范围，可改为 `user_declared_unavailable`，并保存决定日期；这不等于完成一个 Blueprint。
