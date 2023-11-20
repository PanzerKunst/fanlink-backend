import { isEmpty as _isEmpty } from "lodash"
import { db } from "../DB"
import { userFavouriteArtists } from "../../../drizzle/schema"
import { sql } from "drizzle-orm"
import { Artist, NewUserFavouriteArtist, User, UserFavouriteArtist } from "../../Models/DrizzleModels"

export async function selectUserFavouriteArtistsNotYetStored(user: User, artists: Artist[]): Promise<Artist[]> {
  const artistIds = artists.map((artist) => artist.id)

  const rows = await db.select().from(userFavouriteArtists)
    .where(sql`${userFavouriteArtists.userId} = ${user.id}
        and ${userFavouriteArtists.artistId} in ${artistIds}`)

  const storedFavouriteArtistIds: number[] = rows.map((row) => row.artistId)

  return artists.filter((artist) => !storedFavouriteArtistIds.includes(artist.id))
}

export async function insertUserFavouriteArtists(user: User, artists: Artist[]): Promise<UserFavouriteArtist[]> {
  if (_isEmpty(artists)) {
    return []
  }

  const userFavouriteArtistsToInsert: NewUserFavouriteArtist[] = artists.map((artist) => ({
    userId: user.id,
    artistId: artist.id,
    isFollowing: true
  }))

  const query = db.insert(userFavouriteArtists).values(userFavouriteArtistsToInsert)

  return query.returning()
}
