import { db } from '../app/services/db.server'
import { templates } from '../app/services/lp-templates'

async function seedTemplates() {
  console.log('Seeding templates...')

  for (const template of templates) {
    const existing = await db
      .selectFrom('lpTemplates')
      .selectAll()
      .where('id', '=', template.id)
      .executeTakeFirst()

    if (!existing) {
      await db
        .insertInto('lpTemplates')
        .values({
          id: template.id,
          name: template.name,
          description: template.description || '',
          thumbnailUrl: template.thumbnail_url || null,
          baseHtml: template.base_html,
          defaultConfig: JSON.stringify(template.default_config),
          category: template.category,
          isActive: 1,
        })
        .execute()
      console.log(`Template "${template.name}" created`)
    } else {
      console.log(`Template "${template.name}" already exists`)
    }
  }

  await db.destroy()
  console.log('Templates seeded successfully')
}

seedTemplates().catch(console.error)
