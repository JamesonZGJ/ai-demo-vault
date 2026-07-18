# 调研结论

## 第一批官方案例

| 案例 | 分类 | 代码/授权 | 首版用途 |
|---|---|---|---|
| [RoomGPT](https://github.com/Nutlope/roomGPT) | AI 装修 | MIT | 拆解单一输入输出如何变成付费 SaaS |
| [CogVideoX](https://github.com/zai-org/CogVideo) | AI 视频 | 代码 Apache-2.0；权重与输出按具体许可 | 开放推理与研究型 Web Demo，明确不包装成成熟 SaaS |
| [FunClip](https://github.com/modelscope/FunClip) | AI 视频剪辑 | MIT | 阿里 ModelScope 官方项目，语音识别、说话人识别、字幕与 LLM 智能剪辑闭环 |
| [Presenton](https://github.com/presenton/presenton) | AI PPT | Apache-2.0 | 开源、云端、桌面、API 和自托管对照 |
| [PPTAgent](https://github.com/icip-cas/PPTAgent) | AI PPT | MIT；生成结果中的第三方底图另行核对 | 研究、规划、生成与反思式演示文稿智能体 |
| [Novel](https://github.com/steven-tey/novel) | AI 写作 | Apache-2.0 | 富文本编辑器与 AI 续写的轻量产品 |
| [Open Notebook](https://github.com/lfnovo/open-notebook) | AI 学习 | MIT | 自托管资料、笔记、带引用问答和播客工作台 |
| [Postiz](https://github.com/gitroomhq/postiz-app) | AI 营销 | AGPL-3.0 | AI 辅助、排期、发布、协作和分析闭环 |
| [OpenGame](https://github.com/leigest519/OpenGame) | AI 游戏 | Apache-2.0 | 描述到可运行 Web 游戏；只使用原创猫咪演示素材 |
| [RestorePhotos](https://github.com/Nutlope/restorePhotos) | AI 图片 | MIT | 前后对比强的小型 AI SaaS |
| [MaxKB](https://github.com/1Panel-dev/MaxKB) | AI 客服 | GPL-3.0 | RAG、工作流、智能体和企业客服平台 |
| [AnythingLLM](https://github.com/Mintplex-Labs/anything-llm) | 个人知识库 | MIT | 本地优先 RAG、Agent 和多模型 |

规则：闭源产品只做原创拆解、PRD 和自行实现的复刻方案，不能分发第三方源码或未授权素材。开源项目也必须逐项确认代码许可证是否覆盖图片和品牌素材。

MoneyPrinterTurbo 因官方主体地区暂时无法确认而退出首发。Wan2.2、Gamma、NotebookLM、Jasper、Rosebud AI 和 Chatwoot Captain 在素材许可或闭源展示边界上不适合作为第一批公开样本，已分别替换为 CogVideoX、PPTAgent、Open Notebook、Postiz、OpenGame 和 MaxKB。旧候选保留在审计记录，不删除历史。首发逐项事实和边界见 `LAUNCH_CONTENT.md`。

## 后续人工选题入口

| 区域 | 发现渠道 | 使用规则 |
|---|---|---|
| 国内 | GitHub 中文项目、Gitee、CSDN、掘金、即梦/可灵/豆包案例、Trae 作品、百度/阿里云/腾讯云案例 | 社区文章只用于发现线索；技术、授权和商业主张回到项目仓库、产品官网或官方案例页核验 |
| 海外 | Product Hunt、GitHub Trending、Hugging Face Spaces、Lovable、Vercel、Framer、Figma Community、Cursor、Replit、Bolt、v0 | 平台热度不能冒充本站收藏；闭源模板只做原创拆解，不复制或转售 |

首版由人工策展，不实现自动抓取。每个入口后续接入 API 或采集前，必须单独核对服务条款、速率限制和素材使用权。

## 自有案例 #001

ColorSnap 可确认的产品闭环是：抽色 → 现实找色 → 拍照 → 手动取色 → CIEDE2000 比色 → 收藏与分享。

必须公开写明：

- 当前是单页前端原型，不是已上线产品。
- “共鸣分”是色差算法，不是 AI。
- 地图、附近用户、交换和发布均为本地模拟。
- 当前提交材料未提供或本站尚未核验账号、数据库、付费、留存或收入数据。
- 现有 Unsplash 图片缺逐图授权链，不能直接进入付费资料包。
- `.chrome-profile` 含浏览器隐私数据，严禁复制或上传。
- `ColorSnap` 与 Sherwin-Williams 的同类产品名称冲突，上线前必须更名或完成正式商标核查。

## 内容真实性分层

| 等级 | 含义 |
|---|---|
| `concept` | 只有概念或静态设计 |
| `interactive_prototype` | 可操作原型，但没有真实后端或用户验证 |
| `working_demo` | 核心 AI 流程可真实运行 |
| `production_product` | 有可公开使用的正式产品 |

成熟度只描述实现阶段。开源许可、公开采用、定价和商业服务改用独立证据标签，一个案例可以同时拥有多种证据；任何标签都不等于投资建议或商业成功。

## MVP 编辑判断

首版只保留卡片需要的“商业潜力”1–5 分编辑判断，并保存规则版本、简短理由、核验人和核验日期。创新性、开发难度、市场竞争、复刻价值和综合创业排名属于后期独立 change，不进入 MVP。

## 首版必须避免

- 不把平台点赞、GitHub stars 或 Product Hunt 排名抄成本站收藏数。
- 不用“已验证创业方向”概括只有 Demo 的案例。
- 不自动抓取平台内容后直接发布。
- 不用第三方截图和 Logo 填满卡片后再补授权。
- 不把 ColorSnap 的模拟能力包装成真实功能。

## Apply 阶段验证结论

| 发现 | 处理 |
|---|---|
| 首发 seed 加入后，旧 pgTAP 仍假设公开库只有 1 条测试数据 | 所有 RLS 断言限定到测试夹具；首发 12 项使用独立精确断言 |
| 8 份产品预览的许可说明与权属 JSON 有文字漂移 | seed 与权属清单逐字段统一，并增加逐案例相等测试 |
| 只统计“12 张封面/12 份预览”不能证明每个案例都有媒体 | 改为统计 12 个不同案例，并在 PGlite 中逐 slug 核对关系和字段 |
| 媒体表缺少“为什么可以使用”和 GIF 海报哈希 | 增加 `permission_basis`、`static_poster_hash` 与数据库约束 |
| 旧 seed 只增不减，会残留已删除的事实或授权 | 首发 12 项关系由版本化 seed 完整托管；内容变化时收敛重建，指纹未变时完全不写关系 |
| 重复 seed 会触发 `updated_at`，造成 sitemap 假更新 | 保存内容指纹，只在内容真正变化时更新案例行 |
| AnythingLLM 获准 GIF 约 31 MB | 不改动原始获准文件；页面默认只请求已登记静态海报，用户主动播放后再加载 GIF |
| 生产 `db push` 默认不执行 seed | 增加两份版本化数据 migration，并由测试逐字比对 seed；首次发布断言精确 12/10/4/8 |
| migration 内显式 `COMMIT` 会提前结束 CLI 隐式事务 | 从生产内容 migration 与 seed 镜像同步移除事务控制，内容和迁移历史现在同成同败 |
| 12 张卡片封面原图合计约 20.5 MB | 本地静态媒体改用响应式图片优化，移动端不再直接下载原始 PNG |
| 收藏计数触发器会刷新 `updated_at` | 更新时间触发器排除 `favorites_count`，并增加数据库契约测试 |
| 减少动态效果模式点击 GIF 后仍显示海报 | 默认不加载动画，只有用户显式点击后播放；不再用 `<source>` 吞掉点击结果 |
| pgTAP 的 `like/unlike` 调用与重复媒体主键 | 改用真实 `matches/doesnt_match` 函数并修正夹具；便携 pgTAP 当时增至 77 项，加入排序契约后增至 81 项，后续随主要主张、源码状态与发布闸门契约最终增至 103 项 |
| Server Component 流式阶段的非法查询清理可能返回 200 + 客户端跳转 | 静态查询规范化前移到 proxy，非法枚举与页码现在真实返回 307 |
| 极大页码可越过 JavaScript 整数检查并溢出数据库分页参数 | 页码统一限制为安全整数且最多 10,000，并在 proxy 与页面两层测试 |
| 全局公开布局挂载统计会让 404 也发送页面事件 | 统计组件只在成功的首页、案例库和已发布详情页挂载，并拒绝路径不一致的事件 |
| 动态详情的软 404 会返回 HTTP 200 | 已发布 slug 生成静态参数并关闭未知动态参数；ColorSnap、草稿和未知 slug 现在返回真实 404/noindex |
| 图片可能在 React 水合前失败且详情截图会被裁切 | 用原生加载状态检测捕获预水合失败，提供说明和重试；详情媒体使用自然比例与 `contain` |
| 收藏请求失败会抛到整页错误边界 | Server Action 返回结构化错误，按钮局部呈现失败并允许重试 |
| 生产变量只判空会接受路径 origin、环回地址或管理密钥 | 生产强制无路径 HTTPS origin、拒绝 localhost 与私网/保留 IP 字面量，并校验 Supabase 公开密钥；构建后再扫描客户端密钥 |
| 没有提交基线就无法证明部署来源或可靠回滚 | 发布前置检查强制干净且已提交的 Git 基线、固定 Supabase CLI 和三份精确 migration；当前会按设计失败，不伪装成可发布 |
| 卡片使用抽象封面会削弱“先看真实产品” | 卡片查询每个案例首份获准真实产品预览；缺失、未批准、抽象媒体或无海报 GIF 直接失败 |
| 详情字段与证据主张分开渲染会发生标签漂移 | 11 个详情区块各有唯一主要主张；九个拆解正文直接来自主要主张，事实同时显示一手来源与核验日期 |
| “开源项目”分类不能证明源码确实公开 | 新增独立源码状态；公开案例的 `open_source` 必须有非镜像规范仓库与同 URL 开源证据，`closed_source` 不得挂二者，未知状态不能发布 |
| ColorSnap 的算法容易被误写成 AI | 草稿明确当前无 AI 调用，CIEDE2000 是确定性颜色计算，并分别记录已实现、模拟和未实现能力 |
| 生产 HTTPS 校验仍可能指向私网 IP 字面量或错误 Supabase 项目 | 拒绝回环、私网、链路本地和保留 IP 字面量；生产 URL 与 20 位 Project Ref 精确绑定，发布证据再绑定完整 Git commit |
| 延迟发布门禁在两个编辑事务并发时可能各自看到旧依赖 | 所有影响门禁的子表写入先锁同一案例父行；独立 dblink 测试证明后提交事务会被拒绝 |
| 本地 seed 重放会删除重建公开关系 | 指纹未变化时跳过关系写入，并逐行比较关系 UUID、`created_at` 与案例更新时间 |
| 只记录本地 migration 哈希不能证明生产库已升级 | 新增版本化公开 schema contract，并直接核对 12 个源码状态、132 条主要主张与 11 个区块 |
| `pnpm verify` 依赖手工 `.env.local`，缺变量时只会让 Playwright 等待超时 | 新增本地环境运行器，从 Supabase Local 读取并只注入公开 URL/密钥与 Mailpit；服务端秘密从子进程环境移除 |

本轮生产 migration/seed、145 项便携 pgTAP、158 项正式并发 pgTAP、数据库 lint、代码检查、TypeScript、134 个单元测试、12 条真实 Auth/Mailpit/Chrome E2E（含样品下载）和 27 页本地生产构建均通过。最终 OpenSpec strict 复验仍等待用户允许执行固定第三方包；Git 首个提交与生产环境证据尚未形成，不能用本地结果替代。

## Blueprint 交易平台信息架构审计

| 检查项 | 当前事实 | 目标结论 |
|---|---|---|
| 产品定位 | 首页、导航和 CTA 全部围绕“案例库” | Blueprint 是核心商品，Demo 是免费入口 |
| Blueprint 商品 | 没有目录、详情、版本、交付清单、权利或精确价格 | 独立 `/blueprints` 与 `/blueprints/[slug]` |
| Demo 转化 | Demo 详情只返回案例库或收藏 | 只有真实可售关系才显示对应 Blueprint |
| 结账与支付 | 无订单、支付回调、退款和对账 | 服务端价格快照、验签、幂等、乱序和对账 |
| 购买后交付 | 账号侧只有收藏 | 订单、权益、资料库、私有授权下载和审计 |
| 会员与 Pro | 无方案、状态和权益 | 单品成立后分别实现会员生命周期和一次咨询 |
| Marketplace 边界 | 未定义销售方 | 首阶段本站自营；多卖家必须另建完整平台能力 |

第一性原理结论：不能把 `demos` 表增加一个价格字段后当成商城。免费案例、可售固定版本和购买后权利解决的是三个不同问题，必须独立建模。第一笔交易只需要一个自营 Blueprint、一个固定版本、一个精确价格、一个币种和一个支付商；100 个 Demo、购物车、优惠券、会员和第三方卖家都不是前置条件。
