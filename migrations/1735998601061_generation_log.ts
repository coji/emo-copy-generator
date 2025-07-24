import { sql, type Kysely } from 'kysely'

// biome-ignore lint/suspicious/noExplicitAny: kysely migrations do not have types for db
export async function up(db: Kysely<any>): Promise<void> {
  // up migration code goes here...
  // note: up migrations are mandatory. you must implement this function.
  // For more info, see: https://kysely.dev/docs/migrations
  await db.schema
    .createTable('generation_logs')
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('product_name', 'text', (col) => col.notNull())
    .addColumn('product_category', 'text', (col) => col.notNull())
    .addColumn('brand_images', 'jsonb', (col) => col.notNull())
    .addColumn('target_user_image', 'text', (col) => col.notNull())
    .addColumn('story', 'text')
    .addColumn('candidates', 'jsonb')
    .addColumn('provider', 'text', (col) => col.notNull())
    .addColumn('model_name', 'text', (col) => col.notNull())
    .addColumn('temperature', 'real', (col) => col.notNull())
    .addColumn('prompt', 'text', (col) => col.notNull())
    .addColumn('usage_prompt_tokens', 'real', (col) => col.notNull())
    .addColumn('usage_completion_tokens', 'real', (col) => col.notNull())
    .addColumn('usage_total_tokens', 'real', (col) => col.notNull())
    .addColumn('created_at', 'timestamp', (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`),
    )
    .execute()
}

// biome-ignore lint/suspicious/noExplicitAny: kysely migrations do not have types for db
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.dropTable('generation_logs').ifExists().execute()
}
