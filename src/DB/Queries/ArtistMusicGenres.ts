import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { artistMusicGenres } from "../_Generated/Drizzle/schema"
import { Artist, MusicGenre, NewArtistMusicGenre } from "../../Models/DrizzleModels"

export async function insertArtistMusicGenres(artist: Artist, genres: MusicGenre[]) {
  if (_isEmpty(genres)) {
    return
  }

  const artistMusicGenresToInsert: NewArtistMusicGenre[] = genres.map((genre) => ({
    artistId: artist.id,
    genreId: genre.id
  }))

  await db.insert(artistMusicGenres).values(artistMusicGenresToInsert)
    .onConflictDoNothing()
}

/* export async function selectMusicGenresForArtist(artist: Artist): Promise<MusicGenre[]> {
  const artistGenres: ArtistMusicGenre[] = await db.select().from(artistMusicGenres)
    .where(eq(artistMusicGenres.artistId, artist.id))

  return await selectMusicGenresOfIds(artistGenres.map((artistGenre) => artistGenre.genreId))
}

export async function selectMusicGenresForArtists(artists: Artist[]): Promise<ArtistWithGenres[]> {
  const genrePromises = artists.map(async (artist: Artist) => {
    const artistGenres: MusicGenre[] = await selectMusicGenresForArtist(artist)

    return {
      artist: artist,
      genres: artistGenres
    }
  })

  return Promise.all(genrePromises)
} */
