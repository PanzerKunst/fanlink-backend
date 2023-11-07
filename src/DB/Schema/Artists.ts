import { Artist } from "../../Models/Artist"
import { sql } from "../DB"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"

export async function createTableArtists() {
  await sql`
  CREATE TABLE IF NOT EXISTS public.artists
  (
    id serial,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    spotify_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (spotify_id)
  )`
}

export async function insertArtist(spotifyArtist: SpotifyArtist): Promise<Artist> {
  const rows = await sql`
  INSERT INTO artists (spotify_id, name, created_at)
  VALUES (${spotifyArtist.id}, ${spotifyArtist.name}, CURRENT_TIMESTAMP)
  RETURNING id, spotify_id, name, created_at`

  const row = rows.pop()

  if (!row) {
    throw new Error("Failed to insert artist")
  }

  /* return {
    id: row.id,
    spotify_id: row.spotify_id,
    name: row.name,
  } as Artist */

  return row as Artist
}

export async function insertArtists(spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  // @ts-ignore TS2769: No overload matches this call.
  const rows = await sql`INSERT INTO artists (spotify_id, name, created_at) VALUES ${sql(spotifyArtists.map(artist => [artist.id, artist.name, sql`CURRENT_TIMESTAMP`]))}
  RETURNING id, spotify_id, name, created_at`

  return rows.map((row) => row as Artist)
}

export async function selectArtistsNotYetStored(spotifyArtists: SpotifyArtist[]): Promise<SpotifyArtist[]> {
  const rows = await sql`
  SELECT spotify_id
  FROM artists
  WHERE spotify_id IN (${spotifyArtists.map((spotifyArtist) => spotifyArtist.id)})`

  const spotifyIds = rows.map((row) => row.spotify_id)

  return spotifyArtists.filter((spotifyArtist) => !spotifyIds.includes(spotifyArtist.id))
}

export async function selectArtistOfSpotifyId(spotifyId: string): Promise<Artist | undefined> {
  const rows = await sql`
  SELECT id, spotify_id, name
  FROM artists
  WHERE spotify_id = ${spotifyId}
  LIMIT 1`

  const row = rows.pop()

  if (!row) {
    return undefined
  }

  /* return {
    id: row.id,
    spotifyId: row.spotify_id,
    name: row.name,
  } as Artist */

  return row as Artist
}

/* export const artists = pgTable("artists", {
  id: serial("id").primaryKey(),
  spotifyId: varchar("spotify_id", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
})

type Artist = typeof artists.$inferSelect; // return type when queried
type NewArtist = typeof artists.$inferInsert; // insert type

export async function getAllArtists(): Promise<Artist[]> {
  return db.select().from(artists)
}

export async function insertArtist(artist: NewArtist): Promise<Artist[]> {
  return db.insert(artists).values(artist).returning()
} */
