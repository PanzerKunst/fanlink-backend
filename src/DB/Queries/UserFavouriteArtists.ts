import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { userFavouriteArtists } from "../../../drizzle/schema"
import { sql } from "drizzle-orm"
import { Artist, NewUserFavouriteArtist, User, UserFavouriteArtist } from "../../Models/DrizzleModels"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"

export async function selectUserFavouriteArtistsNotYetStored(user: User, artists: Artist[]): Promise<Artist[]> {
  const artistIds = artists.map((artist) => artist.id)

  const rows = await db.select().from(userFavouriteArtists)
    .where(sql`${userFavouriteArtists.userId} = ${user.id}
        and ${userFavouriteArtists.artistId} in ${artistIds}`)

  const storedFavouriteArtistIds: number[] = rows.map((row) => row.artistId)

  return artists.filter((artist) => !storedFavouriteArtistIds.includes(artist.id))
}

export async function insertUserFavouriteArtists(
  user: User,
  favouriteArtists: Artist[],
  followedSpotifyArtists: SpotifyArtist[]
): Promise<UserFavouriteArtist[]> {
  if (_isEmpty(favouriteArtists)) {
    return []
  }

  const userFavouriteArtistsToInsert: NewUserFavouriteArtist[] = favouriteArtists.map((favouriteArtist) => ({
    userId: user.id,
    artistId: favouriteArtist.id,
    isFollowing: followedSpotifyArtists.some((followedSpotifyArtist) => followedSpotifyArtist.id === favouriteArtist.spotifyId)
  }))

  const query = db.insert(userFavouriteArtists).values(userFavouriteArtistsToInsert)

  return query.returning()
}
