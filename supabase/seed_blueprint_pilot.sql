update public.blueprint_runtime_flags
set local_pilot_enabled = true,
    updated_at = now()
where singleton;

insert into public.blueprints (
  blueprint_number,
  slug,
  name,
  tagline,
  summary,
  status,
  version,
  pricing_status,
  price_minor,
  currency,
  access_mode,
  origin_statement,
  demo_facts,
  target_plan,
  product_overview,
  target_users,
  problem_statement,
  solution_statement,
  feature_map,
  user_flow,
  ui_screens,
  blueprint_score,
  build_timeline
)
values (
  1,
  'colorsnap-blueprint',
  'ColorSnap Blueprint',
  '把现实颜色变成可收藏双面色卡的产品复刻资料样品',
  '围绕已运行验证的 ColorSnap 前端原型，整理产品判断、界面结构、反向 PRD、AI 升级 Prompt、技术改造与营销验证方案。当前不是可售源码包。',
  'rework_required',
  'preview-0.1',
  'undecided',
  null,
  null,
  'pilot_preview',
  '站长提交的 ColorSnap 工作目录是本 Blueprint 的事实来源；文件位置不等于公开销售权，代码、名称与素材权利仍待确认。',
  '{"implemented":["抽取目标色","照片导入与手动像素采样","RGB 到 Lab 与 CIEDE2000 比色","双面色卡、本地图鉴、配色板与分享票根"],"simulated":["地图信号与随机坐标","附近用户回应","交换请求与信号棱镜"],"missing":["AI 模型","账号与后端","云同步","真实社区","支付与商业验证"]}'::jsonb,
  '{"positioning":"非 AI 颜色收藏原型的 AI 升级候选","validation_goal":"先验证用户是否愿意持续记录并分享现实颜色，再决定加入视觉模型或个性化推荐","not_included":["React 源码","Figma 文件","数据库 Schema","可商用第三方图片包","已验证盈利结论"]}'::jsonb,
  'ColorSnap 把现实观察到的颜色转成带照片、色值和故事的可收藏双面色卡；当前是单文件前端原型，不是 AI 成品。',
  '首批用户是假设中的设计师、摄影爱好者、城市观察者和视觉收藏者；本站尚未核验其规模或付费意愿。',
  '现实中的颜色短暂且难以记录、整理和再次组合，普通取色工具也缺少收藏与分享的产品闭环。',
  '用目标色、照片取色、色差反馈、双面卡、图鉴、配色板和分享票根，把一次观察变成可回看的颜色记录。',
  '目标色 → 导入或选择照片 → 手动采样 → CIEDE2000 比色 → 生成双面卡 → 本地收藏/分享；地图与社区节点当前为模拟。',
  '抽卡/卡包、现实寻色、取景采样、相似度结果、双面色卡、图鉴、配色板与分享票根共 23 个页面状态和核心组件。',
  '当前资料包未包含 Figma 或可直接销售的 UI 文件；公开页面只展示结构样品。',
  '{"overall":72,"market_demand":74,"competition":58,"build_difficulty":42,"revenue_potential":61,"ai_compatibility":79,"note":"编辑估计：用于比较 Blueprint 的复刻价值，不是市场调研、收入或付费意愿数据。Build Difficulty 分数越低代表越容易上线。"}'::jsonb,
  '[
    {"step":1,"title":"Import Prompt","title_zh":"导入 Prompt","description":"把颜色命名、视觉理解和配色建议 Prompt 复制到你的 AI 开发工具中，先确定 AI 升级边界。","estimate":"30–60 分钟","difficulty":"low","output":"Prompt 版本与输入输出约定"},
    {"step":2,"title":"Deploy Database","title_zh":"部署数据库","description":"建立色卡、照片元数据、收藏与分享记录的数据表；照片默认私有，先用测试数据验证读写权限。","estimate":"半天–1 天","difficulty":"medium","output":"本地或测试环境数据库"},
    {"step":3,"title":"Deploy Frontend","title_zh":"部署前端","description":"接入取色算法、照片采样、双面色卡和图鉴页面，把确定性的核心流程部署到预览环境。","estimate":"1–2 天","difficulty":"medium","output":"可分享的预览链接"},
    {"step":4,"title":"Connect Stripe","title_zh":"连接 Stripe","description":"上线前再配置支付、价格和权益校验；当前 Blueprint 仅提供实施顺序，不代表支付已接通。","estimate":"半天–1 天","difficulty":"high","output":"待生产核验的支付沙盒"},
    {"step":5,"title":"Launch","title_zh":"正式发布","description":"邀请首批目标用户完成一次颜色收藏任务，记录完成率和复访，再决定是否扩大 AI、社区和商业化范围。","estimate":"1 周验证周期","difficulty":"medium","output":"首轮行为验证记录"}
  ]'::jsonb
)
on conflict (slug) do update
set blueprint_number = excluded.blueprint_number,
    name = excluded.name,
    tagline = excluded.tagline,
    summary = excluded.summary,
    status = excluded.status,
    version = excluded.version,
    pricing_status = excluded.pricing_status,
    price_minor = excluded.price_minor,
    currency = excluded.currency,
    access_mode = excluded.access_mode,
    origin_statement = excluded.origin_statement,
    demo_facts = excluded.demo_facts,
    target_plan = excluded.target_plan,
    product_overview = excluded.product_overview,
    target_users = excluded.target_users,
    problem_statement = excluded.problem_statement,
    solution_statement = excluded.solution_statement,
    feature_map = excluded.feature_map,
    user_flow = excluded.user_flow,
    ui_screens = excluded.ui_screens,
    blueprint_score = excluded.blueprint_score,
    build_timeline = excluded.build_timeline;

insert into public.blueprint_demo_links (
  blueprint_id,
  demo_id,
  relation_kind,
  disclosure
)
select
  blueprint.id,
  demo.id,
  'own_case',
  '对应站长提交的 ColorSnap 非 AI 前端原型；Blueprint 是本站反向整理的产品化资料样品，不是第三方官方源码。'
from public.blueprints as blueprint
join public.demos as demo on demo.slug = 'colorsnap'
where blueprint.slug = 'colorsnap-blueprint'
on conflict (blueprint_id, demo_id) do update
set relation_kind = excluded.relation_kind,
    disclosure = excluded.disclosure;

insert into public.blueprint_deliverables (
  blueprint_id,
  kind,
  title,
  summary,
  format_label,
  sample_status,
  sort_order
)
select blueprint.id, item.kind, item.title, item.summary, item.format_label, 'sample_ready', item.sort_order
from public.blueprints as blueprint
cross join (
  values
    ('product_breakdown', '产品拆解', '拆清抽色、现实寻色、比色、收藏与分享闭环，以及尚未验证的用户需求。', '结构化清单', 1),
    ('business_model', '商业模式', '区分原型内参与机制与待验证的主题色包、联名和专业导出假设。', '假设画布', 2),
    ('ui_resources', 'UI 资源', '盘点 23 个页面状态、核心组件与视觉规则；明确当前提交资料未包含 Figma 文件。', '界面清单', 3),
    ('prd', 'PRD', '根据现有代码反向整理 v0.1 目标、范围、流程、边界和验收条件。', 'PRD 样品', 4),
    ('prompts', 'Prompt', '为未来 AI 升级设计视觉理解、命名与推荐 Prompt，不冒充当前运行能力。', 'Prompt 样品', 5),
    ('technical_plan', '技术方案', '记录现有 Vanilla 技术栈，并给出账号、后端、存储和 AI 的分阶段改造顺序。', '技术路线', 6),
    ('marketing_plan', '营销方案', '以“收藏现实颜色”为核心故事设计受众、内容、验证指标与止损条件。', '验证计划', 7)
) as item(kind, title, summary, format_label, sort_order)
where blueprint.slug = 'colorsnap-blueprint'
on conflict (blueprint_id, kind) do update
set title = excluded.title,
    summary = excluded.summary,
    format_label = excluded.format_label,
    sample_status = excluded.sample_status,
    sort_order = excluded.sort_order;

insert into public.blueprint_resources (
  blueprint_id,
  kind,
  title,
  summary,
  content,
  sort_order
)
select blueprint.id, item.kind, item.title, item.summary, item.content, item.sort_order
from public.blueprints as blueprint
cross join (
  values
    (
      'product_breakdown',
      '产品拆解：从目标色到收藏卡',
      '这是对已运行前端闭环的事实整理，不代表用户需求已被市场验证。',
      array[
        '核心任务：把现实中的颜色转成一张有照片、色值和故事的可收藏双面卡。',
        '已验证流程：抽取目标色 → 选择模拟照片 → 手动采样 → CIEDE2000 比较 → 生成并保存色卡。',
        '参与机制：3 个色彩包、90 个目标色、稀有度、冷却时间、重复卡转信号棱镜。',
        '价值假设：设计师与颜色爱好者可能愿意持续记录、整理和分享现实色彩。',
        '最大风险：持续记录动机、相机使用频率、分享意愿和社区网络效应均未验证。'
      ],
      1
    ),
    (
      'business_model',
      '商业模式：先验证付费对象',
      '以下全部是待测试假设；当前提交材料未提供、本站也尚未核验收费、收入、转化或付费意愿数据。',
      array[
        '免费核心：每日抽色、基础色卡、有限本地收藏和分享票根。',
        '单品假设：城市、品牌或季节主题色包，按包购买，不承诺订阅。',
        '专业假设：配色板导出、品牌色规范和团队素材整理，面向设计工作流。',
        '合作假设：博物馆、城市活动与品牌联名色包，前提是素材和商标授权完成。',
        '验证顺序：先测试完成一张卡的比例，再测试七日重复使用，最后才测试付费。'
      ],
      2
    ),
    (
      'ui_resources',
      'UI 资源：页面与组件清单',
      '已提交代码是单文件前端，当前资料包未包含 Figma；18 张模拟照片不得进入公开商品包。',
      array[
        '核心页面：卡包首页、抽卡、现实寻色、相机/选图、采样、双面卡、图鉴、配色板与分享票根。',
        '主要组件：堆叠卡包、全息色卡、取景框、采样点、相似度结果、双面翻转卡和 60/30/10 配色条。',
        '视觉语言：黑白底、粗体高对比标题、色彩作为唯一主视觉变量、圆角移动端卡片。',
        '响应式目标：先保证 360px 单栏任务闭环，再扩展桌面演示框，不把桌面布局当产品本体。',
        '交付阻断：工作名需复核，UI 权属需确认，模拟图片需替换或逐项补齐来源。'
      ],
      3
    ),
    (
      'prd',
      'PRD v0.1：本地颜色收藏原型',
      '本 PRD 是本轮根据现有代码反向整理的样品，不是原项目已有文件。',
      array[
        '目标：让用户在 3 分钟内完成一次“目标色 → 照片取色 → 色差反馈 → 收藏卡”闭环。',
        '范围：90 个内置目标色、最多 5 张候选照片、手动采样、本地保存、图鉴、配色板和票根分享。',
        '不在范围：AI 自动识图、真实地图、账号、云同步、支付、用户间消息和真实交换。',
        '关键验收：无网络时核心闭环可运行；采样点与最终色值一致；重复提交不会破坏本地收藏。',
        '验证指标：任务开始率、完成率、从采样到保存的流失、七日内第二次完成率；当前均无数据。'
      ],
      4
    ),
    (
      'prompts',
      'Prompt：AI 升级候选',
      '这些 Prompt 只用于未来实验，当前 ColorSnap 运行时没有模型调用。',
      array[
        '视觉理解：只描述画面中可见的材质、光线和主色区域；不要推断地点、人物身份或品牌。',
        '颜色命名：基于 Lab 与场景描述生成 3 个短名称，并解释每个名称对应的可见证据。',
        '采样建议：返回最多 3 个候选区域及原因；最终 RGB 必须由像素采样计算，模型不得编造色值。',
        '配色说明：根据用户已收藏色卡提出 60/30/10 组合，并明确这是创作建议，不是客观规则。',
        '隐私边界：默认不上传原图；如启用云端模型，必须先取得明确同意并给出删除机制。'
      ],
      5
    ),
    (
      'technical_plan',
      '技术方案：从单页原型到可验证产品',
      '现有实现是原生 HTML/CSS/JavaScript；没有 React、后端、账号、数据库或模型 API。',
      array[
        '保留层：RGB→Lab→CIEDE2000、Canvas 票根、手动采样和本地离线流程继续作为确定性核心。',
        '第一步：拆分状态、颜色算法、媒体输入和界面组件，并为色差算法补固定向量测试。',
        '第二步：引入账号、Postgres 与对象存储；用户照片默认私有，服务端只保存必要元数据。',
        '第三步：真实地图和社区必须使用服务端权限、内容审核与位置模糊化，删除随机坐标模拟。',
        '第四步：只有在非 AI 闭环留存成立后再接视觉模型，并把模型输出与确定性色值分开存证。'
      ],
      6
    ),
    (
      'marketing_plan',
      '营销方案：卖故事前先验证行为',
      '渠道与商业价值都是假设；不把内部演示或社媒播放当成付费需求证据。',
      array[
        '一句话：把你在现实里遇见的颜色，做成一张带照片和故事的收藏卡。',
        '首批受众假设：视觉设计师、摄影爱好者、城市观察者和喜欢手账收藏的人。',
        '内容样板：同一条街的 7 种颜色、旅行色卡日记、品牌色在现实中的对应物。',
        '最小测试：邀请 15 名目标用户完成一次任务，记录完成率与第二次自发使用，不购买流量。',
        '止损线：多数用户把它当一次性滤镜，或无法解释为何要持续收藏时，停止开发社区与支付。'
      ],
      7
    )
) as item(kind, title, summary, content, sort_order)
where blueprint.slug = 'colorsnap-blueprint'
on conflict (blueprint_id, kind) do update
set title = excluded.title,
    summary = excluded.summary,
    content = excluded.content,
    sort_order = excluded.sort_order;
