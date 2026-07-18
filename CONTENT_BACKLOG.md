# 首批 30 项内容池

核验日期：2026-07-16。

本文件把首发 12 项与第二批 18 项组成“首批最多 30 个”的内容池，不改变 `launch-curated-mvp` 仍只发布 12 项的范围。首发 12 项的名称、官方 URL 与逐项事实见 `LAUNCH_CONTENT.md`。数量不是发布证明；首发 12 项已在本地 migration 达到 `publish_ready` 并以 `published` 状态通过数据库门槛，生产公开数量仍为 0；第二批 18 项尚未达到 `publish_ready`。

## 状态汇总

| 分组 | 数量 | 当前状态 |
|---|---:|---|
| 首发清单 | 12 | 本地 `publish_ready`；migration 中为 `published`，生产尚未部署 |
| 第二批事实就绪 | 16 | `facts_ready`；拆解、判断和媒体待完成 |
| 第二批主体已核验 | 1 | 豆包爱学缺独立稳定产品入口，保持 `source_verified` |
| 第二批发现项 | 1 | OpenHands 官方注册地区证据不足，保持 `discovered` |
| 合计 | 30 | 12 项本地 `publish_ready`，12 项本地 `published`，0 项生产公开 |

第二批统一规则：`commercial_potential=pending`、`difficulty=pending`、`media_status=pending`。平台点赞、Star、下载量、模板使用数和 Product Hunt 排名均不进入本站收藏或商业潜力。

## 第二批 18 项索引

| # | 候选 | Case kind | 分类 | 发布方地区 | 发现平台 | 成熟度 | 状态 |
|---:|---|---|---|---|---|---|---|
| 13 | PaddleOCR | `open_source_project` | AI 文档/图片处理 | `mainland_china` | Gitee 官方镜像 | `production_product` | `facts_ready` |
| 14 | FunASR | `open_source_project` | AI 语音转写 | `mainland_china` | ModelScope / GitHub | `production_product` | `facts_ready` |
| 15 | 百度秒哒 MIAODA | `product` | AI App 生成 | `mainland_china` | 百度智能云 | `production_product` | `facts_ready` |
| 16 | 百炼「公众号爆文工厂」 | `official_template` | AI 营销写作 | `mainland_china` | 阿里云百炼 | `working_demo` | `facts_ready` |
| 17 | Tencent Cloud ADP | `product` | AI 客服/知识库/智能体 | `mainland_china` | 腾讯云 | `production_product` | `facts_ready` |
| 18 | 豆包爱学 | `embedded_feature` | AI 学习助手 | `mainland_china` | 豆包 | `production_product` | `source_verified` |
| 19 | 即梦 AI | `product` | AI 图片/视频创作 | `mainland_china` | 即梦 | `production_product` | `facts_ready` |
| 20 | 可灵 AI | `product` | AI 视频生成 | `mixed` | 可灵 / 快手官方发布稿 | `production_product` | `facts_ready` |
| 21 | TRAE CN | `product` | AI 开发助手 | `mainland_china` | TRAE | `production_product` | `facts_ready` |
| 22 | PageTest.AI | `product` | AI 营销/CRO | `international` | Product Hunt 发现，官网二验 | `production_product` | `facts_ready` |
| 23 | OpenHands | `product` | AI 开发助手 | `unknown` | GitHub | `production_product` | `discovered` |
| 24 | FLUX.1 Kontext [dev] | `model_demo` | AI 图片处理 | `international` | Hugging Face Spaces | `working_demo` | `facts_ready` |
| 25 | Inspo Canvas | `official_template` | AI 图片/创意协作 | `international` | Lovable Templates | `working_demo` | `facts_ready` |
| 26 | Vercel Chatbot | `official_template` | AI 客服/助手 | `international` | Vercel Templates / GitHub | `working_demo` | `facts_ready` |
| 27 | Recraft Framer Plugin | `product` | AI 图片/设计插件 | `international` | Framer Marketplace | `production_product` | `facts_ready` |
| 28 | Figma Make AI Chatbot Builder | `platform_workflow` | AI 客服原型 | `international` | Figma 官方 | `interactive_prototype` | `facts_ready` |
| 29 | Replit Agent | `product` | AI App 生成 | `international` | Replit 官方 | `production_product` | `facts_ready` |
| 30 | Bolt.new | `product` | AI App 生成 | `international` | Bolt 官方 | `production_product` | `facts_ready` |

`case_kind` 只描述案例形态：产品、开源项目、模型 Demo、官方模板、平台工作流或内嵌功能；商业服务、公开定价和采用信号仍是独立证据，不能混进该字段。

## 国内候选事实与权利边界

| 候选 | 可公开事实 | 权利与阻断 |
|---|---|---|
| PaddleOCR | 官方定位为生产级 OCR 与文档 AI 引擎；包含文字识别、文档解析、信息提取等方案；Gitee 是网络受限场景的官方镜像，可能落后 GitHub 3–5 天。[官方 GitHub 仓库](https://github.com/PaddlePaddle/PaddleOCR)、[安装文档](https://github.com/PaddlePaddle/PaddleOCR/blob/main/docs/version3.x/installation.en.md) | 代码 Apache-2.0；模型、依赖、商标和媒体分别核对。保存 canonical GitHub URL，并标记 Gitee 来源 `source_is_mirror=true` |
| FunASR | 支持 ASR、VAD、标点、说话人验证/分离；可部署离线转写服务并处理音视频；部分 ModelScope 模型有独立 Apache-2.0 许可。[仓库](https://github.com/modelscope/FunASR)、[运行文档](https://github.com/modelscope/FunASR/blob/main/runtime/docs/SDK_tutorial.md)、[模型页](https://modelscope.cn/models/iic/speech_paraformer-large-vad-punc_spk_asr_nat-zh-cn/summary) | 代码 MIT；模型逐个核对，不能把单个模型许可推广到整个 Model Zoo；Demo 音频和品牌素材不随代码许可开放 |
| 百度秒哒 | 支持对话、AI 扩写、PRD 和参考图片输入；可生成数据库、登录鉴权、权限隔离与实时协同；官方支持多数新应用导出源码，本地部署仍可能需要二次开发。[创建文档](https://cloud.baidu.com/doc/MIAODA/s/smf50gob5)、[后端文档](https://cloud.baidu.com/doc/MIAODA/s/Dmh2w3m8t)、[源码导出](https://cloud.baidu.com/doc/MIAODA/s/Xmewgmsq7) | 用户应用和代码不等于百度平台资料可转售；Blueprint 只能交付原创拆解和自行实现内容，按 [秒哒协议](https://cloud.baidu.com/doc/MIAODA/s/Vmb0jj48v) 二验 |
| 公众号爆文工厂 | 百炼模板可在线测试并复制到自己的应用；该模板按主题生成公众号文章和配图；复制后可通过 API/SDK 或指定渠道发布。[官方模板文档](https://help.aliyun.com/zh/model-studio/create-application-from-template) | 无公开源码许可；控制台“复制”不等于可把官方 Prompt、工作流或模板转售。只做原创拆解与重新实现，遵守 [阿里云协议](https://terms.aliyun.com/legal-agreement/terms/suit_bu1_ali_cloud/suit_bu1_ali_cloud201802281451_77479.html) |
| Tencent Cloud ADP | 支持标准、单工作流、Multi-Agent 和 Claw 应用；可通过 API、SDK 与办公平台集成；文档理解支持多类文件和企业知识问答。[产品概述](https://cloud.tencent.com/document/product/1759/104193) | 平台代码、模型、文档和工具不开放转售；生成内容仍需查第三方权利，云 License 不等于源码，见 [大模型条款](https://cloud.tencent.com/document/product/301/97822) |
| 豆包爱学 | 备案说明披露教育文本预训练、监督微调和人类反馈强化学习；结合题库识别学习需求；覆盖疑问解析、写作引导、知识点推荐和学习建议。[备案说明](https://www.doubao.com/legal/instructions) | 没有稳定独立落地页，不能伪装成独立 Demo；保持 `source_verified`。发布前重查 [豆包协议](https://www.doubao.com/legal/terms) 与输出商业使用限制 |
| 即梦 AI | 支持文生/图生视频及首尾帧控制；支持文生图、图生图、背景替换与风格控制；智能画布含融合、重绘、扩图、消除和抠图。[官网](https://jimeng.jianying.com/) | 平台软件、官方素材、探索区作品、Prompt、截图和 Logo 不直接复用；输入与生成内容权利仍需逐项核对 [用户协议](https://lf9-cdn-tos.draftstatic.com/obj/ies-hotsoon-draft/vco/17620dba-f821-4a18-85f9-b8b11f73304a.html) |
| 可灵 AI | 官方 3.0 系列覆盖视频、Video Omni、图片和 Image Omni；统一处理文本、图像、音频和视频；支持最长 15 秒、多语言及多角色对话控制。[快手发布稿](https://ir.kuaishou.com/zh-hans/news-releases/news-release-details/keling30xiliemoxingquanmianshangxian/) | 大陆研发方与新加坡全球服务运营方分别记录，`publisher_region=mixed`；[全球协议](https://kling.ai/docs/user-policy)对商业输出和标识有额外限制，只做免费事实拆解，不把输出装入付费包 |
| TRAE CN | 中国官网提供 TRAE Work 与 TRAE IDE；中国版 SOLO 当前只有 SOLO Coder；支持 Skills、项目级 MCP、规则、自定义模型和子代理。[官网](https://www.trae.cn/)、[FAQ](https://forum.trae.cn/t/topic/53)、[更新日志](https://www.trae.cn/changelog) | 闭源，无可转载官方代码、截图或品牌素材的许可。可做免费产品拆解，Blueprint 仅含自行编写的示例工程，按 [条款](https://www.trae.cn/terms-of-service) 复核 |

## 海外候选事实与权利边界

| 候选 | 可公开事实 | 权利与阻断 |
|---|---|---|
| PageTest.AI | 提供无代码 A/B 与多变量测试；AI 生成页面元素变体并跟踪点击、停留和滚动；价格页当前列出免费展示额度。[产品页](https://pagetest.ai/)、[仪表盘说明](https://support.pagetest.ai/en/articles/43361-dashboard-overview-how-to-manage-your-content-tests)、[价格页](https://pagetest.ai/pricing) | 闭源；价格属于时点事实，发布当天重查。不转载官网截图或素材，使用原创封面，遵守 [条款](https://pagetest.ai/terms) |
| OpenHands | 官方产品包含 SDK、CLI、本地界面、云端和企业方案；SDK 可通过 Python 或 REST API 构建软件代理；当前代码分别维护在 Software Agent SDK 与 Agent Canvas 仓库。[产品页](https://www.openhands.dev/product/)、[产品总览](https://docs.openhands.dev/overview/introduction)、[SDK 文档](https://docs.openhands.dev/sdk/index)、[SDK 仓库](https://github.com/OpenHands/software-agent-sdk)、[Agent Canvas 仓库](https://github.com/OpenHands/agent-canvas) | SDK 仓库采用 [MIT 许可证](https://github.com/OpenHands/software-agent-sdk/blob/main/LICENSE)；云端、企业方案、Agent Canvas、商标和媒体分别核对，不能沿用旧聚合仓库的许可结论。官方注册地区证据仍不足，`publisher_region=unknown`，不能升级状态 |
| FLUX.1 Kontext [dev] | 12B 参数 rectified-flow 模型；支持文生图与上下文图片编辑；连续编辑可保持人物、风格和对象一致。[模型卡](https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev)、[文档](https://docs.bfl.ai/kontext/kontext_overview)、[Space](https://huggingface.co/spaces/black-forest-labs/FLUX.1-Kontext-Dev) | 发布主体 Black Forest Labs Inc. 的官方联系地址位于美国，故记录 `publisher_region=international`，见 [隐私政策](https://bfl.ai/legal/privacy-policy)。`[dev]` 权重和推理限非商业、非生产使用；输出仍需处理第三方权利。不使用官方图库和 Logo，见 [许可证](https://huggingface.co/black-forest-labs/FLUX.1-Kontext-dev/blob/main/LICENSE.md) |
| Inspo Canvas | Lovable 官方模板提供无限画布、拖放、AI 生图和文本标注；支持多画板、登录、自动保存与导出。[模板页](https://lovable.dev/templates/apps/saas/inspo-canvas-visual-moodboard-creator-template)、[AI 文档](https://docs.lovable.dev/integrations/ai) | 只能标为 `official_template`；Remix 不等于取得代码或媒体再分发权。已核验发布主体只记录 Lovable Labs Incorporated，`publisher_region=international`，不把隐私联系人主体写成共同发布方。[消费者条款](https://lovable.dev/terms)当前展示 2026-06-16 版本，并标注 2026-08-15 生效（提前明确接受除外）；发布当天必须记录实际适用版本 |
| Vercel Chatbot | 基于 Next.js 与 AI SDK；支持多模型、工具调用和生成式 UI；集成数据库、Blob 与 Auth.js 并支持部署。[模板页](https://vercel.com/templates/next.js/chatbot)、[仓库](https://github.com/vercel/chatbot) | 仓库 Apache-2.0，但商标、截图、第三方模型和素材不在许可内。必须写成 starter 模板，不写成已验证独立 SaaS |
| Recraft Framer Plugin | 可在 Framer 内生成和编辑图片；支持位图、矢量、插画、图标和 Logo；提供矢量化、去背景与放大。[市场页](https://www.framer.com/community/marketplace/plugins/recraft/) | 市场页为 Limited License；Recraft 免费与付费计划商业权利不同，发布当天按 [条款](https://www.recraft.ai/legal/terms) 和 [权利说明](https://www.recraft.ai/docs/plans-and-billing/commercial-rights-and-ownership) 复核 |
| Figma Make AI Chatbot Builder | 可用自然语言定义对话流程、性格和逻辑；可使用设计系统组件模拟分支响应；可发布、下载代码或单向推送到由 Figma Make 创建的 GitHub 仓库。[方案页](https://www.figma.com/solutions/ai-chatbot-builder/)、[创建说明](https://help.figma.com/hc/en-us/articles/31304485164695-Create-and-edit-a-functional-prototype-or-web-app)、[发布说明](https://help.figma.com/hc/en-us/articles/31304586129559-Publish-update-or-unpublish-a-functional-prototype-or-web-app)、[代码下载说明](https://help.figma.com/hc/en-us/articles/35710574222487-Beyond-the-basics-Using-Figma-Make)、[GitHub 推送说明](https://help.figma.com/hc/en-us/articles/35463818346647-Push-from-Figma-Make-to-GitHub) | 是 Figma 官方工作流，不是 Community 文件，不能继承社区许可；闭源页面与自动引用素材不复用，遵守 [条款](https://www.figma.com/legal/tos/) |
| Replit Agent | 从文字需求生成并部署应用；自动配置环境、依赖和执行；提供检查点、调试和 AI 集成。[产品页](https://replit.com/products/agent)、[官方介绍](https://replit.com/blog/introducing-replit-agent)、[文档](https://docs.replit.com/learn/build-with-agent) | 服务闭源；公开 App、第三方内容、依赖和媒体权利分别审查，不因平台条款自动成为本站可售资产，遵守 [条款](https://replit.com/terms-of-service/) |
| Bolt.new | 浏览器内完成提示、代码、预览和公开 URL；默认支持常见 Web 技术；提供数据库、认证、文件、服务端函数、密钥和部署。[产品页](https://bolt.new/use-cases/ai-app-builder)、[入门](https://support.bolt.new/building/intro-bolt)、[数据库](https://support.bolt.new/cloud/database) | 服务为专有软件，商业权限与计划有关；用户内容、生成代码、依赖和素材分别核对，遵守 [StackBlitz 条款](https://stackblitz.com/terms-of-service) |

## 升级到 30 项公开内容前的门槛

1. 先完成首发 12 项，不因已有候选就跳过 MVP 验收。
2. 第二批逐项补独立身份、四项创业改造、完整商业潜力编辑判断、原创封面和获准使用的真实产品展示媒体。
3. PaddleOCR 记录 Gitee 镜像与 canonical GitHub；可灵记录多个发布/运营主体角色；Inspo Canvas 只记录已核验的 Lovable Labs Incorporated。
4. OpenHands 未确认官方注册地区前不升级；豆包爱学没有稳定独立入口前不包装成独立产品。
5. 模板与平台工作流在卡片和详情中明确显示 `case_kind`，不与正式产品成熟度混淆。
6. 18 项全部重新核验链接、条款和时点事实后，才进入 `grow-catalog-to-100` 的 12→30 阶段 apply。
