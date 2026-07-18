# 首发内容清单

核验日期：2026-07-16。

结论：首发 12 个案例已写入版本化生产数据 migration，并与 `supabase/seed_content.sql` 逐字对齐；覆盖 10 个优先方向，其中中国大陆发布方 4 项、海外发布方 8 项。每项均有官方主来源、已核验发布方、11 个主要主张、事实/编辑推断/产品假设、显式源码状态、四项创业改造、商业潜力判断、原创抽象封面和获准使用的真实产品预览。生产 migration、重复 seed、109 项便携 pgTAP 与 117 项正式并发 pgTAP 已通过，12 项均满足数据库 `published` 门槛；生产发布仍待完成。

## 当前首发清单

| # | 案例 | 分类 | 地区 | 成熟度 | 商业潜力 | 官方主来源 | 产品预览依据 |
|---:|---|---|---|---|---:|---|---|
| 1 | RoomGPT | AI 装修设计 | `international` | `production_product` | 4/5 | [GitHub](https://github.com/Nutlope/roomGPT) | 官方仓库 MIT 截图 |
| 2 | CogVideoX | AI 视频生成 | `mainland_china` | `working_demo` | 3/5 | [GitHub](https://github.com/zai-org/CogVideo) | 官方仓库 Apache-2.0 Web Demo 图；只证明研究界面 |
| 3 | FunClip | AI 视频生成/剪辑 | `mainland_china` | `working_demo` | 3/5 | [GitHub](https://github.com/modelscope/FunClip) | 官方仓库 MIT 界面图 |
| 4 | Presenton | AI PPT 生成 | `international` | `production_product` | 4/5 | [GitHub](https://github.com/presenton/presenton) | 官方仓库 Apache-2.0 产品图 |
| 5 | PPTAgent / DeepPresenter | AI PPT 生成 | `mainland_china` | `working_demo` | 3/5 | [GitHub](https://github.com/icip-cas/PPTAgent) | 官方仓库 MIT 生成结果；第三方底图权利不扩张 |
| 6 | Novel | AI 写作助手 | `international` | `working_demo` | 2/5 | [GitHub](https://github.com/steven-tey/novel) | 官方仓库 Apache-2.0 编辑器图 |
| 7 | Open Notebook | AI 学习助手 | `international` | `production_product` | 3/5 | [GitHub](https://github.com/lfnovo/open-notebook) | 官方仓库 MIT 界面图 |
| 8 | Postiz | AI 营销工具 | `international` | `production_product` | 4/5 | [GitHub](https://github.com/gitroomhq/postiz-app) | 官方仓库 AGPL-3.0 产品图 |
| 9 | OpenGame | AI 游戏生成 | `international` | `working_demo` | 2/5 | [GitHub](https://github.com/leigest519/OpenGame) | 官方仓库 Apache-2.0 原创猫咪演示海报 |
| 10 | RestorePhotos | AI 图片处理 | `international` | `production_product` | 3/5 | [GitHub](https://github.com/Nutlope/restorePhotos) | 官方仓库 MIT 截图；人物肖像不单独使用 |
| 11 | MaxKB | AI 客服 | `mainland_china` | `production_product` | 5/5 | [GitHub](https://github.com/1Panel-dev/MaxKB) | 官方仓库 GPL-3.0 工作流界面图 |
| 12 | AnythingLLM | AI 个人知识库 | `international` | `production_product` | 4/5 | [GitHub](https://github.com/Mintplex-Labs/anything-llm) | 官方 release GIF 与 MIT；同时登记静态海报及哈希 |

商业潜力是站内编辑判断，不是收入、融资或市场成功证明。CogVideoX、PPTAgent、OpenGame 等研究/开源项目不会被包装成成熟 SaaS；每页 `truth_boundary` 明确已实现、模拟和未实现内容。

## 发布主体与媒体权属

| 案例 | 已核验发布主体 | 地区依据 |
|---|---|---|
| RoomGPT / RestorePhotos | Hassan El Mghari | [作者官网](https://www.nutlope.com/) |
| CogVideoX | Z.ai / CogVideo 团队 | [官方仓库](https://github.com/zai-org/CogVideo) |
| FunClip | ModelScope / 通义实验室 | [官方仓库](https://github.com/modelscope/FunClip) |
| Presenton | Presenton Inc. | [官方条款](https://presenton.ai/terms-and-conditions) |
| PPTAgent | 中国科学院计算技术研究所 ICIP 团队 | [机构官网](https://www.ict.ac.cn/jssgk/) |
| Novel | Steven Tey | [GitHub 主页](https://github.com/steven-tey) |
| Open Notebook | Luis Novo | [GitHub 主页](https://github.com/lfnovo) |
| Postiz | Gitroom Limited / Gitroom LLC | [官方条款](https://postiz.com/terms-of-service)；两者均在中国大陆以外，案例地区为 `international` |
| OpenGame | CUHK MMLab OpenGame 团队 | [实验室官网](https://mmlab.ie.cuhk.edu.hk/index.html) |
| MaxKB | 飞致云（FIT2CLOUD） | [公司官网](https://www.fit2cloud.com/about/) |
| AnythingLLM | Mintplex Labs Inc. | [官方 GitHub 组织](https://github.com/Mintplex-Labs) |

- `content/media-rights.json` 登记 12 张本站原创 1586×992 抽象封面；这些图明确不是产品界面或产品方授权素材。
- `content/product-media-rights.json` 登记 12 份真实产品预览的官方来源、权利人、许可说明、使用依据和 SHA-256；AnythingLLM 另登记静态海报 SHA-256。
- `tests/unit/content-assets.test.ts` 逐文件验哈希，并逐案例比较两份清单与 seed 内嵌目录；`scripts/validate-content-seed.mjs` 再验证数据库落地结果。
- 所有素材只用于案例说明；代码许可不自动扩大商标、模型权重、生成内容、人物肖像或第三方底图的使用权。

## 首发替换记录

| 原候选 | 最终替换 | 原因 |
|---|---|---|
| Wan2.2 | CogVideoX | Wan 的候选视频是用户上传资产，无法建立足够清晰的媒体许可链；CogVideo 官方仓库提供可审计 Web Demo 图 |
| Gamma | PPTAgent | 闭源宣传素材权利边界较弱；PPTAgent 提供官方开源生成结果和中国研究团队证据 |
| NotebookLM | Open Notebook | 闭源产品截图不直接复制；Open Notebook 提供可自托管实现与 MIT 官方界面图 |
| Jasper | Postiz | 闭源营销素材不进入首发；Postiz 有正式服务、公开定价、开源工作流和官方产品图 |
| Rosebud AI | OpenGame | 闭源生成内容权利不够清晰；OpenGame 使用官方仓库中不含已知影视游戏角色的原创演示 |
| Chatwoot Captain | MaxKB | Captain/Enterprise 与社区核心授权边界复杂；MaxKB 的仓库、企业主体、工作流界面和商业服务证据更完整 |

MoneyPrinterTurbo 仍因主发布方地区无法用一手证据确认而保持候选；ColorSnap 仍为 `draft`，不进入公开目录。

## 提案阶段历史记录（已废弃）

下方保留提案阶段的原始 12 项核验记录，仅用于审计替换过程，其中“0 项可公开”和旧候选清单已不再代表当前实现。

<details>
<summary>展开历史记录</summary>

## 首发覆盖

| # | 案例 | 分类 | 发布方地区 | 成熟度 | 代码/产品边界 | 当前状态 |
|---:|---|---|---|---|---|---|
| 1 | RoomGPT | AI 装修设计 | `international` | `production_product` | 开源仓库 MIT；商业站素材不自动继承许可 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 2 | Wan2.2 | AI 视频生成 | `mainland_china` | `working_demo` | 代码与模型 Apache-2.0；商标和官方演示素材不自动授权 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 3 | FunClip | AI 视频剪辑 | `mainland_china` | `working_demo` | 代码 MIT；所用模型分别核对许可 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 4 | Presenton | AI PPT 生成 | `international` | `production_product` | Apache-2.0；云端品牌素材不自动授权 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 5 | Gamma | AI PPT 生成 | `international` | `production_product` | 闭源专有产品 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 6 | Novel | AI 写作助手 | `international` | `working_demo` | Apache-2.0 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 7 | NotebookLM | AI 学习助手 | `international` | `production_product` | 闭源专有产品 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 8 | Jasper | AI 营销工具 | `international` | `production_product` | 闭源专有产品 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 9 | Rosebud AI | AI 游戏生成 | `international` | `production_product` | 闭源；生成内容使用范围需按当前计划条款逐项核对 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 10 | RestorePhotos | AI 图片处理 | `international` | `production_product` | MIT；第三方模型和商业站素材分别核对 | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 11 | Chatwoot Captain | AI 客服 | `international` | `production_product` | Chatwoot 社区核心与 Captain/Enterprise 授权分开，不能统称 MIT | 事实就绪；编辑判断/封面/产品媒体待完成 |
| 12 | AnythingLLM | AI 个人知识库 | `international` | `production_product` | MIT | 事实就绪；编辑判断/封面/产品媒体待完成 |

首发方向计数：AI 装修 1、AI 视频 2、AI PPT 2、AI 写作 1、AI 学习 1、AI 营销 1、AI 游戏 1、AI 图片 1、AI 客服 1、AI 知识库 1。

难度和商业潜力分目前保持 `pending`。进入 apply 后必须按 `EDITORIAL_GUIDE.md` 写出证据与理由，完整后才能发布，不能先填分数后找理由。

## 逐项官方事实

| 案例 | 允许写成事实的首版内容 | 官方来源 |
|---|---|---|
| RoomGPT | 上传房间照片并生成不同风格的改造结果；官方仓库说明使用 ControlNet 与 Replicate；开源版本是商业产品的早期版本 | [官方仓库](https://github.com/Nutlope/roomGPT) |
| Wan2.2 | 系列包含文生视频、图生视频和统一支持两类任务的 TI2V-5B；TI2V-5B 支持 720P、24 FPS；官方发布推理代码、权重、ComfyUI/Diffusers 接入和在线体验 | [官方仓库](https://github.com/Wan-Video/Wan2.2)、[阿里云发布稿](https://www.alibabacloud.com/en/press-room/alibaba-releases-wan2-2-to-uplift-cinematic) |
| FunClip | 基于 FunASR 识别视频语音；可以按文本片段或说话人剪辑；可以生成 SRT，并提供本地 Gradio 界面 | [官方仓库](https://github.com/modelscope/FunClip) |
| Presenton | 支持 Docker 自托管和桌面端；支持多种云端或本地模型；可以导出可编辑 PPTX 和 PDF | [官方仓库](https://github.com/presenton/presenton) |
| Gamma | 可以从想法、提纲或已有内容生成；支持 AI 编辑与实时协作；支持导出或发布为多种格式 | [官网](https://gamma.app/) |
| Novel | Notion 风格富文本编辑器；支持 AI 自动续写；官方仓库采用 Next.js、Tiptap 和 OpenAI | [官方仓库](https://github.com/steven-tey/novel) |
| NotebookLM | 支持 PDF、网页、YouTube、音频和 Google 文件等来源；回答基于用户资料并带行内引用；可以生成学习指南、简报、音频概览和思维导图 | [官方帮助](https://support.google.com/notebooklm/answer/16164461) |
| Jasper | 面向营销团队的 AI 工作平台；Jasper IQ 可应用品牌语气、受众和产品知识；Brand Voice、Canvas 与 API 支持内容生产和系统接入 | [官网](https://www.jasper.ai/)、[Agents](https://www.jasper.ai/agents)、[Brand Voice](https://help.jasper.ai/hc/en-us/articles/18618693085339-Brand-Voice)、[Canvas](https://help.jasper.ai/hc/en-us/articles/37817833127963-Jasper-Canvas)、[API](https://help.jasper.ai/hc/en-us/articles/18618701173659-Jasper-s-API) |
| Rosebud AI | 官方提供通过描述或模板创建游戏的入口；支持上传图片；提供 Game Creator、3D、RPG 和视觉小说等产品入口 | [官网](https://rosebud.ai/) |
| RestorePhotos | 用于修复旧照片和模糊人脸；官方仓库调用 Replicate 上的 GFPGAN；基于 Next.js 并支持自行部署 | [官方仓库](https://github.com/Nutlope/restorePhotos) |
| Chatwoot Captain | 可以从帮助中心、历史会话和 FAQ 回答；必要时转人工；Copilot 支持起草、优化和翻译 | [Captain 官网](https://www.chatwoot.com/captain)、[官方仓库](https://github.com/chatwoot/chatwoot) |
| AnythingLLM | 支持文档问答和引用；内置 Agent、向量库和文档管线；提供本地桌面端和多用户 Docker 版本 | [官方仓库](https://github.com/Mintplex-Labs/anything-llm) |

上述只覆盖官方可确认事实。痛点、用户、商业逻辑、复刻方向和创业改造仍属于编辑分析或产品假设，页面必须显示对应标签。

## 发布方地区与来源平台

以下主体与地区证据已于 2026-07-16 逐项打开核验。个人创建者只能记录为个人发布者，不能虚构公司主体。

| 案例 | 发布主体与角色 | 地区 | 来源平台 | 官方证据 |
|---|---|---|---|---|
| RoomGPT | Hassan El Mghari；创建者、仓库发布者 | `international` | 官网 / GitHub | [作者官网](https://www.nutlope.com/)自述居住纽约并列出 RoomGPT；[产品页](https://www.roomgpt.io/)、[仓库](https://github.com/Nutlope/roomGPT) |
| Wan2.2 | Alibaba；模型与仓库发布方 | `mainland_china` | GitHub / 阿里云发布稿 | [阿里云发布稿](https://www.alibabacloud.com/en/press-room/alibaba-releases-wan2-2-to-uplift-cinematic)明确由 Alibaba 发布并标注中国杭州；[仓库](https://github.com/Wan-Video/Wan2.2) |
| FunClip | ModelScope / 通义实验室；项目发布方 | `mainland_china` | GitHub / ModelScope | [官方仓库](https://github.com/modelscope/FunClip)说明项目来自通义实验室并由 ModelScope 组织发布 |
| Presenton | Presenton Inc.；云服务与开源项目发布方 | `international` | 官网 / GitHub | [官方条款](https://presenton.ai/terms-and-conditions)列出美国特拉华州地址并区分云服务与开源核心；[仓库](https://github.com/presenton/presenton) |
| Gamma | Gamma Tech, Inc.；Gamma 服务提供方 | `international` | 官网 / 法律页 | [官方 DPA](https://gamma.app/dpa)明确其为美国公司并列旧金山地址；[使用条款](https://gamma.app/terms) |
| Novel | Steven Tey；创建者、仓库发布者 | `international` | GitHub / 作者官网 | [GitHub 主页](https://github.com/steven-tey)自述位于 Seattle；[作者官网](https://steventey.com/)、[仓库](https://github.com/steven-tey/novel) |
| NotebookLM | Google LLC；普通消费者服务提供方 | `international` | Google Help / 法律页 | [Google 服务条款](https://policies.google.com/terms/embedded?hl=en-US)明确 Google LLC 为美国特拉华州公司；[NotebookLM 官方说明](https://support.google.com/notebooklm/answer/16164461) |
| Jasper | Jasper AI, Inc.；服务提供方 | `international` | 官网 / Help Center / 法律页 | [官方 SaaS 协议](https://www.jasper.ai/legal/saas-agreement)明确主体为美国特拉华州公司 |
| Rosebud AI | Rosebud AI, Inc.；产品与服务提供方 | `international` | 官网 / 法律页 | [隐私政策](https://lab.rosebud.ai/privacy-policy)列出旧金山地址；[服务条款](https://lab.rosebud.ai/terms-of-service) |
| RestorePhotos | Hassan El Mghari；创建者、仓库发布者 | `international` | 官网 / GitHub | [作者官网](https://www.nutlope.com/)自述居住纽约并列出 RestorePhotos；[产品页](https://www.restorephotos.io/)、[仓库](https://github.com/Nutlope/restorePhotos) |
| Chatwoot Captain | Chatwoot Inc.；Captain / Chatwoot 服务提供方 | `international` | 官网 / GitHub / 公司手册 | [公司手册](https://www.chatwoot.com/hc/handbook/en/categories/company)明确 Chatwoot Inc. 在美国特拉华州注册；[Captain](https://www.chatwoot.com/captain)、[服务条款](https://www.chatwoot.com/terms-of-service) |
| AnythingLLM | Mintplex Labs Inc.；产品、官网与仓库发布方 | `international` | 官网 / GitHub | [官方 GitHub 组织页](https://github.com/Mintplex-Labs)自述位于美国并发布 AnythingLLM；[官网](https://anythingllm.com/)、[仓库](https://github.com/Mintplex-Labs/anything-llm) |

NotebookLM 的主体证据针对普通消费者服务；企业或教育账号可能适用其他 Google 合同主体。AnythingLLM 的美国地区来自官方组织自报，不写成公司注册核验。`international` 只表示已核验发布者在中国大陆以外，不代表产品覆盖所有国家。来源平台必须另存，不能据此反推发布方地区。

## 被替换候选

| 候选 | 不首发原因 | 后续状态 |
|---|---|---|
| MoneyPrinterTurbo | 中文 README 和作者语言不能证明主发布方地区，当前只能标为 `unknown` | 保持草稿；补到可核验官方主体后再评估 |
| Postiz | 官方资料显示香港与美国主体并存，可标为 `mixed`；Jasper 是更直接的 AI 营销案例 | 保持候选，不作为首发；不是因为数据模型无法表达 |

## 发布前剩余门槛

1. 为 12 个案例各制作一张原创 `16:10` 封面和有效 alt；每项另需至少一份由本站在许可允许范围内实际运行后采集，或取得权利人明确授权的真实产品截图/GIF/视频。不得直接复制未授权 Logo、官网截图或宣传视频。
2. 在写入种子数据当天重新打开全部在线体验、仓库、帮助和法律链接，并记录核验时间。
3. 对 FunClip 模型、Wan2.2 权重、Chatwoot Captain、Rosebud AI 和所有第三方依赖分别记录许可限制；代码许可不能替代素材、商标和模型许可。
4. 为每个案例写四项创业改造及内容标签；为难度和商业潜力写理由、规则版本和日期。
5. 内容、展示媒体、数据库发布约束和 RLS 全部通过后，才能从 `draft` 切换为 `published`。

</details>
