import type { Kysely } from 'kysely'

// biome-ignore lint/suspicious/noExplicitAny: kysely migrations do not have types for db
export async function up(db: Kysely<any>): Promise<void> {
  // Add metadata column to landing_pages table
  await db.schema
    .alterTable('landing_pages')
    .addColumn('metadata', 'jsonb', (col) =>
      col.defaultTo(
        JSON.stringify({
          mainCopy: '',
          subCopy: '',
          ctaText: '詳しく見る',
          ctaUrl: '#',
          subDescription: '',
          ogDescription: '',
          formattedStory: '',
          brandMessage: '',
        }),
      ),
    )
    .execute()
}

// biome-ignore lint/suspicious/noExplicitAny: kysely migrations do not have types for db
export async function down(db: Kysely<any>): Promise<void> {
  await db.schema.alterTable('landing_pages').dropColumn('metadata').execute()
}
