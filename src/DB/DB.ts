import postgres from "postgres"
import { config } from "../config"
import { createTableArtists } from "./Schema/Artists"
import { createTableUsers } from "./Schema/Users"
import { createTableUserArtists } from "./Schema/UserArtists"

export const sql = postgres(config.DATABASE_URL, { debug: true })

/* export async function migrateDb(): Promise<void> {
  const migrationClient = postgres(config.DATABASE_URL, { max: 1 })
  await migrate(drizzle(migrationClient), { migrationsFolder: "drizzle" })
  console.log("Database migrated")
}

export const db = drizzle(sql) */

export async function migrateDb(): Promise<void> {
  await createTableArtists()
  await createTableUsers()
  await createTableUserArtists()

  console.log("Database migrated")
}
