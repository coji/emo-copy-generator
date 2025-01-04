import { createClient } from '@libsql/client/web'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin, Kysely } from 'kysely'
import type { DB } from './types'

export const db = new Kysely<DB>({
  dialect: new LibsqlDialect({
    client: createClient({
      url: process.env.DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN,
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    }) as any,
  }),
  plugins: [new CamelCasePlugin()],
})
