import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { artistMusicGenres, userFavouriteArtists } from "../../../drizzle/schema"
import { sql } from "drizzle-orm"
import { Artist, MusicGenre, NewUserFavouriteArtist, User, UserFavouriteArtist } from "../../Models/DrizzleModels"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"

export async function selectArtistMusicGenresNotYetStored(artist: Artist, genres: MusicGenre[]): Promise<MusicGenre[]> {
  const genreIds = genres.map((genre) => genre.id)

  const rows = await db.select().from(artistMusicGenres)
    .where(sql`${artistMusicGenres.artistId} = ${artist.id}
        and ${artistMusicGenres.genreId} in ${genreIds}`)

  const storedGenreIdsForArtist: number[] = rows.map((row) => row.genreId)

  return genres.filter((genre) => !storedGenreIdsForArtist.includes(genre.id))
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
