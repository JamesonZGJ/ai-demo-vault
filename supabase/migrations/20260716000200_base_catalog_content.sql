insert into public.categories (slug, name_zh, sort_order)
values
  ('interior-design', 'AI 装修设计', 10),
  ('video-generation', 'AI 视频生成', 20),
  ('presentation', 'AI PPT 生成', 30),
  ('writing', 'AI 写作助手', 40),
  ('learning', 'AI 学习助手', 50),
  ('marketing', 'AI 营销工具', 60),
  ('game-generation', 'AI 游戏生成', 70),
  ('image-processing', 'AI 图片处理', 80),
  ('customer-service', 'AI 客服', 90),
  ('knowledge-base', 'AI 个人知识库', 100)
on conflict (slug) do update
set name_zh = excluded.name_zh,
    sort_order = excluded.sort_order;

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
  ai_implementation,
  truth_boundary,
  collected_on
)
select
  'colorsnap',
  'ColorSnap',
  '从想法到界面的非 AI 交互原型记录',
  '站长自有案例；当前没有 AI、真实后端或商业验证，只保存已实现、模拟和未实现边界，未通过发布门槛前不会公开。',
  category.id,
  'draft',
  'product',
  'interactive_prototype',
  'unknown',
  'partially_disclosed',
  'closed_source',
  'intermediate',
  '当前没有 AI 能力；“共鸣分”来自 CIEDE2000 色差计算，不是模型推理。',
  '{"implemented":["每日抽取色卡","现实寻色与模拟拍摄","手动取色与 CIEDE2000 比色","色卡收藏与分享"],"simulated":["地图与附近用户","交换与发布","定位和社区互动"],"not_implemented":["AI 模型调用","真实账号与后端数据库","支付与商业化","真实用户、留存或收入验证"]}'::jsonb,
  date '2026-07-16'
from public.categories as category
where category.slug = 'image-processing'
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
    ai_implementation = excluded.ai_implementation,
    truth_boundary = excluded.truth_boundary,
    collected_on = excluded.collected_on;
