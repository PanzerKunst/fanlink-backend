import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { userFavouriteArtists } from "../_Generated/Drizzle/schema"
import { Artist, NewUserFavouriteArtist, User, UserFavouriteArtist } from "../../Models/DrizzleModels"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"

export async function insertUserFavouriteArtists(
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
