import { sql, type Kysely } from 'kysely'

// biome-ignore lint/suspicious/noExplicitAny: kysely migrations do not have types for db
export async function up(db: Kysely<any>): Promise<void> {
  // Create landing_pages table
  await db.schema
    .createTable('landing_pages')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('generation_log_id', 'text', (col) => col.notNull())
    .addColumn('template_id', 'text', (col) => col.notNull())
    .addColumn('title', 'text', (col) => col.notNull())
    .addColumn('selected_copies', 'jsonb', (col) => col.notNull())
    .addColumn('config', 'jsonb', (col) => col.notNull())
    .addColumn('html_content', 'text')
    .addColumn('is_public', 'boolean', (col) => col.defaultTo(true))
    .addColumn('share_url', 'text', (col) => col.unique())
    .addColumn('og_image_url', 'text')
    .addColumn('view_count', 'integer', (col) => col.defaultTo(0))
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('updated_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .addColumn('deleted_at', 'timestamp')
    .execute()

  // Create lp_templates table
  await db.schema
    .createTable('lp_templates')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('name', 'text', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('thumbnail_url', 'text')
    .addColumn('base_html', 'text', (col) => col.notNull())
    .addColumn('default_config', 'jsonb', (col) => col.notNull())
    .addColumn('category', 'text')
    .addColumn('is_active', 'boolean', (col) => col.defaultTo(true))
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  // Create lp_views table
  await db.schema
    .createTable('lp_views')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('landing_page_id', 'text', (col) => col.notNull())
    .addColumn('ip_address', 'text')
    .addColumn('user_agent', 'text')
    .addColumn('referrer', 'text')
    .addColumn('viewed_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()

  // Create indexes
  await db.schema
    .createIndex('idx_landing_pages_generation_log_id')
    .on('landing_pages')
    .column('generation_log_id')
    .execute()

  await db.schema
    .createIndex('idx_landing_pages_share_url')
    .on('landing_pages')
    .column('share_url')
    .execute()

  await db.schema
    .createIndex('idx_lp_views_landing_page_id')
    .on('lp_views')
    .column('landing_page_id')
    .execute()
}

// biome-ignore lint/suspicious/noExplicitAny: kysely migrations do not have types for db
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('lp_views').ifExists().execute()
  await db.schema.dropTable('lp_templates').ifExists().execute()
  await db.schema.dropTable('landing_pages').ifExists().execute()
}
