# 来源注册表

核验日期：2026-07-16。

结论：首版所有来源都只创建内部候选，不能自动发布。当前只有 GitHub 与 Hugging Face 适合在后续 change 中使用官方 API 做自动发现；Gitee 属于条件接入。Product Hunt 必须先取得商业 API 授权，其余命名渠道先保持人工发现与一手来源二验。

## 统一保存字段

来源注册表只保存发现和核验所需的最小数据：

```text
source_key
source_item_id
canonical_url
title
public_publisher
publisher_region
publisher_entities[] { name, role, region, evidence_url }
source_platform
source_is_mirror
canonical_upstream_url
official_category
published_at
updated_at
discovered_at
last_verified_at
reviewer_summary
rights_status
```

不默认保存全文、README、Prompt、代码、截图、缩略图、头像、Logo、邮箱或平台投票数。确需保存公开指标时必须同时保存 `observed_at`，且不能把平台指标写成本站收藏、热度或商业验证。

## 国内发现渠道

| 渠道 | 官方入口 | MVP 方式 | 后续接入条件 | 主要边界 |
|---|---|---|---|---|
| GitHub 中文项目 | [REST Search](https://docs.github.com/en/rest/search/search)、[中文 Trending](https://github.com/trending?spoken_language_code=zh) | 人工发现，REST API 补官方仓库事实 | GitHub App/PAT、限流、许可证门禁、删除同步 | 编程语言不等于中文来源；无许可证不等于可复用；遵守 [AUP](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies) |
| Gitee | [OpenAPI](https://gitee.com/api/v5/swagger#/getV5SearchRepositories) | 人工发现 | 确认搜索接口、OAuth/token、限流和许可证门禁后条件 API | 每个仓库单独核对许可，不热链；遵守 [使用条款](https://gitee.com/terms) |
| CSDN AI 项目 | [站内搜索](https://so.csdn.net/so/search?q=AI%20项目) | 仅人工发现线索 | 自动化前先取得书面许可 | 公开事实必须回到产品官网、官方文档或上游仓库；不复制文章和图片 |
| 掘金 AI 项目 | [站内搜索](https://juejin.cn/search?query=AI%20项目) | 仅人工发现线索 | 自动化前先取得书面许可 | 不做垂直搜索或内容汇编；关键事实回到一手来源，遵守 [用户协议](https://juejin.cn/terms) |
| 即梦 | [创意社区](https://jimeng.jianying.com/) | 人工发现视觉案例 | 官方发现 API 或书面许可；逐项创作者媒体许可 | 分享可见不等于允许转载、商用 Prompt 或生成图 |
| 可灵 | [全球官网](https://klingai.com/app/) | 人工发现 | 官方社区发现 API 或书面许可、稳定作品 ID、媒体授权 | 中国研发来源用快手官方发布稿核验；生成 API 不是公共案例发现 API；合同主体与研发来源分开记录 |
| 豆包 | [官网](https://www.doubao.com/chat/) | 人工提交分享链接 | 官方发现 API 或书面许可 | 没有稳定公开目录；不爬取、镜像或擅用品牌内容，遵守 [用户协议](https://www.doubao.com/legal/terms) |
| TRAE 作品 | [Demo Wall](https://traedemos.com/zh-CN)、[官方说明](https://forum.trae.cn/t/topic/15192) | 人工发现 | Demo Wall 运营方许可或正式 API | Demo Wall 为社区成员独立运营，不能当作 TRAE 官方背书；产品事实必须二验 |
| 百度 AI 应用 | [秒哒应用广场文档](https://cloud.baidu.com/doc/MIAODA/s/Pmck9hefk)、[千帆 Agent 文档](https://cloud.baidu.com/doc/APPBUILDER/index.html) | 人工核验官方应用与教程 | 公开目录 API 或合作授权 | 自有应用管理 API 不是公共广场搜索 API；复制应用不等于可再分发素材 |
| 阿里云百炼案例 | [实践教程](https://help.aliyun.com/zh/model-studio/use-cases/) | 人工核验官方教程 | 官方案例目录 API 或合作授权 | 账号内资源 API 不是案例发现 API；页面图片和代码逐项核对权利 |
| 腾讯云 AI 案例 | [AI 产品与客户案例](https://cloud.tencent.com/product/ai-class)、[智能体文档](https://cloud.tencent.com/document/product/1759/105105) | 人工核验官方案例 | 公开案例 API 或合作授权 | 匿名客户材料不足以建立独立案例；应用管理 API 不是公共目录 API |

## 海外发现渠道

| 渠道 | 官方入口 | MVP 方式 | 后续接入条件 | 主要边界 |
|---|---|---|---|---|
| Product Hunt AI | [官网](https://www.producthunt.com/)、[API 2.0](https://api.producthunt.com/v2/docs) | 人工发现，事实回产品官网 | 书面商业许可、App/token、归因和限流 | 默认 API 授权不适合本站商业数据库；不复制图片、Tagline 或投票数据 |
| GitHub Trending AI | [Trending](https://github.com/trending?since=daily) | 人工观察，REST API 补仓库事实 | GitHub 提供正式 Trending API 或书面许可 | 当前无官方 Trending API；不能用自算 Star 排名冒充官方 Trending |
| Hugging Face Spaces | [Spaces](https://huggingface.co/spaces)、[Hub API](https://huggingface.co/docs/hub/en/api) | 人工发现，官方 API 补元数据 | Token、限流、许可门禁和下架同步 | Space 的代码、模型、数据、媒体许可分别核对；`unknown` 不复用 |
| Lovable Templates | [Templates](https://lovable.dev/templates) | 人工分类参考 | 书面许可或公开模板发现 API | Remix 不等于可转售代码或媒体；不使用 bot/scraper，遵守 [条款](https://lovable.dev/terms) |
| Vercel AI Templates | [AI Templates](https://vercel.com/templates/ai) | 人工发现，回底层仓库核验 | 书面许可或公开目录 API | 社区模板由第三方提供；代码许可以仓库为准，不热链，遵守 [AUP](https://vercel.com/legal/acceptable-use-policy) |
| Framer AI Templates | [AI Marketplace](https://www.framer.com/marketplace/templates/category/ai/) | 人工视觉与商业参考 | 书面许可/API、创作者媒体许可 | 付费模板通常不允许再分发；不搬预览图，遵守 [Marketplace 许可](https://www.framer.com/legal/community-terms/1.0) |
| Figma Community AI Designs | [Community](https://www.figma.com/community/)、[官方指南](https://help.figma.com/hc/en-us/articles/360038510693-Guide-to-the-Figma-Community) | 人工设计参考 | 官方 Community 搜索 API、OAuth 和资源许可 | 自动访问可能返回 403，必须用浏览器人工核验；REST API 不能搜索整个 Community；公开文件不等于可复制媒体或转售，遵守 [Developer Terms](https://www.figma.com/legal/developer-terms/) |
| Cursor AI Projects | [Built with Cursor](https://forum.cursor.com/c/showcase/built-with-cursor/18) | 人工发现线索 | 书面许可或官方 Showcase API | 论坛自述不是已验证事实；回到产品官网/仓库二验，遵守 [条款](https://cursor.com/en-US/terms-of-service) |
| Replit AI Apps | [Gallery](https://replit.com/gallery)、[Replit Agent](https://replit.com/products/agent) | 人工发现 | 书面许可或发现 API、逐项许可证审查 | 当前没有单独的公开 AI Apps 目录；只能从通用 Gallery 发现后逐项二验。公开 App、依赖和媒体权利分别确认；不抓取，遵守 [条款](https://replit.com/terms-of-service/) |
| Bolt.new Projects | [Gallery](https://bolt.new/gallery/all) | 人工发现 | StackBlitz 书面许可或公开 Gallery API | Gallery 展示不授予代码或媒体再分发权；不自动汇编数据库，遵守 [条款](https://stackblitz.com/terms-of-service) |
| v0 Templates | [模板文档](https://v0.app/docs/templates) | 人工发现 | 公开模板目录 API、API key 和权利门禁 | Platform API 管理项目与聊天，不是公共模板搜索 API；受 Vercel AUP 约束 |

## 接入分级

| 等级 | 渠道 | 规则 |
|---|---|---|
| 官方 API 候选 | GitHub、Hugging Face | 只自动创建 `discovered` 候选；限流、删除同步和许可证门禁通过后才启用 |
| 条件 API | Gitee | 先确认接口、授权与限流，未确认前保持人工 |
| 商业授权后 API | Product Hunt | 没有书面商业授权时不调用 API 建商业数据库 |
| 人工官方资料 | 百度、阿里云、腾讯云、GitHub Trending | 保存链接和编辑摘要，关键事实逐条引用 |
| 人工线索且必须二验 | CSDN、掘金、即梦、可灵、豆包、TRAE、Lovable、Vercel、Framer、Figma、Cursor、Replit、Bolt、v0 | 不复制正文或媒体；回产品官网、文档或仓库核验 |

## 自动发现前置门槛

任何自动发现 change 必须同时满足：

1. 有稳定官方 API 或书面许可，禁止页面抓取替代。
2. 记录限流、授权、允许字段、删除/下架同步和条款复核日期。
3. 自动结果只进入 `discovered`，不能自动生成事实、评分、媒体或 `published` 状态。
4. 去重使用官方稳定 ID 与 canonical URL；无法确认时人工处理，不用标题相似度强行合并。
5. 平台数据不得进入本站收藏、热门、商业潜力或“已验证”结论。

## 运行证据边界

当前文件只证明 22 个渠道已登记和完成接入方式初筛，不证明任何连接器、检索任务或人工采编流程已经运行。后续 `build-editorial-operations` 与 `connect-approved-discovery-sources` 必须保存以下最小证据：

| 对象 | 最小字段 |
|---|---|
| `source_runs` | `source_key`、人工/API、查询或入口、开始/结束时间、条款版本日期、结果数、失败类型、错误摘要、执行人 |
| `source_candidates` | 稳定来源 ID、canonical URL、标题、公开发布者、发现时间、来源运行 ID、去重结果、当前采编状态 |
| `source_reviews` | 候选、审核人、主体/地区/主来源/权利结论、证据 URL、通过或拒绝原因、审核时间 |
| `source_removals` | 来源下架/删除时间、影响候选、处理动作和完成时间 |

每个命名渠道的完成证据必须包含一份可执行运行手册，以及至少一次成功运行或可复现的合规阻断记录。自动结果只能进入 `discovered`；没有候选结果不能伪造数据补数。
