env "local" {
  src = "file://schema/schema.sql"
  url = "sqlite://data/dev.db"
  dev = "sqlite://dev?mode=memory"
  migration {
    dir = "file://migrations"
  }
}

env "production" {
  src = "file://schema/schema.sql"
  url = getenv("TURSO_URL")
  dev = "sqlite://dev?mode=memory"
  migration {
    dir = "file://migrations"
  }
}
