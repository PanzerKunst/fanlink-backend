import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { userFavouriteArtists } from "../_Generated/Drizzle/schema"
import { Artist, NewUserFavouriteArtist, User, UserFavouriteArtist } from "../../Models/DrizzleModels"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"
import { and, eq, inArray, sql } from "drizzle-orm"

export async function insertFavouriteArtists(
  user: User,
  favouriteArtists: Artist[],
  followedArtists: SpotifyArtist[]
): Promise<UserFavouriteArtist[]> {
  if (_isEmpty(favouriteArtists)) {
    return []
  }

  const userFavouriteArtistsToInsert: NewUserFavouriteArtist[] = favouriteArtists.map((favouriteArtist) => ({
    userId: user.id,
    artistId: favouriteArtist.id,
    isFollowing: followedArtists.some((followedArtist) => followedArtist.id === favouriteArtist.spotifyId)
  }))

  const query = db.insert(userFavouriteArtists).values(userFavouriteArtistsToInsert)
    .onConflictDoNothing()

  return query.returning()
}

export async function selectArtistIdsFollowedByUser(userId: number): Promise<number[]> {
  const followedArtists: UserFavouriteArtist[] = await db.select().from(userFavouriteArtists)
    .where(and(
      eq(userFavouriteArtists.userId, userId),
      eq(userFavouriteArtists.isFollowing, true)
    ))

  return followedArtists.map((userFavouriteArtist) => userFavouriteArtist.artistId)
}

export async function updateFollowedArtists(
  user: User,
  currentlyFollowedArtistIds: number[],
  newFollowedArtists: Artist[]
): Promise<number[]> {
  const unfollowedArtistIds = currentlyFollowedArtistIds.filter((artistId) => !newFollowedArtists.some((artist) => artist.id === artistId))

  const query = db.update(userFavouriteArtists)
    .set({
      updatedAt: sql`CURRENT_TIMESTAMP`,
      isFollowing: false
    })
    .where(and(
      eq(userFavouriteArtists.userId, user.id),
      inArray(userFavouriteArtists.artistId, unfollowedArtistIds)
    ))

  const updatedRows = await query.returning()

  return updatedRows.map((userFavouriteArtist) => userFavouriteArtist.artistId)
}
