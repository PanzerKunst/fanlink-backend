import _isEmpty from "lodash/isEmpty"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"
import { db } from "../DB"
import { Artist, NewArtist } from "../../Models/DrizzleModels"
import { artists } from "../_Generated/Drizzle/schema"
import { eq, inArray } from "drizzle-orm"

export async function insertArtists(spotifyArtists: SpotifyArtist[]): Promise<Artist[]> {
  if (_isEmpty(spotifyArtists)) {
    return []
  }

  const artistsToInsert: NewArtist[] = spotifyArtists.map((spotifyArtist) => ({
    spotifyId: spotifyArtist.id,
    name: spotifyArtist.name
  }))

  const query = db.insert(artists).values(artistsToInsert)
    .onConflictDoNothing()

  return query.returning()
}

export async function selectArtistsOfIds(ids: number[]): Promise<Artist[]> {
  if (_isEmpty(ids)) {
    return []
  }

  return db.select().from(artists)
    .where(inArray(artists.id, ids))
}

export async function selectArtistOfSpotifyId(spotifyId: string): Promise<Artist | undefined> {
  const rows = await db.select().from(artists)
    .where(eq(artists.spotifyId, spotifyId))
    .limit(1)

  return rows.at(0)
}

export async function selectArtistsOfSpotifyIds(spotifyArtistIds: string[]): Promise<Artist[]> {
  if (_isEmpty(spotifyArtistIds)) {
    return []
  }

  return db.select().from(artists)
    .where(inArray(artists.spotifyId, spotifyArtistIds))
}
