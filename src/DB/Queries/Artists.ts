import _isEmpty from "lodash/isEmpty"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"
import { db } from "../DB"
import { Artist, NewArtist } from "../../Models/DrizzleModels"
import { artists } from "../_Generated/Drizzle/schema"
import { eq, ilike, inArray } from "drizzle-orm"
import { getAvailableArtistTagName } from "../../Util/DomainUtils"

export async function insertArtist(spotifyArtist: SpotifyArtist): Promise<Artist> {
  const newArtist: NewArtist = {
    spotifyId: spotifyArtist.id,
    name: spotifyArtist.name,
    avatarUrl: spotifyArtist.images[0]?.url || null,
    tagName: await getAvailableArtistTagName(spotifyArtist.name)
  }

  const query = db.insert(artists).values(newArtist)
    .onConflictDoNothing()

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert artist")
  }

  return row
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

export async function selectArtistOfTagName(tagName: string): Promise<Artist | undefined> {
  const rows = await db.select().from(artists)
    .where(ilike(artists.tagName, tagName))
    .limit(1)

  return rows.at(0)
}
