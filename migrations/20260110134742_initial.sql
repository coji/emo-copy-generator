-- Create "generation_logs" table
CREATE TABLE `generation_logs` (
  `id` text NULL,
  `product_name` text NOT NULL,
  `product_category` text NOT NULL,
  `brand_images` jsonb NOT NULL,
  `target_user_image` text NOT NULL,
  `story` text NULL,
  `candidates` jsonb NULL,
  `provider` text NOT NULL,
  `model_name` text NOT NULL,
  `temperature` real NOT NULL,
  `prompt` text NOT NULL,
  `usage_prompt_tokens` real NOT NULL,
  `usage_completion_tokens` real NOT NULL,
  `usage_total_tokens` real NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (`id`)
);
-- Create "landing_pages" table
CREATE TABLE `landing_pages` (
  `id` text NULL,
  `generation_log_id` text NOT NULL,
  `template_id` text NOT NULL,
  `title` text NOT NULL,
  `selected_copies` jsonb NOT NULL,
  `config` jsonb NOT NULL,
  `html_content` text NULL,
  `is_public` boolean NULL DEFAULT TRUE,
  `share_url` text NULL,
  `og_image_url` text NULL,
  `view_count` integer NULL DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `updated_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  `deleted_at` timestamp NULL,
  PRIMARY KEY (`id`)
);
-- Create index "landing_pages_share_url" to table: "landing_pages"
CREATE UNIQUE INDEX `landing_pages_share_url` ON `landing_pages` (`share_url`);
-- Create index "idx_landing_pages_generation_log_id" to table: "landing_pages"
CREATE INDEX `idx_landing_pages_generation_log_id` ON `landing_pages` (`generation_log_id`);
-- Create index "idx_landing_pages_share_url" to table: "landing_pages"
CREATE INDEX `idx_landing_pages_share_url` ON `landing_pages` (`share_url`);
-- Create "lp_templates" table
CREATE TABLE `lp_templates` (
  `id` text NULL,
  `name` text NOT NULL,
  `description` text NULL,
  `thumbnail_url` text NULL,
  `base_html` text NOT NULL,
  `default_config` jsonb NOT NULL,
  `category` text NULL,
  `is_active` boolean NULL DEFAULT TRUE,
  `created_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (`id`)
);
-- Create "lp_views" table
CREATE TABLE `lp_views` (
  `id` text NULL,
  `landing_page_id` text NOT NULL,
  `ip_address` text NULL,
  `user_agent` text NULL,
  `referrer` text NULL,
  `viewed_at` timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP),
  PRIMARY KEY (`id`)
);
-- Create index "idx_lp_views_landing_page_id" to table: "lp_views"
CREATE INDEX `idx_lp_views_landing_page_id` ON `lp_views` (`landing_page_id`);
