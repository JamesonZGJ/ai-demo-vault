# Design

## Boundary

```text
ColorSnap Demo（免费、本地预览）
  → ColorSnap Blueprint #001（商品说明）
  → 模拟购买确认（不扣款、不创建订单）
  → Pilot Access Grant（持久资料访问权）
  → 我的资料库（七类真实编辑资料）
  → 本人下载 Markdown 资料样品
```

`blueprint_access_grants` 只表示本地产品评审期间获得资料访问权。它不等于订单、付款、会员、永久客户许可或生产 Entitlement，未来真实交易表不得读取它计算收入和已购状态。

## Double gate

| 闸门 | 默认 | 本地 | 生产 |
|---|---|---|---|
| `APP_DEPLOYMENT_TIER` | 未设置即关闭 | 固定为 `local` | `production` 或 Vercel production，强制关闭 |
| 数据库 `blueprint_runtime_flags` | `local_pilot_enabled=false` | seed 改为 `true` | migration 默认值保持 `false` |

URL 参数、Cookie 和普通账号不能改变任何闸门。应用闸门隐藏路由，数据库闸门阻止绕过网页直接调用 RPC。

## Data

| 对象 | 责任 |
|---|---|
| `blueprints` | 商品身份、编号、版本、价格决定状态、来源声明和事实边界 |
| `blueprint_demo_links` | Demo 与商品的 `own_case` 等显式关系 |
| `blueprint_deliverables` | 公开可见的七类交付说明，不含私有正文 |
| `blueprint_resources` | 获取后可读的七类资料正文 |
| `blueprint_access_grants` | 用户与 Blueprint 的唯一 `pilot_preview` 访问权 |
| `blueprint_runtime_flags` | 数据库侧本地试用开关 |

客户端只有公开商品只读、本人的访问权只读和本人的资料只读。客户端不能直接插入、更新或删除访问权；唯一写入口是 `claim_blueprint_pilot(text)`。

下载路由只调用带用户 Cookie 的 owner-only 查询，动态生成 Markdown 样品；响应不缓存、带 `noindex`，不读取存储对象，也不声称提供源码、Figma、第三方图片或客户许可。

## Acquisition RPC

RPC 使用 `SECURITY DEFINER`、空 `search_path`，只接受 Blueprint slug，并自行检查：

1. `auth.uid()` 存在；
2. 数据库本地试用开关已开启；
3. 商品状态为 `rework_required` 且访问模式为 `pilot_preview`；
4. 同一用户与商品只有一个访问权。

重复点击和并发调用通过唯一键及 `on conflict do update` 返回同一访问权 ID，不制造重复记录，也不修改首次获取时间。

## Truth boundary

- 商品页必须显示“价格未决定”，不得用虚构金额代替真实定价决策。
- “模拟购买完成”不得写成“支付成功”“已付款”“产生订单”或“形成收入”。
- 七类资料是本轮新增的站内真实编辑样品，但不宣称包含完整源码、Figma 文件或可商用第三方素材。
- ColorSnap 当前 Demo 的比色逻辑为 CIEDE2000，不描述为 AI 推理。
