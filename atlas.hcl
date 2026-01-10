variable "database_url" {
  type    = string
  default = getenv("DATABASE_URL")
}

env "local" {
  src = "file://schema/schema.sql"
  url = var.database_url
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
