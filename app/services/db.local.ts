import { createClient } from '@libsql/client'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin, Kysely } from 'kysely'
import type { DB } from './types'

// ローカル開発用SQLite
export const client = createClient({
  url: 'file:./local.db',
})

export const db = new Kysely<DB>({
  dialect: new LibsqlDialect({
    // biome-ignore lint/suspicious/noExplicitAny: libsql client type mismatch
    client: client as any,
  }),
  plugins: [new CamelCasePlugin()],
})