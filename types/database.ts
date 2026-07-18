export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

type InsertShape<Row, Required extends keyof Row> = Pick<Row, Required> &
  Partial<Omit<Row, Required>>;

type UpdateShape<Row> = Partial<Row>;

type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

type TableShape<
  Row,
  Insert,
  Relationships extends Relationship[] = [],
  Update = UpdateShape<Row>,
> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: Relationships;
};

export type CategoryRow = {
  id: string;
  slug: string;
  name_zh: string;
  sort_order: number;
  created_at: string;
};

export type ToolRow = {
  id: string;
  slug: string;
  name: string;
  official_url: string;
  created_at: string;
};

export type DemoRow = {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  category_id: string;
  status: 'draft' | 'published' | 'archived';
  case_kind:
    | 'product'
    | 'open_source_project'
    | 'model_demo'
    | 'official_template'
    | 'platform_workflow'
    | 'embedded_feature';
  maturity:
    | 'concept'
    | 'interactive_prototype'
    | 'working_demo'
    | 'production_product';
  publisher_region:
    | 'mainland_china'
    | 'international'
    | 'mixed'
    | 'unknown';
  technology_disclosure: 'verified' | 'partially_disclosed' | 'not_disclosed';
  source_code_status: 'open_source' | 'closed_source' | 'not_disclosed';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  pain_points: string | null;
  solution: string | null;
  why_it_works: string | null;
  target_users: string | null;
  core_features: string[] | null;
  ai_implementation: string | null;
  technical_implementation: string | null;
  monetization: string | null;
  truth_boundary: Json | null;
  adapt_change_who: string | null;
  adapt_change_what: string | null;
  adapt_change_context: string | null;
  adapt_new_opportunity: string | null;
  primary_source_type:
    | 'official_site'
    | 'official_docs'
    | 'official_repository'
    | 'official_help_center'
    | 'official_model_page'
    | 'official_legal_page'
    | null;
  primary_source_platform: string | null;
  primary_source_url: string | null;
  primary_source_verified_at: string | null;
  cover_path: string | null;
  cover_alt: string | null;
  cover_rights_holder: string | null;
  cover_license: string | null;
  cover_origin_kind: 'original' | 'licensed' | 'permission' | null;
  cover_authorization_status: 'pending' | 'approved' | 'rejected';
  commercial_potential_score: number | null;
  commercial_potential_rationale: string | null;
  commercial_potential_evidence: string | null;
  commercial_potential_rule_version: string | null;
  commercial_potential_verified_at: string | null;
  content_fingerprint: string | null;
  collected_on: string | null;
  published_at: string | null;
  featured: boolean;
  editor_pick_rank: number | null;
  favorites_count: number;
  created_at: string;
  updated_at: string;
};

export type DemoToolRow = {
  demo_id: string;
  tool_id: string;
  verified_at: string;
  source_url: string;
};

export type DemoPublisherRow = {
  id: string;
  demo_id: string;
  name: string;
  region: 'mainland_china' | 'international';
  role: 'developer' | 'service_operator' | 'contracting_entity';
  official_evidence_url: string;
  verified_at: string;
  created_at: string;
};

export type DemoLinkRow = {
  id: string;
  demo_id: string;
  link_type:
    | 'online_demo'
    | 'repository'
    | 'documentation'
    | 'pricing'
    | 'primary_source'
    | 'other';
  label: string;
  url: string;
  source_platform: string;
  is_canonical: boolean;
  source_is_mirror: boolean;
  canonical_url: string | null;
  last_verified_at: string;
  created_at: string;
};

export type DemoClaimRow = {
  id: string;
  demo_id: string;
  section:
    | 'product_overview'
    | 'why_it_works'
    | 'pain_points'
    | 'solution'
    | 'target_users'
    | 'core_features'
    | 'ai_implementation'
    | 'technical_implementation'
    | 'monetization'
    | 'truth_boundary'
    | 'adaptation'
    | 'other';
  claim_type: 'fact' | 'editorial_inference' | 'hypothesis';
  content: string;
  source_url: string | null;
  verified_at: string | null;
  is_primary: boolean;
  created_at: string;
};

export type DemoMediaRow = {
  id: string;
  demo_id: string;
  role: 'cover' | 'product_preview' | 'gallery';
  storage_path: string;
  media_type: 'image' | 'gif' | 'video';
  alt_text: string;
  rights_holder: string;
  license_terms: string;
  permission_basis: string | null;
  authorization_status: 'pending' | 'approved' | 'rejected';
  source_url: string | null;
  content_hash: string;
  is_original: boolean;
  captured_by_site: boolean;
  explicit_permission: boolean;
  is_abstract: boolean;
  static_poster_path: string | null;
  static_poster_hash: string | null;
  has_narration: boolean;
  captions_path: string | null;
  text_summary: string | null;
  is_muted_by_default: boolean;
  allows_pause: boolean;
  created_at: string;
};

export type DemoEvidenceRow = {
  id: string;
  demo_id: string;
  evidence_type:
    | 'open_source'
    | 'public_adoption'
    | 'public_pricing'
    | 'commercial_service';
  description: string;
  source_url: string;
  verified_at: string;
  created_at: string;
};

export type FavoriteRow = {
  user_id: string;
  demo_id: string;
  created_at: string;
};

export type BlueprintRow = {
  id: string;
  blueprint_number: number;
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  status: 'draft' | 'rework_required' | 'sellable' | 'withdrawn';
  version: string;
  pricing_status: 'undecided' | 'approved' | 'unavailable';
  price_minor: number | null;
  currency: string | null;
  access_mode: 'pilot_preview' | 'paid_single';
  origin_statement: string;
  demo_facts: Json;
  target_plan: Json;
  product_overview: string;
  target_users: string;
  problem_statement: string;
  solution_statement: string;
  feature_map: string;
  user_flow: string;
  ui_screens: string;
  blueprint_score: Json;
  build_timeline: Json;
  created_at: string;
  updated_at: string;
};

export type BlueprintDemoLinkRow = {
  blueprint_id: string;
  demo_id: string;
  relation_kind: 'own_case' | 'original_rebuild' | 'licensed_derivative';
  disclosure: string;
  created_at: string;
};

export type BlueprintDeliverableKind =
  | 'product_breakdown'
  | 'business_model'
  | 'ui_resources'
  | 'prd'
  | 'prompts'
  | 'technical_plan'
  | 'marketing_plan';

export type BlueprintDeliverableRow = {
  id: string;
  blueprint_id: string;
  kind: BlueprintDeliverableKind;
  title: string;
  summary: string;
  format_label: string;
  sample_status: 'sample_ready' | 'blocked';
  sort_order: number;
  created_at: string;
};

export type BlueprintRuntimeFlagRow = {
  singleton: boolean;
  local_pilot_enabled: boolean;
  updated_at: string;
};

export type BlueprintResourceRow = {
  id: string;
  blueprint_id: string;
  kind: BlueprintDeliverableKind;
  title: string;
  summary: string;
  content: string[];
  sort_order: number;
  created_at: string;
};

export type BlueprintAccessGrantRow = {
  id: string;
  user_id: string;
  blueprint_id: string;
  grant_kind: 'pilot_preview';
  created_at: string;
};

export type SearchDemoRow = Pick<
  DemoRow,
  | 'id'
  | 'slug'
  | 'name'
  | 'tagline'
  | 'summary'
  | 'cover_path'
  | 'cover_alt'
  | 'difficulty'
  | 'maturity'
  | 'publisher_region'
  | 'case_kind'
  | 'primary_source_platform'
  | 'commercial_potential_score'
  | 'commercial_potential_rationale'
  | 'favorites_count'
  | 'editor_pick_rank'
  | 'featured'
  | 'published_at'
  | 'updated_at'
> & {
  category_slug: string;
  category_name: string;
  tool_slugs: string[];
  tool_names: string[];
  total_count: number;
};

export type FeaturedDemoRow = Omit<SearchDemoRow, 'featured' | 'total_count'>;

export type Database = {
  public: {
    Tables: {
      categories: TableShape<
        CategoryRow,
        InsertShape<CategoryRow, 'slug' | 'name_zh'>
      >;
      tools: TableShape<
        ToolRow,
        InsertShape<ToolRow, 'slug' | 'name' | 'official_url'>
      >;
      demos: TableShape<
        DemoRow,
        InsertShape<
          DemoRow,
          | 'slug'
          | 'name'
          | 'tagline'
          | 'summary'
          | 'category_id'
          | 'case_kind'
          | 'maturity'
          | 'difficulty'
        >,
        [
          {
            foreignKeyName: 'demos_category_id_fkey';
            columns: ['category_id'];
            isOneToOne: false;
            referencedRelation: 'categories';
            referencedColumns: ['id'];
          },
        ]
      >;
      demo_tools: TableShape<
        DemoToolRow,
        DemoToolRow,
        [
          {
            foreignKeyName: 'demo_tools_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'demo_tools_tool_id_fkey';
            columns: ['tool_id'];
            isOneToOne: false;
            referencedRelation: 'tools';
            referencedColumns: ['id'];
          },
        ]
      >;
      demo_publishers: TableShape<
        DemoPublisherRow,
        InsertShape<
          DemoPublisherRow,
          'demo_id' | 'name' | 'region' | 'role' | 'official_evidence_url' | 'verified_at'
        >,
        [
          {
            foreignKeyName: 'demo_publishers_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
        ]
      >;
      demo_links: TableShape<
        DemoLinkRow,
        InsertShape<
          DemoLinkRow,
          'demo_id' | 'link_type' | 'label' | 'url' | 'source_platform' | 'last_verified_at'
        >,
        [
          {
            foreignKeyName: 'demo_links_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
        ]
      >;
      demo_claims: TableShape<
        DemoClaimRow,
        InsertShape<DemoClaimRow, 'demo_id' | 'section' | 'claim_type' | 'content'>,
        [
          {
            foreignKeyName: 'demo_claims_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
        ]
      >;
      demo_media: TableShape<
        DemoMediaRow,
        InsertShape<
          DemoMediaRow,
          | 'demo_id'
          | 'role'
          | 'storage_path'
          | 'media_type'
          | 'alt_text'
          | 'rights_holder'
          | 'license_terms'
          | 'content_hash'
        >,
        [
          {
            foreignKeyName: 'demo_media_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
        ]
      >;
      demo_evidence: TableShape<
        DemoEvidenceRow,
        InsertShape<
          DemoEvidenceRow,
          'demo_id' | 'evidence_type' | 'description' | 'source_url' | 'verified_at'
        >,
        [
          {
            foreignKeyName: 'demo_evidence_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
        ]
      >;
      favorites: TableShape<
        FavoriteRow,
        InsertShape<FavoriteRow, 'user_id' | 'demo_id'>,
        [
          {
            foreignKeyName: 'favorites_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'favorites_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ],
        never
      >;
      blueprints: TableShape<
        BlueprintRow,
        InsertShape<
          BlueprintRow,
          | 'blueprint_number'
          | 'slug'
          | 'name'
          | 'tagline'
          | 'summary'
          | 'version'
          | 'origin_statement'
          | 'demo_facts'
          | 'target_plan'
        >
      >;
      blueprint_demo_links: TableShape<
        BlueprintDemoLinkRow,
        InsertShape<
          BlueprintDemoLinkRow,
          'blueprint_id' | 'demo_id' | 'relation_kind' | 'disclosure'
        >,
        [
          {
            foreignKeyName: 'blueprint_demo_links_blueprint_id_fkey';
            columns: ['blueprint_id'];
            isOneToOne: false;
            referencedRelation: 'blueprints';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blueprint_demo_links_demo_id_fkey';
            columns: ['demo_id'];
            isOneToOne: false;
            referencedRelation: 'demos';
            referencedColumns: ['id'];
          },
        ]
      >;
      blueprint_deliverables: TableShape<
        BlueprintDeliverableRow,
        InsertShape<
          BlueprintDeliverableRow,
          | 'blueprint_id'
          | 'kind'
          | 'title'
          | 'summary'
          | 'format_label'
          | 'sort_order'
        >,
        [
          {
            foreignKeyName: 'blueprint_deliverables_blueprint_id_fkey';
            columns: ['blueprint_id'];
            isOneToOne: false;
            referencedRelation: 'blueprints';
            referencedColumns: ['id'];
          },
        ]
      >;
      blueprint_runtime_flags: TableShape<
        BlueprintRuntimeFlagRow,
        InsertShape<BlueprintRuntimeFlagRow, 'singleton'>
      >;
      blueprint_resources: TableShape<
        BlueprintResourceRow,
        InsertShape<
          BlueprintResourceRow,
          'blueprint_id' | 'kind' | 'title' | 'summary' | 'content' | 'sort_order'
        >,
        [
          {
            foreignKeyName: 'blueprint_resources_blueprint_id_fkey';
            columns: ['blueprint_id'];
            isOneToOne: false;
            referencedRelation: 'blueprints';
            referencedColumns: ['id'];
          },
        ]
      >;
      blueprint_access_grants: TableShape<
        BlueprintAccessGrantRow,
        InsertShape<BlueprintAccessGrantRow, 'user_id' | 'blueprint_id'>,
        [
          {
            foreignKeyName: 'blueprint_access_grants_blueprint_id_fkey';
            columns: ['blueprint_id'];
            isOneToOne: false;
            referencedRelation: 'blueprints';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'blueprint_access_grants_user_id_fkey';
            columns: ['user_id'];
            isOneToOne: false;
            referencedRelation: 'users';
            referencedColumns: ['id'];
          },
        ]
      >;
    };
    Views: { [_ in never]: never };
    Functions: {
      get_featured_demos: {
        Args: Record<PropertyKey, never>;
        Returns: FeaturedDemoRow[];
      };
      claim_blueprint_pilot: {
        Args: { p_blueprint_slug: string };
        Returns: string;
      };
      has_blueprint_pilot_access: {
        Args: { p_blueprint_id: string };
        Returns: boolean;
      };
      is_blueprint_pilot_enabled: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
      is_blueprint_pilot_visible: {
        Args: { p_blueprint_id: string };
        Returns: boolean;
      };
      is_demo_public: {
        Args: { p_demo_id: string };
        Returns: boolean;
      };
      recalculate_favorite_counts: {
        Args: Record<PropertyKey, never>;
        Returns: number;
      };
      search_demos: {
        Args: {
          p_query?: string | null;
          p_category?: string | null;
          p_tool?: string | null;
          p_difficulty?: string | null;
          p_region?: string | null;
          p_sort?: string | null;
          p_page?: number;
        };
        Returns: SearchDemoRow[];
      };
      set_favorite: {
        Args: { p_demo_id: string; p_favorited: boolean };
        Returns: {
          demo_id: string;
          is_favorited: boolean;
          favorite_count: number | null;
        }[];
      };
    };
    Enums: { [_ in never]: never };
    CompositeTypes: { [_ in never]: never };
  };
};

export type Tables<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Row'];

export type TablesInsert<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Insert'];

export type TablesUpdate<
  TableName extends keyof Database['public']['Tables'],
> = Database['public']['Tables'][TableName]['Update'];
