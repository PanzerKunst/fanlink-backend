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
import { migrateTablePosts } from "./Tables/Posts"
import { migrateTableUserRepresentingArtists } from "./Tables/UserRepresentingArtists"
import { migrateTablePostArtistTags } from "./Tables/PostArtistTags"
import { migrateTablePostGenreTags } from "./Tables/PostGenreTags"

const connectionOptions = config.IS_PROD ? {
  debug: true,
  ssl: { rejectUnauthorized: false }
} : {
  debug: true
}

export const pgSql = postgres(config.DATABASE_URL, connectionOptions)
export const db = drizzle(pgSql, { logger: !config.IS_PROD })

export async function migrateDb(): Promise<void> {
  await migrateTableMusicGenres()
  await migrateTableArtists()
  await migrateTableCountries()
  await migrateTableLocations()
  await migrateTableUsers()
  await migrateTableArtistMusicGenres()
  await migrateTableUserFavouriteArtists()
  await migrateTableUserLocations()
  await migrateTablePosts()
  await migrateTablePostArtistTags()
  await migrateTablePostGenreTags()
  await migrateTableUserRepresentingArtists()

  console.log("Database migrated")
}
