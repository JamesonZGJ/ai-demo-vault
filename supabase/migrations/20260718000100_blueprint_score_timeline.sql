-- Blueprint 的评分与上线计划只描述编辑判断，不代表已验证的市场数据或交付承诺。
alter table public.blueprints
  add column blueprint_score jsonb not null default
    '{"overall":0,"market_demand":0,"competition":0,"build_difficulty":0,"revenue_potential":0,"ai_compatibility":0,"note":"尚未完成编辑评分"}'::jsonb,
  add column build_timeline jsonb not null default '[]'::jsonb;

alter table public.blueprints
  add constraint blueprints_score_object check (jsonb_typeof(blueprint_score) = 'object'),
  add constraint blueprints_timeline_array check (jsonb_typeof(build_timeline) = 'array');
