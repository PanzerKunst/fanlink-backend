import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { userFavouriteArtists } from "../_Generated/Drizzle/schema"
import { Artist, NewUserFavouriteArtist, User, UserFavouriteArtist } from "../../Models/DrizzleModels"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"
import { and, eq, inArray } from "drizzle-orm"

export async function insertFavouriteArtists(user: User, favouriteArtists: Artist[], followedArtists: SpotifyArtist[]) {
  if (_isEmpty(favouriteArtists)) {
    return
  }

  const userFavouriteArtistsToInsert: NewUserFavouriteArtist[] = favouriteArtists.map((favouriteArtist) => ({
    userId: user.id,
    artistId: favouriteArtist.id,
    isFollowing: followedArtists.some((followedArtist) => followedArtist.id === favouriteArtist.spotifyId)
  }))

  await db.insert(userFavouriteArtists).values(userFavouriteArtistsToInsert)
    .onConflictDoNothing()
}

export async function selectArtistIdsFollowedByUser(userId: number): Promise<number[]> {
  const followedArtists: UserFavouriteArtist[] = await db.select().from(userFavouriteArtists)
    .where(and(
      eq(userFavouriteArtists.userId, userId),
      eq(userFavouriteArtists.isFollowing, true)
    ))

  return followedArtists.map((userFavouriteArtist) => userFavouriteArtist.artistId)
}

export async function deleteAllFavouriteArtistsForUser(user: User) {
  await db.delete(userFavouriteArtists)
    .where(eq(userFavouriteArtists.userId, user.id))
}

export async function deleteSelectedFavouriteArtists(user: User, artistsToDelete: Artist[]) {
  const artistIdsToDelete = artistsToDelete.map((artist) => artist.id)

  await db.delete(userFavouriteArtists)
    .where(and(
      eq(userFavouriteArtists.userId, user.id),
      inArray(userFavouriteArtists.artistId, artistIdsToDelete)
    ))
}
