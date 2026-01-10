import { createClient as createNodeClient } from '@libsql/client'
import { createClient as createWebClient } from '@libsql/client/web'
import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin, Kysely } from 'kysely'
import type { DB } from './types'

const databaseUrl = process.env.DATABASE_URL!
const isLocalFile = databaseUrl.startsWith('file:')

const client = isLocalFile
  ? createNodeClient({ url: databaseUrl })
  : createWebClient({
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    })

export const db = new Kysely<DB>({
  // biome-ignore lint/suspicious/noExplicitAny: libsql client types mismatch
  dialect: new LibsqlDialect({ client: client as any }),
  plugins: [new CamelCasePlugin()],
})
