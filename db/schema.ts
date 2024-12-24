import { createId } from '@paralleldrive/cuid2'
import { sql } from 'drizzle-orm'
import { sqliteTable, text } from 'drizzle-orm/sqlite-core'
export const copies = sqliteTable(
  'copies',
  {
    id: text().primaryKey().$defaultFn(createId),
    copy: text(),
    product: text(),
    category: text(),
    createdAt: text().default(sql`(CURRENT_TIMESTAMP)`),
  },
  () => [],
)
