import { drizzle } from "drizzle-orm/postgres-js"
import postgres from "postgres"
import { config } from "../config"
import { migrateTableArtists } from "./Tables/Artists"
import { migrateTableUsers } from "./Tables/Users"
import { migrateTableUserFavouriteArtists } from "./Tables/UserFavouriteArtists"
import { migrateTableLocations } from "./Tables/Locations"
import { migrateTableCountries } from "./Tables/Countries"
import { migrateTableUserLocations } from "./Tables/UserLocations"
import { migrateTableMusicGenres } from "./Tables/MusicGenres"
import { migrateTableArtistMusicGenres } from "./Tables/ArtistMusicGenres"

const connectionOptions = config.IS_PROD ? {
  debug: true,
  ssl: { rejectUnauthorized: false }
} : {
  debug: true
}

export const pgSql = postgres(config.DATABASE_URL, connectionOptions)
export const db = drizzle(pgSql,/* TODO  { logger: true } */)

export async function migrateDb(): Promise<void> {
  await migrateTableMusicGenres()
  await migrateTableArtists()
  await migrateTableArtistMusicGenres()
  await migrateTableUsers()
  await migrateTableUserFavouriteArtists()
  await migrateTableCountries()
  await migrateTableLocations()
  await migrateTableUserLocations()

  console.log("Database migrated")
}
