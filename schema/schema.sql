-- Generation logs table
CREATE TABLE generation_logs (
  id TEXT PRIMARY KEY,
  product_name TEXT NOT NULL,
  product_category TEXT NOT NULL,
  brand_images JSONB NOT NULL,
  target_user_image TEXT NOT NULL,
  story TEXT,
  candidates JSONB,
  provider TEXT NOT NULL,
  model_name TEXT NOT NULL,
  temperature REAL NOT NULL,
  prompt TEXT NOT NULL,
  usage_prompt_tokens REAL NOT NULL,
  usage_completion_tokens REAL NOT NULL,
  usage_total_tokens REAL NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Landing pages table
CREATE TABLE landing_pages (
  id TEXT PRIMARY KEY,
  generation_log_id TEXT NOT NULL,
  template_id TEXT NOT NULL,
  title TEXT NOT NULL,
  selected_copies JSONB NOT NULL,
  config JSONB NOT NULL,
  html_content TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  share_url TEXT UNIQUE,
  og_image_url TEXT,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  deleted_at TIMESTAMP
);

-- LP templates table
CREATE TABLE lp_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  base_html TEXT NOT NULL,
  default_config JSONB NOT NULL,
  category TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- LP views table
CREATE TABLE lp_views (
  id TEXT PRIMARY KEY,
  landing_page_id TEXT NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  referrer TEXT,
  viewed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_landing_pages_generation_log_id ON landing_pages (generation_log_id);
CREATE INDEX idx_landing_pages_share_url ON landing_pages (share_url);
CREATE INDEX idx_lp_views_landing_page_id ON lp_views (landing_page_id);
