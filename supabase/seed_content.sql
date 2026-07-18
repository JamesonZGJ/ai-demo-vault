insert into public.tools (slug, name, official_url)
values
  ('nextjs', 'Next.js', 'https://nextjs.org/'),
  ('replicate', 'Replicate', 'https://replicate.com/'),
  ('controlnet', 'ControlNet', 'https://github.com/lllyasviel/ControlNet'),
  ('gradio', 'Gradio', 'https://www.gradio.app/'),
  ('pytorch', 'PyTorch', 'https://pytorch.org/'),
  ('funasr', 'FunASR', 'https://github.com/modelscope/FunASR'),
  ('ffmpeg', 'FFmpeg', 'https://ffmpeg.org/'),
  ('docker', 'Docker', 'https://www.docker.com/'),
  ('fastapi', 'FastAPI', 'https://fastapi.tiangolo.com/'),
  ('libreoffice', 'LibreOffice', 'https://www.libreoffice.org/'),
  ('playwright', 'Playwright', 'https://playwright.dev/'),
  ('tiptap', 'Tiptap', 'https://tiptap.dev/'),
  ('qdrant', 'Qdrant', 'https://qdrant.tech/'),
  ('temporal', 'Temporal', 'https://temporal.io/'),
  ('postgresql', 'PostgreSQL', 'https://www.postgresql.org/'),
  ('phaser', 'Phaser', 'https://phaser.io/'),
  ('nodejs', 'Node.js', 'https://nodejs.org/'),
  ('vue', 'Vue.js', 'https://vuejs.org/'),
  ('langchain', 'LangChain', 'https://www.langchain.com/'),
  ('lancedb', 'LanceDB', 'https://lancedb.com/')
on conflict (slug) do update
set name = excluded.name,
    official_url = excluded.official_url;

do $seed$
declare
  item jsonb;
  publisher_item jsonb;
  link_item jsonb;
  claim_item jsonb;
  evidence_item jsonb;
  preview_item jsonb;
  demo_uuid uuid;
  tool_slug text;
  cover_rights_holder constant text := 'AI Demo Vault';
  cover_license_terms constant text := '仅授权 AI Demo Vault 用于本站案例目录的原创抽象封面展示；不作为第三方产品界面、商标或产品方授权素材。';
begin
  for item in
    select value
    from jsonb_array_elements(
      $catalog$
      [
        {
          "slug": "roomgpt",
          "name": "RoomGPT",
          "tagline": "上传一张房间照片，生成不同风格的改造效果",
          "summary": "RoomGPT 把房间照片与风格选择组合成一个清晰的 AI 装修闭环；本站将官方能力与可复刻的细分商业假设分开呈现。",
          "category": "interior-design",
          "case_kind": "product",
          "maturity": "production_product",
          "publisher_region": "international",
          "difficulty": "intermediate",
          "pain_points": "编辑推断：普通住户在装修前很难仅凭材料样板想象最终空间，设计师也需要低成本方案来加快早期沟通。",
          "solution": "上传房间照片并选择风格，由图像生成流程输出可直观看到的改造版本。",
          "why_it_works": "编辑推断：输入和结果都高度可视化，用户能在很短时间内判断方向，价值比通用文生图更容易理解。",
          "target_users": "编辑推断：租客、业主、软装设计师、房产经纪与装修获客团队。",
          "core_features": ["房间照片上传", "多风格选择", "原图与生成结果对比"],
          "ai_implementation": "官方开源版使用 ControlNet 约束空间结构，并通过 Replicate 调用图像生成模型。",
          "technical_implementation": "可复刻核心由 Next.js 上传界面、对象存储、异步模型调用、任务状态和结果页组成。",
          "monetization": "编辑推断：可按生成次数收费，或向设计工作室和房产团队提供月度席位与品牌化报告。",
          "truth_boundary": {"implemented": ["官方仓库提供可运行的房间改造流程", "商业站提供正式服务"], "simulated": [], "not_implemented": ["本站未验证其用户规模与收入", "本站未复现商业站的全部模型与队列"]},
          "adapt_change_who": "把个人住户改为房地产经纪、民宿运营者或办公空间顾问。",
          "adapt_change_what": "把住宅风格改造扩展为样板房布置、民宿翻新或门店陈列方案。",
          "adapt_change_context": "从个人一次性尝试改为企业获客、提案和成交前的可视化沟通。",
          "adapt_new_opportunity": "产品假设：为房产团队生成带品牌、预算区间和改造清单的售前方案包。",
          "primary_source": "https://github.com/Nutlope/roomGPT",
          "cover_path": "/media/covers/roomgpt-cover.png",
          "cover_alt": "RoomGPT 主题的本站原创抽象封面：空房间、材料板与布置完成的房间沿蓝色路径排列，非产品界面截图。",
          "cover_hash": "caca230d439f083b971e2afbd53fee7fa17629eefeb6646c63df0068f5f4ff50",
          "commercial_score": 4,
          "commercial_rationale": "高价值、强视觉的装修决策场景明确，个人按次和企业线索工具都有合理付费路径；但获客成本、生成一致性和图片权利会直接影响利润。",
          "commercial_evidence": "官方仓库展示完整输入输出流程，官网提供正式可用服务；不把官网自述的用户量当作本站验证结果。",
          "featured": true,
          "editor_rank": 1,
          "published_at": "2026-07-16T12:00:00Z",
          "publishers": [{"name": "Hassan El Mghari", "region": "international", "role": "developer", "evidence_url": "https://www.nutlope.com/"}],
          "links": [
            {"type": "online_demo", "label": "在线体验", "url": "https://www.roomgpt.io/", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/Nutlope/roomGPT", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库说明用户可上传房间照片并生成不同主题的改造结果。", "source_url": "https://github.com/Nutlope/roomGPT"},
            {"section": "ai_implementation", "type": "fact", "content": "官方开源版说明使用 ControlNet 与 Replicate。", "source_url": "https://github.com/Nutlope/roomGPT"},
            {"section": "why_it_works", "type": "editorial_inference", "content": "视觉前后对比缩短了用户理解价值的时间，但不等于商业结果已被验证。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可以把住宅消费者改为房产企业客户，并加入预算与提案交付。"}
          ],
          "evidence": [
            {"type": "open_source", "description": "官方仓库采用 MIT License。", "source_url": "https://github.com/Nutlope/roomGPT"},
            {"type": "commercial_service", "description": "官方提供可访问的 RoomGPT 产品站。", "source_url": "https://www.roomgpt.io/"}
          ],
          "tools": ["nextjs", "replicate", "controlnet"],
          "preview": {"role": "product_preview", "path": "/media/previews/roomgpt-preview.png", "media_type": "image", "alt": "RoomGPT 官方开源仓库中的界面截图，展示原始房间与 AI 改造房间的对比。", "rights_holder": "RoomGPT repository contributors", "license_terms": "MIT；仅按官方仓库许可用于案例说明，界面中的商标与底层图片权利仍归各自权利人。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/Nutlope/roomGPT/main/public/screenshot.png", "permission_basis": "官方仓库文件与根目录 MIT License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "c9ddfb8b911c5eed6c44905d1c7d64037a4cfdc4b24f11b405f1fbc45959dbee"}
        },
        {
          "slug": "cogvideo",
          "name": "CogVideoX",
          "tagline": "可自托管的文本、图片与视频生成实验界面",
          "summary": "CogVideoX 是开放的视频生成模型系列；首发案例只描述官方仓库可确认的推理与 Web Demo，不把研究模型包装成成熟 SaaS。",
          "category": "video-generation",
          "case_kind": "model_demo",
          "maturity": "working_demo",
          "publisher_region": "mainland_china",
          "difficulty": "advanced",
          "pain_points": "编辑推断：视频生成 API 成本高且可控性有限，研究团队和开发者需要能自行部署、测试和二次训练的基础模型。",
          "solution": "通过官方推理代码与 Gradio 界面，把提示词或参考素材转换为视频，并提供模型与训练工具。",
          "why_it_works": "编辑推断：开放模型让团队能够控制部署和实验，但 GPU、模型许可与输出审核成本很高。",
          "target_users": "编辑推断：视频 AI 研究团队、模型工程师、创意工具开发者。",
          "core_features": ["文本生成视频", "图片或视频条件输入", "本地推理与训练工具"],
          "ai_implementation": "官方仓库发布 CogVideoX 系列推理代码、模型接入和基于 Gradio 的实验界面。",
          "technical_implementation": "复刻真实闭环需要 GPU 推理服务、任务队列、文件存储、内容安全和可恢复的长任务状态。",
          "monetization": "编辑推断：更合理的方向是垂直视频工作流、托管推理或企业私有部署，而不是直接转售基础模型。",
          "truth_boundary": {"implemented": ["官方仓库提供推理和 Web Demo", "仓库包含真实界面截图"], "simulated": [], "not_implemented": ["本站未运行模型或验证所有权重许可", "截图明确标注学术研究与实验用途"]},
          "adapt_change_who": "从模型研究者改为电商短视频团队、教育内容团队或工业培训部门。",
          "adapt_change_what": "从通用视频生成改为固定镜头语言、固定品牌资产和批量审核的垂直模板。",
          "adapt_change_context": "从单次实验改为有队列、审核、版本和成本上限的生产工作流。",
          "adapt_new_opportunity": "产品假设：提供可审计的企业私有视频生成流水线，并按算力或任务量收费。",
          "primary_source": "https://github.com/zai-org/CogVideo",
          "cover_path": "/media/covers/wan22-cover.png",
          "cover_alt": "CogVideoX 主题的本站原创抽象封面：多组影像帧汇入相机镜头，非产品界面截图。",
          "cover_hash": "bf72eb3233e929e8fa73451f271c9be364c8cdee10a24da7ede56751466645f6",
          "commercial_score": 3,
          "commercial_rationale": "视频生成需求强，但基础模型部署昂贵且官方 Demo 标注研究用途；商业价值必须来自垂直流程、数据与交付，而不是模型名称本身。",
          "commercial_evidence": "官方仓库提供可运行推理与 Web Demo；没有把 GitHub stars 或模型评测换算成收入信号。",
          "featured": false,
          "editor_rank": 8,
          "published_at": "2026-07-16T11:00:00Z",
          "publishers": [{"name": "Z.ai / CogVideo 团队", "region": "mainland_china", "role": "developer", "evidence_url": "https://github.com/zai-org/CogVideo"}],
          "links": [{"type": "primary_source", "label": "官方仓库", "url": "https://github.com/zai-org/CogVideo", "platform": "GitHub", "canonical": true}],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库发布 CogVideoX 系列的视频生成代码、模型说明与实验界面。", "source_url": "https://github.com/zai-org/CogVideo"},
            {"section": "truth_boundary", "type": "fact", "content": "官方 Web Demo 截图明确写明用于学术研究和实验。", "source_url": "https://github.com/zai-org/CogVideo"},
            {"section": "monetization", "type": "editorial_inference", "content": "商业化应围绕托管推理或垂直工作流，而不是把开放模型本身当成护城河。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可缩窄为电商或培训视频的固定模板生产线。"}
          ],
          "evidence": [{"type": "open_source", "description": "官方代码仓库采用 Apache-2.0；模型权重需继续按具体模型卡核对。", "source_url": "https://github.com/zai-org/CogVideo"}],
          "tools": ["gradio", "pytorch"],
          "preview": {"role": "product_preview", "path": "/media/previews/cogvideo-preview.png", "media_type": "image", "alt": "CogVideoX 官方仓库中的 Web Demo 截图，左侧为生成参数，右侧为视频输出。", "rights_holder": "CogVideo repository contributors", "license_terms": "Apache-2.0；截图只证明官方实验界面，模型权重与生成内容仍按各自许可使用。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/zai-org/CogVideo/main/resources/web_demo.png", "permission_basis": "官方仓库文件与根目录 Apache-2.0 License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "b6695743c82aaebb46ba7822ec5b2c6f3114a7ffc51b0abea7ef4d58d54d0143"}
        },
        {
          "slug": "funclip",
          "name": "FunClip",
          "tagline": "先识别语音，再按文字或说话人完成视频剪辑",
          "summary": "FunClip 把语音识别、说话人区分、字幕与裁剪组合成可运行的本地视频工具，适合研究内容型视频的自动粗剪。",
          "category": "video-generation",
          "case_kind": "open_source_project",
          "maturity": "working_demo",
          "publisher_region": "mainland_china",
          "difficulty": "advanced",
          "pain_points": "编辑推断：口播、访谈和会议视频的粗剪大量依赖反复听写、定位和导出字幕。",
          "solution": "使用 FunASR 识别音视频，按文本片段或说话人选择需要保留的区间，再输出视频和字幕。",
          "why_it_works": "编辑推断：文字比时间轴更适合定位口播内容，可以显著减少粗剪阶段的机械操作。",
          "target_users": "编辑推断：播客团队、口播创作者、课程制作和企业会议内容团队。",
          "core_features": ["音视频语音识别", "文本或说话人选段", "视频裁剪与 SRT 输出"],
          "ai_implementation": "官方项目基于 FunASR 完成语音识别，并可结合大模型从字幕中选择片段。",
          "technical_implementation": "真实产品需要上传与转码、ASR、说话人区分、字幕时间轴、FFmpeg 裁剪和失败重试。",
          "monetization": "编辑推断：可按视频时长收费，或针对播客、课程与企业内容提供团队订阅。",
          "truth_boundary": {"implemented": ["官方仓库提供本地 Gradio 界面", "支持识别、字幕和裁剪"], "simulated": [], "not_implemented": ["本站未验证所有可选模型与第三方 API", "没有公开收入或留存证据"]},
          "adapt_change_who": "从通用创作者改为销售培训、客服质检或访谈研究团队。",
          "adapt_change_what": "从精彩片段改为异议、风险词、关键决策或客户声音的结构化片段。",
          "adapt_change_context": "从单条视频粗剪改为批量归档、审核和知识沉淀。",
          "adapt_new_opportunity": "产品假设：做面向企业访谈和会议的视频证据提炼工具。",
          "primary_source": "https://github.com/modelscope/FunClip",
          "cover_path": "/media/covers/funclip-cover.png",
          "cover_alt": "FunClip 主题的本站原创抽象封面：胶片帧、音频波形与剪辑时间线，非产品界面截图。",
          "cover_hash": "4768599a4209fc7cae8fc8eb707f62c80609e581f3eb729482d8d98df6aa570e",
          "commercial_score": 3,
          "commercial_rationale": "粗剪痛点高频且价值清晰，但通用剪辑竞争强；只有把识别结果接入明确行业流程，付费理由才足够稳定。",
          "commercial_evidence": "官方仓库证明完整技术闭环；未发现可核验公开定价，分数不依赖 stars。",
          "featured": true,
          "editor_rank": 5,
          "published_at": "2026-07-16T10:00:00Z",
          "publishers": [{"name": "ModelScope / 通义实验室", "region": "mainland_china", "role": "developer", "evidence_url": "https://github.com/modelscope/FunClip"}],
          "links": [
            {"type": "online_demo", "label": "Hugging Face 体验", "url": "https://huggingface.co/spaces/R1ckShi/FunClip", "platform": "Hugging Face", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/modelscope/FunClip", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库将 FunClip 定义为集成 FunASR 的开源本地视频剪辑工具，支持识别后按文本或说话人裁剪。", "source_url": "https://github.com/modelscope/FunClip"},
            {"section": "core_features", "type": "fact", "content": "官方仓库说明可以按文本片段或说话人剪辑并输出 SRT。", "source_url": "https://github.com/modelscope/FunClip"},
            {"section": "ai_implementation", "type": "fact", "content": "项目使用 FunASR 识别音视频语音，并提供本地 Gradio 界面。", "source_url": "https://github.com/modelscope/FunClip"},
            {"section": "why_it_works", "type": "editorial_inference", "content": "文字选段降低了口播粗剪的定位成本，但精剪仍需要人工判断。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可改造成企业访谈或销售通话的视频证据提炼工具。"}
          ],
          "evidence": [{"type": "open_source", "description": "官方仓库采用 MIT License。", "source_url": "https://github.com/modelscope/FunClip"}],
          "tools": ["funasr", "gradio", "ffmpeg"],
          "preview": {"role": "product_preview", "path": "/media/previews/funclip-preview.jpg", "media_type": "image", "alt": "FunClip 官方仓库中的界面截图，展示视频识别、文本选段与裁剪结果。", "rights_holder": "FunClip repository contributors", "license_terms": "MIT；仅按官方仓库许可用于产品流程说明。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/modelscope/FunClip/main/docs/images/interface.jpg", "permission_basis": "官方仓库文件与根目录 MIT License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "35855be22612faa4e6ed8900a1dea33d793b33e7b1c2a32a768718d806c6ff69"}
        },
        {
          "slug": "presenton",
          "name": "Presenton",
          "tagline": "自托管或桌面运行的 AI 演示文稿生成器",
          "summary": "Presenton 将提示词、文档、模板和多种模型接入组合成可编辑 PPTX/PDF 输出，并同时提供开源、自托管和云端路径。",
          "category": "presentation",
          "case_kind": "product",
          "maturity": "production_product",
          "publisher_region": "international",
          "difficulty": "intermediate",
          "pain_points": "编辑推断：演示文稿制作既需要内容结构，也需要视觉模板和可继续编辑的文件，单纯生成图片无法交付。",
          "solution": "从提示词或上传文档生成演示文稿，允许使用自有模板与模型，并导出可编辑 PPTX 或 PDF。",
          "why_it_works": "编辑推断：可编辑文件和自托管能力直接解决团队交付、隐私与供应商锁定问题。",
          "target_users": "编辑推断：咨询顾问、销售、运营、教师与需要私有部署的企业团队。",
          "core_features": ["提示词或文档生成", "自有模板与多模型接入", "PPTX 与 PDF 导出"],
          "ai_implementation": "官方项目支持多种云端和本地大模型，并把内容生成、模板和图片提供商组合成演示文稿。",
          "technical_implementation": "核心由 Next.js 前端、FastAPI 服务、模型适配层、模板渲染、文件转换和持久化组成。",
          "monetization": "编辑推断：可销售云端订阅、企业私有部署、模板市场和 API 用量。",
          "truth_boundary": {"implemented": ["官方提供开源代码、自托管和桌面端", "支持可编辑 PPTX 与 PDF"], "simulated": [], "not_implemented": ["本站未验证所有模型提供商", "第三方模型和图库费用不包含在开源许可内"]},
          "adapt_change_who": "从所有做 PPT 的用户缩窄为投标、销售方案或财务汇报团队。",
          "adapt_change_what": "从通用演示改为读取企业数据与固定品牌模板的强约束输出。",
          "adapt_change_context": "从个人单次生成改为审批、复用、版本管理和批量更新。",
          "adapt_new_opportunity": "产品假设：做面向某一行业的品牌合规提案生成器。",
          "primary_source": "https://github.com/presenton/presenton",
          "cover_path": "/media/covers/presenton-cover.png",
          "cover_alt": "Presenton 主题的本站原创抽象封面：层叠演示页与拆分的内容模块，非产品界面截图。",
          "cover_hash": "8d937d9682c1dadc7e1db267bc529ddb3a2b070e5a3a1aa60e063e43a1b4725f",
          "commercial_score": 4,
          "commercial_rationale": "演示文稿是高频企业任务，可编辑交付和私有部署带来明确付费理由；竞争激烈，差异化应来自行业数据与模板。",
          "commercial_evidence": "官方仓库同时提供自托管、桌面、云端和 API 路径，官方条款确认商业服务主体。",
          "featured": false,
          "editor_rank": 4,
          "published_at": "2026-07-16T09:00:00Z",
          "publishers": [{"name": "Presenton Inc.", "region": "international", "role": "service_operator", "evidence_url": "https://presenton.ai/terms-and-conditions"}],
          "links": [
            {"type": "online_demo", "label": "Presenton 官网", "url": "https://presenton.ai/", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/presenton/presenton", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库说明 Presenton 可从提示词或文档生成演示文稿，并导出可编辑 PPTX 与 PDF。", "source_url": "https://github.com/presenton/presenton"},
            {"section": "core_features", "type": "fact", "content": "官方仓库说明支持自托管、桌面端、多模型接入以及可编辑 PPTX/PDF 导出。", "source_url": "https://github.com/presenton/presenton"},
            {"section": "technical_implementation", "type": "fact", "content": "官方仓库提供 Docker、自托管 API 与桌面应用。", "source_url": "https://github.com/presenton/presenton"},
            {"section": "monetization", "type": "editorial_inference", "content": "私有部署、品牌模板与 API 比通用生成更容易形成企业付费。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可缩窄为投标或销售方案的行业模板产品。"}
          ],
          "evidence": [
            {"type": "open_source", "description": "官方仓库采用 Apache-2.0 License。", "source_url": "https://github.com/presenton/presenton"},
            {"type": "commercial_service", "description": "官方提供云端产品与服务条款。", "source_url": "https://presenton.ai/terms-and-conditions"}
          ],
          "tools": ["nextjs", "fastapi", "docker", "libreoffice"],
          "preview": {"role": "product_preview", "path": "/media/previews/presenton-banner.png", "media_type": "image", "alt": "Presenton 官方仓库中的产品图，展示跨平台演示文稿编辑界面。", "rights_holder": "Presenton repository contributors", "license_terms": "Apache-2.0；仅按官方仓库许可用于产品界面说明，第三方平台标识归各自权利人。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/presenton/presenton/main/readme_assets/images/banner.png", "permission_basis": "官方仓库文件与根目录 Apache-2.0 License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "6a3937c8b65d837699018fa7a93c50d165cc44cdf9416540420fa79d6f9bcaf3"}
        },
        {
          "slug": "pptagent",
          "name": "PPTAgent / DeepPresenter",
          "tagline": "先研究与规划，再反思迭代生成可编辑演示文稿",
          "summary": "PPTAgent 是面向演示文稿生成与评估的开源智能体框架；它更像研究型生产系统，而不是开箱即用的消费级 SaaS。",
          "category": "presentation",
          "case_kind": "open_source_project",
          "maturity": "working_demo",
          "publisher_region": "mainland_china",
          "difficulty": "advanced",
          "pain_points": "编辑推断：一次性把文本塞进幻灯片容易出现结构、视觉和连贯性同时失控。",
          "solution": "先分析参考演示的功能类型与内容结构，再生成大纲、编辑动作和可评估的幻灯片结果。",
          "why_it_works": "编辑推断：把演示文稿拆成研究、规划、生成、渲染和反思步骤，比单轮提示更可控。",
          "target_users": "编辑推断：AI 演示文稿研究者、需要深度报告的分析团队与自建生成服务的工程团队。",
          "core_features": ["文档与附件生成", "研究和反思智能体", "PPTX 导出与评估"],
          "ai_implementation": "官方框架使用多阶段智能体、沙箱工具和演示文稿评估来生成并修订结果。",
          "technical_implementation": "真实部署需要模型、浏览器渲染、文档解析、隔离沙箱、Office 转换和可追踪的任务执行。",
          "monetization": "编辑推断：可面向研究报告、咨询交付或企业私有部署收费；通用个人订阅竞争优势有限。",
          "truth_boundary": {"implemented": ["官方发布代码、CLI、Web UI 和生成样例", "支持 PPTX 输出"], "simulated": [], "not_implemented": ["Windows 原生环境不在官方支持范围", "本站未复现其完整模型与沙箱栈"]},
          "adapt_change_who": "从通用用户改为研究、咨询或政策分析团队。",
          "adapt_change_what": "从自由主题改为有固定证据来源、引用和审批规则的报告型演示。",
          "adapt_change_context": "从单次生成改为资料更新后自动重建并等待审阅。",
          "adapt_new_opportunity": "产品假设：做可追溯引用的行业研究演示生成器。",
          "primary_source": "https://github.com/icip-cas/PPTAgent",
          "cover_path": "/media/covers/gamma-cover.png",
          "cover_alt": "PPTAgent 主题的本站原创抽象封面：由图表、图像与内容卡片组成的演示文稿画布，非产品界面截图。",
          "cover_hash": "a1b8dababbe30be6b0cbb89e0507032da860e5da6fe4ee5e50276bda5d5204be",
          "commercial_score": 3,
          "commercial_rationale": "复杂报告和咨询交付有高价值，但部署与质量控制成本高，且官方项目当前更偏研究与自建。",
          "commercial_evidence": "官方仓库提供 CLI、Web UI、PPTX 输出与研究论文；未发现公开商业定价。",
          "featured": false,
          "editor_rank": 9,
          "published_at": "2026-07-16T08:00:00Z",
          "publishers": [{"name": "中国科学院计算技术研究所 ICIP 团队", "region": "mainland_china", "role": "developer", "evidence_url": "https://www.ict.ac.cn/jssgk/"}],
          "links": [{"type": "primary_source", "label": "官方仓库", "url": "https://github.com/icip-cas/PPTAgent", "platform": "GitHub", "canonical": true}],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库提供 CLI、Web UI、Docker 路径与可编辑 PPTX 输出。", "source_url": "https://github.com/icip-cas/PPTAgent"},
            {"section": "ai_implementation", "type": "fact", "content": "官方论文与仓库说明采用分析参考演示、生成大纲和迭代编辑的多阶段方法。", "source_url": "https://github.com/icip-cas/PPTAgent"},
            {"section": "why_it_works", "type": "editorial_inference", "content": "多阶段反思提升可控性，但也增加部署、推理和验证成本。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可以缩窄为带引用和审批规则的行业研究演示。"}
          ],
          "evidence": [{"type": "open_source", "description": "官方仓库采用 MIT License。", "source_url": "https://github.com/icip-cas/PPTAgent"}],
          "tools": ["playwright", "libreoffice", "docker"],
          "preview": {"role": "product_preview", "path": "/media/previews/pptagent-candidate-1.jpg", "media_type": "image", "alt": "PPTAgent 官方仓库中的生成结果示例：一页关于立法过程的演示文稿封面。", "rights_holder": "PPTAgent repository contributors", "license_terms": "MIT；仅将仓库内生成结果作为案例说明，不授予其中底图或第三方元素的独立使用权。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/icip-cas/PPTAgent/main/resource/v2/presentation2/0001.jpg", "permission_basis": "官方仓库文件与根目录 MIT License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "61c77490dc8f0aabb309e9fa005464a95debc20d1ce3b5c7146adf2c92789b0a"}
        },
        {
          "slug": "novel",
          "name": "Novel",
          "tagline": "Notion 风格编辑器里的 AI 续写起点",
          "summary": "Novel 是一个开源的富文本编辑器示例，把 Tiptap 编辑体验与 AI 自动续写组合在一起，适合拆解最小写作助手闭环。",
          "category": "writing",
          "case_kind": "open_source_project",
          "maturity": "working_demo",
          "publisher_region": "international",
          "difficulty": "intermediate",
          "pain_points": "编辑推断：写作者在空白页、段落过渡和改写时容易中断，而普通聊天框又脱离正文上下文。",
          "solution": "把 AI 续写直接放进富文本编辑器，让生成结果出现在当前文档和光标位置。",
          "why_it_works": "编辑推断：AI 位于写作界面内部，用户不必在聊天与文档之间复制粘贴。",
          "target_users": "编辑推断：博客作者、内容团队和需要嵌入式写作能力的 SaaS 开发者。",
          "core_features": ["富文本编辑", "AI 自动续写", "可复用开源组件"],
          "ai_implementation": "官方仓库将编辑器上下文发送给大模型，并把流式结果插回 Tiptap 文档。",
          "technical_implementation": "核心由 Next.js、Tiptap、流式模型接口、限流与文档存储组成。",
          "monetization": "编辑推断：单独续写功能同质化严重，更适合作为垂直内容产品的一个功能，而不是独立高价订阅。",
          "truth_boundary": {"implemented": ["官方仓库提供可运行编辑器与 AI 续写"], "simulated": [], "not_implemented": ["不是完整内容运营系统", "没有公开商业验证"]},
          "adapt_change_who": "从通用写作者改为法律、招聘、电商或技术文档团队。",
          "adapt_change_what": "从自由续写改为遵守字段、品牌语气和事实来源的结构化内容。",
          "adapt_change_context": "从个人编辑器改为多人审批与内容资产复用。",
          "adapt_new_opportunity": "产品假设：把编辑器变成特定行业的合规写作工作台。",
          "primary_source": "https://github.com/steven-tey/novel",
          "cover_path": "/media/covers/novel-cover.png",
          "cover_alt": "Novel 主题的本站原创抽象封面：卷纸文稿、文本线条与编辑光标，非产品界面截图。",
          "cover_hash": "4e9b886680cc77e9096d7a7b0514491141cf7f2e76c79b6745c4d925bf784fa0",
          "commercial_score": 2,
          "commercial_rationale": "写作需求高频，但基础续写已成为通用能力；没有行业数据、流程或分发闭环时，独立付费和差异化都偏弱。",
          "commercial_evidence": "官方仓库证明技术闭环，但没有公开商业服务或定价证据。",
          "featured": false,
          "editor_rank": 12,
          "published_at": "2026-07-16T07:00:00Z",
          "publishers": [{"name": "Steven Tey", "region": "international", "role": "developer", "evidence_url": "https://github.com/steven-tey"}],
          "links": [
            {"type": "online_demo", "label": "在线体验", "url": "https://novel.sh/", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/steven-tey/novel", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库将 Novel 定义为带 AI 自动续写能力的开源 Notion 风格 WYSIWYG 编辑器。", "source_url": "https://github.com/steven-tey/novel"},
            {"section": "core_features", "type": "fact", "content": "官方仓库把 Novel 定义为带 AI 自动续写的 Notion 风格 WYSIWYG 编辑器。", "source_url": "https://github.com/steven-tey/novel"},
            {"section": "technical_implementation", "type": "fact", "content": "官方仓库使用 Next.js、Tiptap 与大模型接口。", "source_url": "https://github.com/steven-tey/novel"},
            {"section": "monetization", "type": "editorial_inference", "content": "通用续写难以独立收费，行业工作流比模型调用更重要。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可加入行业字段和审批规则，变成合规写作工作台。"}
          ],
          "evidence": [{"type": "open_source", "description": "官方仓库采用 Apache-2.0 License。", "source_url": "https://github.com/steven-tey/novel"}],
          "tools": ["nextjs", "tiptap"],
          "preview": {"role": "product_preview", "path": "/media/previews/novel-preview.png", "media_type": "image", "alt": "Novel 官方仓库中的编辑器界面，展示 AI 续写菜单。", "rights_holder": "Novel repository contributors", "license_terms": "Apache-2.0；仅按官方仓库许可用于产品界面说明。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/steven-tey/novel/main/apps/web/app/opengraph-image.png", "permission_basis": "官方仓库文件与根目录 Apache-2.0 License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "b015e2e2e2d25df35c2fad2623551d06519fc844932ac5f905dd87cd886df329"}
        },
        {
          "slug": "open-notebook",
          "name": "Open Notebook",
          "tagline": "自托管的资料、笔记、带引用问答与播客工作台",
          "summary": "Open Notebook 是 NotebookLM 的开放替代方案，把来源管理、AI 笔记、带引用问答和音频内容放进一个可自托管工作区。",
          "category": "learning",
          "case_kind": "open_source_project",
          "maturity": "production_product",
          "publisher_region": "international",
          "difficulty": "advanced",
          "pain_points": "编辑推断：学习与研究资料分散在网页、文档和音视频里，用户难以持续保留来源和上下文。",
          "solution": "把多种来源放进笔记本，生成笔记并基于资料问答，同时保留引用和会话。",
          "why_it_works": "编辑推断：资料、笔记和问答共用同一上下文，降低了重复整理与来源丢失。",
          "target_users": "编辑推断：研究者、学生、顾问、内容策划和重视私有部署的知识团队。",
          "core_features": ["多来源笔记本", "带引用资料问答", "AI 笔记与播客生成"],
          "ai_implementation": "官方项目组合内容提取、向量检索、大模型和语音生成，为笔记本提供问答与衍生内容。",
          "technical_implementation": "真实部署需要文档解析、对象存储、向量数据库、异步任务、模型提供商与引用追踪。",
          "monetization": "编辑推断：可按个人云托管、团队知识空间、私有部署和高成本音频任务收费。",
          "truth_boundary": {"implemented": ["官方仓库提供可自托管应用", "界面展示来源、笔记和带引用问答"], "simulated": [], "not_implemented": ["本站未验证所有模型与媒体格式", "没有把开源采用量当作付费验证"]},
          "adapt_change_who": "从个人学习者改为咨询、投研、法务或售前团队。",
          "adapt_change_what": "从通用资料问答改为固定证据模板、结论审阅和团队知识交付。",
          "adapt_change_context": "从个人笔记本改为有权限、版本和复核记录的企业知识空间。",
          "adapt_new_opportunity": "产品假设：为高证据要求行业提供可追溯的项目研究室。",
          "primary_source": "https://github.com/lfnovo/open-notebook",
          "cover_path": "/media/covers/notebooklm-cover.png",
          "cover_alt": "Open Notebook 主题的本站原创抽象封面：打开的研究笔记本、资料卡片与知识节点，非产品界面截图。",
          "cover_hash": "62f28626a9ccaf79e63ab33075fd908d5840cb3c371bf6b54f5657f127669509",
          "commercial_score": 3,
          "commercial_rationale": "研究与知识管理是持续需求，自托管和引用提高付费理由；但模型成本、解析质量和成熟竞品会压缩通用产品空间。",
          "commercial_evidence": "官方仓库提供完整自托管产品和多种知识工作流；未发现稳定公开定价，因此保持中等判断。",
          "featured": true,
          "editor_rank": 3,
          "published_at": "2026-07-16T06:00:00Z",
          "publishers": [{"name": "Luis Novo", "region": "international", "role": "developer", "evidence_url": "https://github.com/lfnovo"}],
          "links": [{"type": "primary_source", "label": "官方仓库", "url": "https://github.com/lfnovo/open-notebook", "platform": "GitHub", "canonical": true}],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库将项目定义为更灵活的开源 NotebookLM 替代方案。", "source_url": "https://github.com/lfnovo/open-notebook"},
            {"section": "core_features", "type": "fact", "content": "官方界面展示来源、AI 笔记、笔记本问答和引用。", "source_url": "https://github.com/lfnovo/open-notebook"},
            {"section": "why_it_works", "type": "editorial_inference", "content": "引用和自托管提高可信度与控制力，但答案质量仍依赖解析和模型。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可改造成有审批和证据模板的企业项目研究室。"}
          ],
          "evidence": [{"type": "open_source", "description": "官方仓库采用 MIT License。", "source_url": "https://github.com/lfnovo/open-notebook"}],
          "tools": ["qdrant", "fastapi"],
          "preview": {"role": "product_preview", "path": "/media/previews/open-notebook-preview.png", "media_type": "image", "alt": "Open Notebook 官方仓库中的笔记本界面，展示来源、AI 笔记与带引用问答。", "rights_holder": "Open Notebook repository contributors", "license_terms": "MIT；仅按官方仓库许可用于产品界面说明。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/lfnovo/open-notebook/main/docs/assets/asset_list.png", "permission_basis": "官方仓库文件与根目录 MIT License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "b55a7aeb82add2196d853d7b9c76ed9e95cf419a62c02533dbc6054ee2e8264f"}
        },
        {
          "slug": "postiz",
          "name": "Postiz",
          "tagline": "带 AI 辅助、排期、发布与分析的社交内容工作台",
          "summary": "Postiz 是可自托管的社交媒体排期产品，覆盖内容生成、日历、发布、团队协作和分析，并提供正式托管服务。",
          "category": "marketing",
          "case_kind": "product",
          "maturity": "production_product",
          "publisher_region": "international",
          "difficulty": "advanced",
          "pain_points": "编辑推断：跨平台内容团队需要在多个账号、格式、审批和发布时间之间反复切换。",
          "solution": "在统一工作区使用 AI 辅助创作内容，安排日历并通过官方平台接口发布和查看分析。",
          "why_it_works": "编辑推断：价值不只来自生成文案，而是把生成、审批、排期、发布和复盘连成持续工作流。",
          "target_users": "编辑推断：创作者、营销团队、代理机构与经营多个品牌账号的企业。",
          "core_features": ["AI 辅助内容生成", "多平台排期与发布", "团队协作与分析"],
          "ai_implementation": "官方产品在内容编排环节提供 AI 文本与素材辅助，并通过平台 API 完成后续工作流。",
          "technical_implementation": "真实复刻需要账号与团队权限、OAuth、平台 API、媒体存储、定时任务、失败重试和审计。",
          "monetization": "官方提供按月托管计划；编辑推断还可面向代理商提供多客户空间和私有部署服务。",
          "truth_boundary": {"implemented": ["官方提供托管产品和自托管仓库", "支持排期、分析、协作与 AI 辅助"], "simulated": [], "not_implemented": ["第三方平台能力受各自 API 与审核影响", "本站未验证官方自述的下载或流量数字"]},
          "adapt_change_who": "从所有营销人员改为本地门店、跨境卖家或某一垂直代理商。",
          "adapt_change_what": "从通用发帖改为读取商品、门店活动或行业素材后生成合规内容。",
          "adapt_change_context": "从单品牌排期改为多客户审批、素材复用和效果复盘。",
          "adapt_new_opportunity": "产品假设：做某一行业的内容运营操作系统，而不是再做一个通用写作框。",
          "primary_source": "https://github.com/gitroomhq/postiz-app",
          "cover_path": "/media/covers/jasper-cover.png",
          "cover_alt": "Postiz 主题的本站原创抽象封面：中心品牌素材向网页与移动内容卡片分发，非产品界面截图。",
          "cover_hash": "c5efb286f8975e5f73481aebcb286b25e3bbd50d0a5ac97ea1dfe33ba3ead627",
          "commercial_score": 4,
          "commercial_rationale": "内容排期与发布是持续高频任务，官方已有公开定价和托管服务；主要风险来自平台 API 变化、合规和激烈竞争。",
          "commercial_evidence": "官方价格页和条款证明真实订阅服务，条款明确香港与美国两家运营主体。",
          "featured": true,
          "editor_rank": 2,
          "published_at": "2026-07-16T05:00:00Z",
          "publishers": [
            {"name": "Gitroom Limited", "region": "international", "role": "contracting_entity", "evidence_url": "https://postiz.com/terms-of-service"},
            {"name": "Gitroom LLC", "region": "international", "role": "service_operator", "evidence_url": "https://postiz.com/terms-of-service"}
          ],
          "links": [
            {"type": "online_demo", "label": "Postiz 官网", "url": "https://postiz.com/", "platform": "官网", "canonical": false},
            {"type": "pricing", "label": "公开价格", "url": "https://postiz.com/pricing", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/gitroomhq/postiz-app", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库将 Postiz 定义为支持排期、发布、团队协作、分析与 AI 内容辅助的开源社交媒体工具。", "source_url": "https://github.com/gitroomhq/postiz-app"},
            {"section": "core_features", "type": "fact", "content": "官方仓库和条款说明产品包含排期、发布、分析、团队协作与 AI 辅助内容生成。", "source_url": "https://postiz.com/terms-of-service"},
            {"section": "monetization", "type": "fact", "content": "官方提供按月订阅价格并由 Gitroom Limited 收取订阅收入。", "source_url": "https://postiz.com/pricing"},
            {"section": "why_it_works", "type": "editorial_inference", "content": "真正的留存来自跨平台运营闭环，不是单次生成文案。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可缩窄为本地门店或跨境卖家的行业运营系统。"}
          ],
          "evidence": [
            {"type": "open_source", "description": "官方仓库采用 AGPL-3.0 License。", "source_url": "https://github.com/gitroomhq/postiz-app"},
            {"type": "public_pricing", "description": "官方公开托管订阅价格。", "source_url": "https://postiz.com/pricing"},
            {"type": "commercial_service", "description": "官方条款明确两家运营主体与正式服务。", "source_url": "https://postiz.com/terms-of-service"}
          ],
          "tools": ["nextjs", "temporal", "postgresql"],
          "preview": {"role": "product_preview", "path": "/media/previews/postiz-preview.png", "media_type": "image", "alt": "Postiz 官方仓库中的产品图，展示内容日历与分析看板。", "rights_holder": "Postiz repository contributors", "license_terms": "AGPL-3.0；仅按官方仓库许可用于界面说明，第三方社交平台商标归各自权利人。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/gitroomhq/postiz-app/main/.github/assets/screen-002.png", "permission_basis": "官方仓库文件与根目录 AGPL-3.0 License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "400f4f96868c0f1e6fc8c2ac5203bd4bcf94f373e238a091d29311e1ed6925f7"}
        },
        {
          "slug": "opengame",
          "name": "OpenGame",
          "tagline": "从一句游戏描述到可运行 Web 游戏的智能体框架",
          "summary": "OpenGame 让智能体规划、写代码、生成素材、运行并检查 Web 游戏；首发只展示官方仓库中的原创猫咪塔防案例，不使用影视游戏角色演示。",
          "category": "game-generation",
          "case_kind": "open_source_project",
          "maturity": "working_demo",
          "publisher_region": "international",
          "difficulty": "advanced",
          "pain_points": "编辑推断：游戏生成不只是写一段代码，还要保证跨文件结构、资源、场景、交互和可玩性共同成立。",
          "solution": "使用模板与调试技能让智能体搭建项目、生成资源、运行游戏并根据可视结果修复问题。",
          "why_it_works": "编辑推断：把运行和视觉检查放进循环，比只生成静态代码更接近真正可玩的结果。",
          "target_users": "编辑推断：独立游戏原型团队、游戏教育、互动营销和 AI 编程研究者。",
          "core_features": ["自然语言生成 Web 游戏", "模板与调试技能", "运行与可玩性验证"],
          "ai_implementation": "官方框架使用 Game Skill、专用代码模型和浏览器执行评估，将生成与调试组成循环。",
          "technical_implementation": "复刻需要代码智能体、隔离文件系统、浏览器运行、截图判断、资源生成、构建日志和安全审批。",
          "monetization": "编辑推断：更适合按原型项目、品牌互动游戏或团队开发工具收费，直接生成大型商业游戏仍不现实。",
          "truth_boundary": {"implemented": ["官方仓库提供生成框架和可玩演示", "猫咪塔防示例为官方生成结果"], "simulated": [], "not_implemented": ["评测管线部分仍标注待发布", "本站未验证 150 类游戏或生产级多人状态"]},
          "adapt_change_who": "从游戏开发者改为品牌营销、教育培训或展会互动团队。",
          "adapt_change_what": "从自由游戏描述改为固定时长、品牌资产和数据采集的轻互动模板。",
          "adapt_change_context": "从一次性生成改为活动上线前的审阅、测试和版本交付。",
          "adapt_new_opportunity": "产品假设：提供品牌活动的轻量互动游戏原型工厂。",
          "primary_source": "https://github.com/leigest519/OpenGame",
          "cover_path": "/media/covers/rosebud-ai-cover.png",
          "cover_alt": "OpenGame 主题的本站原创抽象封面：文本输入卡片转化为方块构成的游戏场景与蓝色传送门，非产品界面截图。",
          "cover_hash": "00daf6c8c4a0af0194be7c403912dfee4d1e8712956a8d86db4059a6af58f483",
          "commercial_score": 2,
          "commercial_rationale": "创新性很强，但项目很新、资源成本高、可玩性和 IP 风险难以规模化；短期更适合原型服务而非稳定 SaaS。",
          "commercial_evidence": "官方仓库证明端到端可玩演示，但没有公开定价或成熟商业服务证据。",
          "featured": false,
          "editor_rank": 10,
          "published_at": "2026-07-16T04:00:00Z",
          "publishers": [{"name": "CUHK MMLab OpenGame 团队", "region": "international", "role": "developer", "evidence_url": "https://mmlab.ie.cuhk.edu.hk/index.html"}],
          "links": [
            {"type": "online_demo", "label": "官方演示页", "url": "https://www.opengame-project-page.com/", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/leigest519/OpenGame", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库将 OpenGame 定义为从提示词端到端创建 Web 游戏的开源智能体框架。", "source_url": "https://github.com/leigest519/OpenGame"},
            {"section": "truth_boundary", "type": "fact", "content": "官方仓库说明 OpenGame-Bench 评测管线仍将后续发布。", "source_url": "https://github.com/leigest519/OpenGame"},
            {"section": "monetization", "type": "editorial_inference", "content": "当前更适合原型交付，不应包装成可稳定生成大型商业游戏。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可缩窄为品牌或培训使用的轻互动模板工厂。"}
          ],
          "evidence": [{"type": "open_source", "description": "官方仓库采用 Apache-2.0 License。", "source_url": "https://github.com/leigest519/OpenGame"}],
          "tools": ["phaser", "playwright", "nodejs"],
          "preview": {"role": "product_preview", "path": "/media/previews/opengame-preview.png", "media_type": "image", "alt": "OpenGame 官方仓库中的原创猫咪塔防生成游戏封面。", "rights_holder": "OpenGame repository contributors", "license_terms": "Apache-2.0；只使用官方仓库内不含已知影视游戏角色的原创猫咪演示海报。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/leigest519/OpenGame/main/assets/posters/hajimi.png", "permission_basis": "官方仓库文件与根目录 Apache-2.0 License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "33bf06ff8e2bdd8742d2fda0b254949e61c36b167adce07600a4c34cbf2d1e15"}
        },
        {
          "slug": "restorephotos",
          "name": "RestorePhotos",
          "tagline": "上传旧照片，对模糊人脸进行 AI 修复",
          "summary": "RestorePhotos 用一个极短的上传—修复—对比闭环展示人脸修复价值，适合分析单功能 AI 工具如何快速验证需求。",
          "category": "image-processing",
          "case_kind": "product",
          "maturity": "production_product",
          "publisher_region": "international",
          "difficulty": "intermediate",
          "pain_points": "编辑推断：家庭旧照片中的人脸模糊、压缩或受损，普通用户缺少专业修图能力。",
          "solution": "上传照片，通过 GFPGAN 修复人脸并提供原图与结果对比和下载。",
          "why_it_works": "编辑推断：前后差异明确，用户无需理解模型即可判断结果是否值得保存。",
          "target_users": "编辑推断：家庭用户、照片数字化服务、摄影修复工作室与家谱项目。",
          "core_features": ["照片上传", "人脸 AI 修复", "前后对比与下载"],
          "ai_implementation": "官方仓库通过 Replicate 调用 GFPGAN 完成人脸修复。",
          "technical_implementation": "核心由 Next.js 上传页、对象存储、模型调用、结果轮询和下载组成。",
          "monetization": "编辑推断：可按张收费、售卖批量修复包，或为照片扫描门店提供白标工具。",
          "truth_boundary": {"implemented": ["官方仓库和产品站提供完整修复流程"], "simulated": [], "not_implemented": ["本站未核验全部人像授权", "修复结果可能生成并不存在的面部细节"]},
          "adapt_change_who": "从家庭用户改为扫描门店、纪念馆或档案数字化团队。",
          "adapt_change_what": "从单张人脸修复改为批量质检、人工复核和来源记录。",
          "adapt_change_context": "从个人下载改为订单式交付和客户确认。",
          "adapt_new_opportunity": "产品假设：为本地照片扫描商家提供批量修复与客户交付后台。",
          "primary_source": "https://github.com/Nutlope/restorePhotos",
          "cover_path": "/media/covers/restorephotos-cover.png",
          "cover_alt": "RestorePhotos 主题的本站原创抽象封面：一张旧肖像沿蓝线由破损状态变得清晰，非产品界面截图。",
          "cover_hash": "a80550590b543aaca974e8bec220b216642537298c8128e56f1de1d5dd102f00",
          "commercial_score": 3,
          "commercial_rationale": "价值直观且可按次收费，但个人使用频率低；批量修复和线下服务结合后更可能形成稳定收入。",
          "commercial_evidence": "官方仓库与产品站证明可用闭环，没有公开稳定订阅或企业收入证据。",
          "featured": false,
          "editor_rank": 7,
          "published_at": "2026-07-16T03:00:00Z",
          "publishers": [{"name": "Hassan El Mghari", "region": "international", "role": "developer", "evidence_url": "https://www.nutlope.com/"}],
          "links": [
            {"type": "online_demo", "label": "在线体验", "url": "https://www.restorephotos.io/", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/Nutlope/restorePhotos", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库展示一款上传旧照片后修复人脸并对比下载结果的开源应用。", "source_url": "https://github.com/Nutlope/restorePhotos"},
            {"section": "core_features", "type": "fact", "content": "官方仓库展示上传照片、修复人脸、对比与下载的完整流程。", "source_url": "https://github.com/Nutlope/restorePhotos"},
            {"section": "ai_implementation", "type": "fact", "content": "官方仓库通过 Replicate 上的 GFPGAN 进行人脸修复。", "source_url": "https://github.com/Nutlope/restorePhotos"},
            {"section": "truth_boundary", "type": "editorial_inference", "content": "修复模型可能生成不存在的细节，不能把结果视为历史事实。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可改造成扫描门店的批量修复和客户交付后台。"}
          ],
          "evidence": [
            {"type": "open_source", "description": "官方仓库采用 MIT License。", "source_url": "https://github.com/Nutlope/restorePhotos"},
            {"type": "commercial_service", "description": "官方提供可访问的 RestorePhotos 产品站。", "source_url": "https://www.restorephotos.io/"}
          ],
          "tools": ["nextjs", "replicate"],
          "preview": {"role": "product_preview", "path": "/media/previews/restorephotos-preview.png", "media_type": "image", "alt": "RestorePhotos 官方仓库中的界面截图，展示模糊人像与修复结果对比。", "rights_holder": "RestorePhotos repository contributors", "license_terms": "MIT；仅按官方仓库许可用于界面说明，截图中的人物肖像不得脱离案例单独使用。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/Nutlope/restorePhotos/main/public/screenshot.png", "permission_basis": "官方仓库文件与根目录 MIT License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "64c5f618917e84ec98f4c6dce6492d83863be4c7a6602e157b3479159d8f7f3b"}
        },
        {
          "slug": "maxkb",
          "name": "MaxKB",
          "tagline": "面向企业知识库、工作流和智能客服的开源智能体平台",
          "summary": "MaxKB 把 RAG 知识问答、工作流、智能体和企业服务组合成可部署平台，适合拆解 AI 客服从回答到业务流程的升级。",
          "category": "customer-service",
          "case_kind": "product",
          "maturity": "production_product",
          "publisher_region": "mainland_china",
          "difficulty": "advanced",
          "pain_points": "编辑推断：企业客服知识分散、更新慢，通用聊天机器人又缺少业务数据、权限和流程连接。",
          "solution": "把企业资料接入知识库，通过 RAG、工作流和智能体构建问答或业务助手。",
          "why_it_works": "编辑推断：企业付费对象不是一段对话，而是可维护知识、可追踪流程和私有部署能力。",
          "target_users": "编辑推断：企业客服、IT、售前支持、内部知识管理和系统集成商。",
          "core_features": ["RAG 知识库问答", "可视化工作流", "智能体与企业部署"],
          "ai_implementation": "官方平台组合文档解析、向量检索、大模型、工作流节点与应用发布。",
          "technical_implementation": "复刻需要模型与向量库适配、文档管线、权限、多租户、工作流执行、日志和私有部署。",
          "monetization": "官方公开专业版、企业版和一体机；编辑推断还可通过实施、知识整理和长期运维收费。",
          "truth_boundary": {"implemented": ["官方提供 GPL 开源版和商业版本", "公开价格与企业部署路径存在"], "simulated": [], "not_implemented": ["专业增强包不等于全部开源", "本站未验证官方用户与客户规模自述"]},
          "adapt_change_who": "从通用企业改为制造售后、医疗设备、园区服务或软件支持团队。",
          "adapt_change_what": "从通用知识问答改为连接工单、备件、权限和人工转接的行业流程。",
          "adapt_change_context": "从独立聊天页改为嵌入官网、企业微信或内部系统，并保留审计。",
          "adapt_new_opportunity": "产品假设：围绕某一垂直行业交付知识治理、智能客服和持续运维。",
          "primary_source": "https://github.com/1Panel-dev/MaxKB",
          "cover_path": "/media/covers/chatwoot-captain-cover.png",
          "cover_alt": "MaxKB 主题的本站原创抽象封面：机器人、对话气泡与人工客服通过流程线相连，非产品界面截图。",
          "cover_hash": "10b90f83b01ca36350a4a502e687fe202805c7cee4d1b945680341f15228f631",
          "commercial_score": 5,
          "commercial_rationale": "付费者、企业场景、部署与持续运维都清晰，官方已有公开专业版与一体机价格；高分不代表市场容易，实施和渠道能力仍是门槛。",
          "commercial_evidence": "飞致云官方销售目录公开 MaxKB 专业版、企业版和一体机价格，官网明确企业智能体定位。",
          "featured": true,
          "editor_rank": 6,
          "published_at": "2026-07-16T02:00:00Z",
          "publishers": [{"name": "飞致云（FIT2CLOUD）", "region": "mainland_china", "role": "developer", "evidence_url": "https://www.fit2cloud.com/about/"}],
          "links": [
            {"type": "online_demo", "label": "MaxKB 官网", "url": "https://maxkb.cn/", "platform": "官网", "canonical": false},
            {"type": "pricing", "label": "官方销售目录", "url": "https://fit2cloud.com/purchase/index.html", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/1Panel-dev/MaxKB", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库将 MaxKB 定义为支持 RAG、工作流与 Agent 的开源企业级智能体平台。", "source_url": "https://github.com/1Panel-dev/MaxKB"},
            {"section": "core_features", "type": "fact", "content": "官方将 MaxKB 定义为企业级智能体平台，覆盖 RAG、工作流与 Agent。", "source_url": "https://maxkb.cn/appliance"},
            {"section": "monetization", "type": "fact", "content": "飞致云官方销售目录公开 MaxKB 专业版、企业版和一体机。", "source_url": "https://fit2cloud.com/purchase/index.html"},
            {"section": "why_it_works", "type": "editorial_inference", "content": "企业价值来自知识治理、流程连接和部署服务，而不是单次聊天。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可围绕单一行业交付知识治理、客服流程与长期运维。"}
          ],
          "evidence": [
            {"type": "open_source", "description": "官方仓库采用 GPL-3.0 License。", "source_url": "https://github.com/1Panel-dev/MaxKB"},
            {"type": "public_pricing", "description": "官方销售目录公开专业版与一体机价格。", "source_url": "https://fit2cloud.com/purchase/index.html"},
            {"type": "commercial_service", "description": "飞致云官网明确 MaxKB 商业产品和企业服务。", "source_url": "https://www.fit2cloud.com/about/"}
          ],
          "tools": ["vue", "postgresql", "langchain"],
          "preview": {"role": "product_preview", "path": "/media/previews/maxkb-preview.png", "media_type": "image", "alt": "MaxKB 官方仓库中的工作流调试界面，展示数据源选择与文件导入。", "rights_holder": "MaxKB repository contributors", "license_terms": "GPL-3.0；仅按官方仓库许可用于产品界面说明。", "authorization": "approved", "source_url": "https://raw.githubusercontent.com/1Panel-dev/MaxKB/v2/ui/src/assets/workflow-demo.png", "permission_basis": "官方仓库文件与根目录 GPL-3.0 License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "41babf231e52f847c4ca3109cc75f7bffdeb3e138633ea30ce14d1b6e2dc9900"}
        },
        {
          "slug": "anythingllm",
          "name": "AnythingLLM",
          "tagline": "把文档、向量检索、模型与 Agent 放进同一知识工作区",
          "summary": "AnythingLLM 提供桌面端和多用户自托管版本，覆盖文档问答、引用、Agent、向量库和模型选择，是完整个人知识库产品案例。",
          "category": "knowledge-base",
          "case_kind": "product",
          "maturity": "production_product",
          "publisher_region": "international",
          "difficulty": "advanced",
          "pain_points": "编辑推断：团队资料分散且模型供应商不断变化，用户需要可控制数据、模型和知识空间的统一界面。",
          "solution": "创建工作区、导入文档并选择模型或向量库，通过带引用问答和 Agent 使用资料。",
          "why_it_works": "编辑推断：本地桌面与多用户部署同时覆盖个人隐私和企业协作，减少对单一模型供应商的依赖。",
          "target_users": "编辑推断：个人知识工作者、小团队、企业内部知识库和私有 AI 部署服务商。",
          "core_features": ["文档问答与引用", "多模型与向量库", "Agent、桌面端与多用户部署"],
          "ai_implementation": "官方项目把文档解析、嵌入、向量检索、大模型与 Agent 工具组织为工作区。",
          "technical_implementation": "真实部署需要文档管线、LanceDB 或其他向量库、模型适配、权限、审计和 Docker/桌面打包。",
          "monetization": "编辑推断：可通过托管云、企业部署、支持服务、集成与知识迁移收费。",
          "truth_boundary": {"implemented": ["官方提供桌面端和多用户 Docker 版本", "支持文档引用、Agent 和多种向量库"], "simulated": [], "not_implemented": ["本站未验证每个模型与连接器", "开源不代表所有企业服务免费"]},
          "adapt_change_who": "从通用知识用户改为律所、工程团队、设备售后或项目交付团队。",
          "adapt_change_what": "从任意文档问答改为有权限、版本、引用规范和业务动作的知识应用。",
          "adapt_change_context": "从个人工作区改为部门级部署、接入内部身份和审计。",
          "adapt_new_opportunity": "产品假设：为某一行业交付模型中立的私有知识工作区和持续知识维护。",
          "primary_source": "https://github.com/Mintplex-Labs/anything-llm",
          "cover_path": "/media/covers/anythingllm-cover.png",
          "cover_alt": "AnythingLLM 主题的本站原创抽象封面：打开的资料保险库与相连的文档节点，非产品界面截图。",
          "cover_hash": "26fb38863031dc3fdd8433a65d6283ab6b6512285ea10e730c924ca761724807",
          "commercial_score": 4,
          "commercial_rationale": "知识工作是持续需求，私有部署、模型中立和企业集成带来明确付费理由；通用 RAG 产品竞争强，垂直交付能力决定结果。",
          "commercial_evidence": "官方仓库提供成熟桌面和多用户产品，官网提供企业与商业服务入口。",
          "featured": false,
          "editor_rank": 11,
          "published_at": "2026-07-16T01:00:00Z",
          "publishers": [{"name": "Mintplex Labs Inc.", "region": "international", "role": "developer", "evidence_url": "https://github.com/Mintplex-Labs"}],
          "links": [
            {"type": "online_demo", "label": "AnythingLLM 官网", "url": "https://anythingllm.com/", "platform": "官网", "canonical": false},
            {"type": "primary_source", "label": "官方仓库", "url": "https://github.com/Mintplex-Labs/anything-llm", "platform": "GitHub", "canonical": true}
          ],
          "claims": [
            {"section": "product_overview", "type": "fact", "content": "官方仓库提供桌面端与多用户 Docker 版本，用于文档问答、引用与 Agent 工作流。", "source_url": "https://github.com/Mintplex-Labs/anything-llm"},
            {"section": "core_features", "type": "fact", "content": "官方仓库说明支持文档问答与引用、Agent、向量库、桌面端和多用户 Docker。", "source_url": "https://github.com/Mintplex-Labs/anything-llm"},
            {"section": "technical_implementation", "type": "fact", "content": "官方项目支持多种模型与向量数据库，并提供文档管线。", "source_url": "https://github.com/Mintplex-Labs/anything-llm"},
            {"section": "monetization", "type": "editorial_inference", "content": "商业价值更可能来自企业部署、集成和知识维护，而不是单次问答。"},
            {"section": "adaptation", "type": "hypothesis", "content": "可改造成单一行业的私有知识工作区与长期维护服务。"}
          ],
          "evidence": [
            {"type": "open_source", "description": "官方仓库采用 MIT License。", "source_url": "https://github.com/Mintplex-Labs/anything-llm"},
            {"type": "commercial_service", "description": "官方提供企业与商业服务入口。", "source_url": "https://anythingllm.com/"}
          ],
          "tools": ["lancedb", "nodejs", "docker"],
          "preview": {"role": "product_preview", "path": "/media/previews/anythingllm-preview.gif", "media_type": "gif", "alt": "AnythingLLM 官方 release 演示，展示创建工作区、导入资料并进行带上下文问答。", "rights_holder": "AnythingLLM repository contributors", "license_terms": "MIT；正式 release 演示仅按仓库许可用于产品流程说明。", "authorization": "approved", "source_url": "https://github.com/Mintplex-Labs/anything-llm/releases/download/v1.11.2/AnythingLLM720p.gif", "permission_basis": "官方仓库 README 引用的正式 release 资产与根目录 MIT License", "explicit_permission": true, "captured_by_site": false, "is_abstract": false, "sha256": "3b84ef4f6fa517035153363ec62915647c72ed463d41a791e4ac6cb3d53e8603", "static_poster_path": "/media/previews/anythingllm-preview.png", "static_poster_sha256": "22cd3c73ddcd374953dc0ee8523b1a736cf44b57ab5f2ab19f7d57f1f13f9595"}
        }
      ]
      $catalog$::jsonb
    )
  loop
    insert into public.demos (
      slug,
      name,
      tagline,
      summary,
      category_id,
      status,
      case_kind,
      maturity,
      publisher_region,
      technology_disclosure,
      source_code_status,
      difficulty,
      pain_points,
      solution,
      why_it_works,
      target_users,
      core_features,
      ai_implementation,
      technical_implementation,
      monetization,
      truth_boundary,
      adapt_change_who,
      adapt_change_what,
      adapt_change_context,
      adapt_new_opportunity,
      primary_source_type,
      primary_source_platform,
      primary_source_url,
      primary_source_verified_at,
      cover_path,
      cover_alt,
      cover_rights_holder,
      cover_license,
      cover_origin_kind,
      cover_authorization_status,
      commercial_potential_score,
      commercial_potential_rationale,
      commercial_potential_evidence,
      commercial_potential_rule_version,
      commercial_potential_verified_at,
      content_fingerprint,
      collected_on,
      published_at,
      featured,
      editor_pick_rank
    )
    values (
      item ->> 'slug',
      item ->> 'name',
      item ->> 'tagline',
      item ->> 'summary',
      (select id from public.categories where slug = item ->> 'category'),
      'published',
      item ->> 'case_kind',
      item ->> 'maturity',
      item ->> 'publisher_region',
      'verified',
      'open_source',
      item ->> 'difficulty',
      item ->> 'pain_points',
      item ->> 'solution',
      item ->> 'why_it_works',
      item ->> 'target_users',
      array(select jsonb_array_elements_text(item -> 'core_features')),
      item ->> 'ai_implementation',
      item ->> 'technical_implementation',
      item ->> 'monetization',
      item -> 'truth_boundary',
      item ->> 'adapt_change_who',
      item ->> 'adapt_change_what',
      item ->> 'adapt_change_context',
      item ->> 'adapt_new_opportunity',
      'official_repository',
      'GitHub',
      item ->> 'primary_source',
      timestamptz '2026-07-16 00:00:00+00',
      item ->> 'cover_path',
      item ->> 'cover_alt',
      cover_rights_holder,
      cover_license_terms,
      'original',
      'approved',
      (item ->> 'commercial_score')::smallint,
      item ->> 'commercial_rationale',
      item ->> 'commercial_evidence',
      'mvp-commercial-potential-v1',
      timestamptz '2026-07-16 00:00:00+00',
      md5(item::text || cover_license_terms),
      date '2026-07-16',
      (item ->> 'published_at')::timestamptz,
      (item ->> 'featured')::boolean,
      (item ->> 'editor_rank')::integer
    )
    on conflict (slug) do update
    set name = excluded.name,
        tagline = excluded.tagline,
        summary = excluded.summary,
        category_id = excluded.category_id,
        status = excluded.status,
        case_kind = excluded.case_kind,
        maturity = excluded.maturity,
        publisher_region = excluded.publisher_region,
        technology_disclosure = excluded.technology_disclosure,
        source_code_status = excluded.source_code_status,
        difficulty = excluded.difficulty,
        pain_points = excluded.pain_points,
        solution = excluded.solution,
        why_it_works = excluded.why_it_works,
        target_users = excluded.target_users,
        core_features = excluded.core_features,
        ai_implementation = excluded.ai_implementation,
        technical_implementation = excluded.technical_implementation,
        monetization = excluded.monetization,
        truth_boundary = excluded.truth_boundary,
        adapt_change_who = excluded.adapt_change_who,
        adapt_change_what = excluded.adapt_change_what,
        adapt_change_context = excluded.adapt_change_context,
        adapt_new_opportunity = excluded.adapt_new_opportunity,
        primary_source_type = excluded.primary_source_type,
        primary_source_platform = excluded.primary_source_platform,
        primary_source_url = excluded.primary_source_url,
        primary_source_verified_at = excluded.primary_source_verified_at,
        cover_path = excluded.cover_path,
        cover_alt = excluded.cover_alt,
        cover_rights_holder = excluded.cover_rights_holder,
        cover_license = excluded.cover_license,
        cover_origin_kind = excluded.cover_origin_kind,
        cover_authorization_status = excluded.cover_authorization_status,
        commercial_potential_score = excluded.commercial_potential_score,
        commercial_potential_rationale = excluded.commercial_potential_rationale,
        commercial_potential_evidence = excluded.commercial_potential_evidence,
        commercial_potential_rule_version = excluded.commercial_potential_rule_version,
        commercial_potential_verified_at = excluded.commercial_potential_verified_at,
        content_fingerprint = excluded.content_fingerprint,
        collected_on = excluded.collected_on,
        published_at = excluded.published_at,
        featured = excluded.featured,
        editor_pick_rank = excluded.editor_pick_rank
    where public.demos.content_fingerprint is distinct from excluded.content_fingerprint
    returning id into demo_uuid;

    if demo_uuid is null then
      select id into strict demo_uuid
      from public.demos
      where slug = item ->> 'slug';

      -- 内容指纹覆盖案例及全部关系声明；未变化时保持关系 UUID 与 created_at 原样不动。
      continue;
    end if;

    -- 只有声明内容变化时才重建关系，让删除和修订收敛，同时保证重复执行的可观察状态不变。
    delete from public.demo_tools where demo_id = demo_uuid;
    delete from public.demo_publishers where demo_id = demo_uuid;
    delete from public.demo_links where demo_id = demo_uuid;
    delete from public.demo_claims where demo_id = demo_uuid;
    delete from public.demo_media where demo_id = demo_uuid;
    delete from public.demo_evidence where demo_id = demo_uuid;

    for publisher_item in
      select value from jsonb_array_elements(item -> 'publishers')
    loop
      insert into public.demo_publishers (demo_id, name, region, role, official_evidence_url, verified_at)
      values (
        demo_uuid,
        publisher_item ->> 'name',
        publisher_item ->> 'region',
        publisher_item ->> 'role',
        publisher_item ->> 'evidence_url',
        timestamptz '2026-07-16 00:00:00+00'
      );
    end loop;

    for link_item in
      select value from jsonb_array_elements(item -> 'links')
    loop
      insert into public.demo_links (
        demo_id,
        link_type,
        label,
        url,
        source_platform,
        is_canonical,
        last_verified_at
      )
      values (
        demo_uuid,
        case
          when link_item ->> 'type' = 'primary_source'
            and link_item ->> 'platform' = 'GitHub'
            and link_item ->> 'url' = item ->> 'primary_source'
          then 'repository'
          else link_item ->> 'type'
        end,
        link_item ->> 'label',
        link_item ->> 'url',
        link_item ->> 'platform',
        (link_item ->> 'canonical')::boolean,
        timestamptz '2026-07-16 00:00:00+00'
      );
    end loop;

    insert into public.demo_claims (
      demo_id,
      section,
      claim_type,
      content,
      source_url,
      verified_at,
      is_primary
    )
    values
      (
        demo_uuid,
        'product_overview',
        'fact',
        (
          select value ->> 'content'
          from jsonb_array_elements(item -> 'claims')
          where value ->> 'section' = 'product_overview'
            and value ->> 'type' = 'fact'
          limit 1
        ),
        item ->> 'primary_source',
        timestamptz '2026-07-16 00:00:00+00',
        true
      ),
      (demo_uuid, 'why_it_works', 'editorial_inference', item ->> 'why_it_works', null, null, true),
      (demo_uuid, 'pain_points', 'editorial_inference', item ->> 'pain_points', null, null, true),
      (demo_uuid, 'solution', 'fact', item ->> 'solution', item ->> 'primary_source', timestamptz '2026-07-16 00:00:00+00', true),
      (demo_uuid, 'target_users', 'editorial_inference', item ->> 'target_users', null, null, true),
      (
        demo_uuid,
        'core_features',
        'fact',
        (select pg_catalog.string_agg(value, '；') from jsonb_array_elements_text(item -> 'core_features')),
        item ->> 'primary_source',
        timestamptz '2026-07-16 00:00:00+00',
        true
      ),
      (demo_uuid, 'ai_implementation', 'fact', item ->> 'ai_implementation', item ->> 'primary_source', timestamptz '2026-07-16 00:00:00+00', true),
      (demo_uuid, 'technical_implementation', 'editorial_inference', item ->> 'technical_implementation', null, null, true),
      (demo_uuid, 'monetization', 'editorial_inference', item ->> 'monetization', null, null, true),
      (demo_uuid, 'truth_boundary', 'editorial_inference', '实现边界由官方资料与编辑复核共同整理，页面逐项区分已实现、模拟和未实现。', null, null, true),
      (demo_uuid, 'adaptation', 'hypothesis', item ->> 'adapt_new_opportunity', null, null, true);

    for claim_item in
      select value
      from jsonb_array_elements(item -> 'claims')
      where not (
        value ->> 'section' = 'product_overview'
        and value ->> 'type' = 'fact'
      )
    loop
      insert into public.demo_claims (demo_id, section, claim_type, content, source_url, verified_at)
      values (
        demo_uuid,
        claim_item ->> 'section',
        claim_item ->> 'type',
        claim_item ->> 'content',
        nullif(claim_item ->> 'source_url', ''),
        case
          when claim_item ->> 'type' = 'fact' then timestamptz '2026-07-16 00:00:00+00'
          else null
        end
      );
    end loop;

    for evidence_item in
      select value from jsonb_array_elements(item -> 'evidence')
    loop
      insert into public.demo_evidence (demo_id, evidence_type, description, source_url, verified_at)
      values (
        demo_uuid,
        evidence_item ->> 'type',
        evidence_item ->> 'description',
        evidence_item ->> 'source_url',
        timestamptz '2026-07-16 00:00:00+00'
      );
    end loop;

    for tool_slug in
      select jsonb_array_elements_text(item -> 'tools')
    loop
      insert into public.demo_tools (demo_id, tool_id, verified_at, source_url)
      select
        demo_uuid,
        tool.id,
        timestamptz '2026-07-16 00:00:00+00',
        item ->> 'primary_source'
      from public.tools as tool
      where tool.slug = tool_slug;
    end loop;

    insert into public.demo_media (
      demo_id,
      role,
      storage_path,
      media_type,
      alt_text,
      rights_holder,
      license_terms,
      authorization_status,
      content_hash,
      is_original,
      captured_by_site,
      explicit_permission,
      is_abstract
    )
    select
      demo_uuid,
      'cover',
      item ->> 'cover_path',
      'image',
      item ->> 'cover_alt',
      cover_rights_holder,
      cover_license_terms,
      'approved',
      item ->> 'cover_hash',
      true,
      false,
      false,
      true;

    preview_item := item -> 'preview';

    insert into public.demo_media (
      demo_id,
      role,
      storage_path,
      media_type,
      alt_text,
      rights_holder,
      license_terms,
      permission_basis,
      authorization_status,
      source_url,
      content_hash,
      is_original,
      captured_by_site,
      explicit_permission,
      is_abstract,
      static_poster_path,
      static_poster_hash,
      has_narration,
      is_muted_by_default,
      allows_pause
    )
    select
      demo_uuid,
      preview_item ->> 'role',
      preview_item ->> 'path',
      preview_item ->> 'media_type',
      preview_item ->> 'alt',
      preview_item ->> 'rights_holder',
      preview_item ->> 'license_terms',
      preview_item ->> 'permission_basis',
      preview_item ->> 'authorization',
      preview_item ->> 'source_url',
      preview_item ->> 'sha256',
      false,
      (preview_item ->> 'captured_by_site')::boolean,
      (preview_item ->> 'explicit_permission')::boolean,
      (preview_item ->> 'is_abstract')::boolean,
      nullif(preview_item ->> 'static_poster_path', ''),
      nullif(preview_item ->> 'static_poster_sha256', ''),
      false,
      true,
      true;
  end loop;
end;
$seed$;

do $launch_contract$
declare
  launch_count integer;
  published_count integer;
  public_count integer;
  category_count integer;
  mainland_count integer;
  international_count integer;
  cover_count integer;
  preview_count integer;
begin
  select
    count(*)::integer,
    count(*) filter (where demo.status = 'published')::integer,
    count(*) filter (where public.is_demo_public(demo.id))::integer,
    count(distinct demo.category_id)::integer,
    count(*) filter (where demo.publisher_region = 'mainland_china')::integer,
    count(*) filter (where demo.publisher_region = 'international')::integer
  into
    launch_count,
    published_count,
    public_count,
    category_count,
    mainland_count,
    international_count
  from public.demos as demo
  where demo.slug = any(array[
    'roomgpt',
    'cogvideo',
    'funclip',
    'presenton',
    'pptagent',
    'novel',
    'open-notebook',
    'postiz',
    'opengame',
    'restorephotos',
    'maxkb',
    'anythingllm'
  ]::text[]);

  select
    count(distinct media.demo_id) filter (where media.role = 'cover')::integer,
    count(distinct media.demo_id) filter (where media.role = 'product_preview')::integer
  into cover_count, preview_count
  from public.demo_media as media
  join public.demos as demo on demo.id = media.demo_id
  where demo.slug = any(array[
    'roomgpt',
    'cogvideo',
    'funclip',
    'presenton',
    'pptagent',
    'novel',
    'open-notebook',
    'postiz',
    'opengame',
    'restorephotos',
    'maxkb',
    'anythingllm'
  ]::text[])
    and media.authorization_status = 'approved';

  if launch_count <> 12
    or published_count <> 12
    or public_count <> 12
    or category_count <> 10
    or mainland_count <> 4
    or international_count <> 8
    or cover_count <> 12
    or preview_count <> 12
  then
    raise exception using
      errcode = '23514',
      message = pg_catalog.format(
        '首发内容契约失败：案例 %s，发布 %s，公开 %s，分类 %s，国内 %s，海外 %s，封面 %s，预览 %s',
        launch_count,
        published_count,
        public_count,
        category_count,
        mainland_count,
        international_count,
        cover_count,
        preview_count
      );
  end if;

  if not exists (
    select 1
    from public.demos
    where slug = 'colorsnap'
      and status = 'draft'
  ) then
    raise exception using
      errcode = '23514',
      message = 'ColorSnap 必须保持草稿';
  end if;
end;
$launch_contract$;
