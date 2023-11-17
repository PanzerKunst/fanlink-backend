import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"
import { db } from "../DB"
import { Artist, NewArtist } from "../../Models/DrizzleModels"
import { artists } from "../../../drizzle/schema"
import { eq, inArray } from "drizzle-orm"

/* export async function insertArtist(spotifyArtist: SpotifyArtist): Promise<Artist> {
  const rows = await sql`
  INSERT INTO artists (spotify_id, name, created_at)
  VALUES (${spotifyArtist.id}, ${spotifyArtist.name}, CURRENT_TIMESTAMP)
  RETURNING id, spotify_id, name, created_at`

  const row = rows.pop()

  if (!row) {
    throw new Error("Failed to insert artist")
  }

  return row as Artist
} */

export async function insertArtist(spotifyArtist: SpotifyArtist): Promise<Artist> {
  const query = db.insert(artists).values({
    spotifyId: spotifyArtist.id,
    name: spotifyArtist.name,
  })

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert artist")
  }

  return row
}

/* export async function insertArtists(spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  if (spotifyArtists.length === 0) {
    return []
  }

  // @ts-ignore TS2769: No overload matches this call.
  const rows = await sql`INSERT INTO artists (spotify_id, name, created_at) VALUES ${sql(spotifyArtists.map(artist => [artist.id, artist.name, sql`CURRENT_TIMESTAMP`]))}
  RETURNING id, spotify_id, name, created_at`

  return rows.map((row) => row as Artist)
} */

export async function insertArtists(spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  if (spotifyArtists.length === 0) {
    return []
  }

  const artistsToInsert: NewArtist[] = spotifyArtists.map((spotifyArtist) => ({
    spotifyId: spotifyArtist.id,
    name: spotifyArtist.name
  }))

  const query = db.insert(artists).values(artistsToInsert)

  return query.returning()
}

/* export async function selectArtistsNotYetStored(spotifyArtists: SpotifyArtist[]): Promise<SpotifyArtist[]> {
  const spotifyArtistIds = spotifyArtists.map((spotifyArtist) => spotifyArtist.id)

  const rows = await sql`
  SELECT spotify_id
  FROM artists
  WHERE spotify_id IN ${ sql(spotifyArtistIds) }`

  const spotifyIds: string[] = rows.map((row) => row.spotify_id)

  return spotifyArtists.filter((spotifyArtist) => !spotifyIds.includes(spotifyArtist.id))
} */

export async function selectArtistsNotYetStored(spotifyArtists: SpotifyArtist[]): Promise<SpotifyArtist[]> {
  const spotifyArtistIds = spotifyArtists.map((spotifyArtist) => spotifyArtist.id)

  const rows = await db.select().from(artists)
    .where(inArray(artists.spotifyId, spotifyArtistIds))

  const spotifyIds: string[] = rows.map((row) => row.spotifyId)

  return spotifyArtists.filter((spotifyArtist) => !spotifyIds.includes(spotifyArtist.id))
}

/* export async function selectArtistOfSpotifyId(spotifyId: string): Promise<Artist | undefined> {
  const rows = await sql`
  SELECT id, spotify_id, name, created_at, updated_at
  FROM artists
  WHERE spotify_id = ${spotifyId}
  LIMIT 1`

  const row = rows.pop()

  if (!row) {
    return undefined
  }

  return row as Artist
} */


export async function selectArtistOfSpotifyId(spotifyId: string): Promise<Artist | undefined> {
  const rows = await db.select().from(artists)
    .where(eq(artists.spotifyId, spotifyId))
    .limit(1)

  return rows.at(0)
}
