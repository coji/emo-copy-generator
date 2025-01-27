import { LibsqlDialect } from '@libsql/kysely-libsql'
import { CamelCasePlugin } from 'kysely'
import { defineConfig } from 'kysely-ctl'

export default defineConfig({
  dialect: new LibsqlDialect({
    url: process.env.DATABASE_URL ?? '',
  }),
  $production: {
    dialect: new LibsqlDialect({
      url: process.env.TURSO_URL ?? '',
      authToken: process.env.TURSO_AUTH_TOKEN,
    }),
  },
  plugins: [new CamelCasePlugin()],
})
