# Tasks

## 0. Proposal

- [x] 0.1 `<files>` 读取路线图、完整目标、现有 ColorSnap 审计和工作区候选结构；不进入 `.chrome-profile`。
- [x] 0.2 `<action>` 记录当前只发现 ColorSnap，游戏、AI 动画和 UI 改造保持 `location_required`，不从不相关文件推断资产。
- [x] 0.3 `<verify>` 创建 proposal、design、delta spec 和 tasks，明确只做资产事实盘点，不制作商品。
- [ ] 0.4 `<done>` 用户确认 `inventory-own-blueprints` 后才进入 apply。

## 1. Inventory contract

- [ ] 1.1 `<files>` 创建 `content/own-blueprint-inventory.json`、`OWN_BLUEPRINT_INVENTORY.md`、严格校验脚本和单元测试。
- [ ] 1.2 `<action>` 固定定位、文件、功能、AI、运行、权利、隐私、名称和商业状态枚举及关系。
- [ ] 1.3 `<verify>` 拒绝缺路径、缺哈希、缺功能证据、AI 冒充、权利未知、隐私泄漏和错误可售状态。
- [ ] 1.4 `<done>` 清单格式可重放验证，未知值失败即停，不使用猜测或兜底。

## 2. ColorSnap audit

- [ ] 2.1 `<files>` 在不复制源项目的前提下登记允许审计的 ColorSnap 文件、大小和 SHA-256；`.chrome-profile` 只登记排除规则。
- [ ] 2.2 `<action>` 从干净副本验证可打开流程，逐项记录已实现、模拟、缺失、CIEDE2000 非 AI 边界和名称风险。
- [ ] 2.3 `<action>` 逐类核验代码、字体、图片、品牌和其他素材权利；18 张 Unsplash 模拟图片缺逐图来源时保持不可打包。
- [ ] 2.4 `<verify>` 密钥与隐私扫描不输出秘密值；运行日志、截图、哈希和清单一致。
- [ ] 2.5 `<done>` ColorSnap 得到明确 `rework_required` 或更严格状态，不被写成已可售 Blueprint。

## 3. Remaining own assets

- [ ] 3.1 `<files>` 用户提供游戏、AI 动画和 UI 改造的准确目录或归档，或明确声明该类资产不可用。
- [ ] 3.2 `<action>` 对每个已定位资产执行与 ColorSnap 相同的文件、功能、AI、运行、权利、隐私和名称审计。
- [ ] 3.3 `<verify>` 不把相邻第三方仓库、考试文件、简历、海报或普通图片自动归为自有产品。
- [ ] 3.4 `<done>` 四组资产均有可核验状态；缺失项保留真实阻断，不用占位资产凑数。

## 4. Review and archive

- [ ] 4.1 `<files>` 更新 `CONTEXT.md`、`README.md`、`ARCHITECTURE.md`、`ROADMAP.md` 和目标验收矩阵中的真实状态。
- [ ] 4.2 `<action>` 运行校验与测试，随后 Review 查 Bug并做第一性原理精简。
- [ ] 4.3 `<verify>` 逐资产人工核对路径、功能、权利、隐私、运行证据和商业状态；OpenSpec strict 通过。
- [ ] 4.4 `<done>` 用户验收后归档 change；归档只代表资产底账完成，不代表 Blueprint、商品或支付已完成。
