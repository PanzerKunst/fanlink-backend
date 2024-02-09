import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { userFavouriteArtists } from "../_Generated/Drizzle/schema"
import { Artist, NewUserFavouriteArtist, User, UserFavouriteArtist } from "../../Models/DrizzleModels"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"
import { and, eq, sql } from "drizzle-orm"
import { ArtistWithFollowStatus } from "../../Models/Backend/ArtistWithMore"

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

export async function selectFavouriteArtists(userId: number): Promise<UserFavouriteArtist[]> {
  return db.select().from(userFavouriteArtists)
    .where(eq(userFavouriteArtists.userId, userId))
}

export async function deleteAllFavouriteArtistsForUser(user: User) {
  await db.delete(userFavouriteArtists)
    .where(eq(userFavouriteArtists.userId, user.id))
}

export async function updateUserFavouriteArtist(user: User, artistWithFollowStatus: ArtistWithFollowStatus) {
  const { artist, isFollowed } = artistWithFollowStatus

  await db.update(userFavouriteArtists)
    .set({
      updatedAt: sql`CURRENT_TIMESTAMP`,
      isFollowing: isFollowed
    })
    .where(and(
      eq(userFavouriteArtists.userId, user.id),
      eq(userFavouriteArtists.artistId, artist.id)
    ))
}
