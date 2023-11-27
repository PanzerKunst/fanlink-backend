import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { config } from "../config"
import { migrateTableArtists } from "./Tables/Artists"
import { migrateTableUsers } from "./Tables/Users"
import { migrateTableUserFavouriteArtists } from "./Tables/UserFavouriteArtists"

const connectionOptions = config.IS_PROD ? {
  debug: true,
  ssl: { rejectUnauthorized: false }
} : {
  debug: true
}

export const pgSql = postgres(config.DATABASE_URL, connectionOptions)
export const db = drizzle(pgSql/* TODO , { logger: true }*/)

export async function migrateDb(): Promise<void> {
  await migrateTableArtists()
  await migrateTableUsers()
  await migrateTableUserFavouriteArtists()

  console.log("Database migrated")
}
