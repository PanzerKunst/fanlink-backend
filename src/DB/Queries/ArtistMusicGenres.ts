import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { artistMusicGenres } from "../../../drizzle/schema"
import { eq } from "drizzle-orm"
import { Artist, ArtistMusicGenre, MusicGenre, NewArtistMusicGenre } from "../../Models/DrizzleModels"
import { selectMusicGenresOfIds } from "./MusicGenres"
import { ArtistWithGenres } from "../../Models/Backend/ArtistWithGenres"

export async function insertArtistMusicGenres(artist: Artist, genres: MusicGenre[]): Promise<ArtistMusicGenre[]> {
  if (_isEmpty(genres)) {
    return []
  }

  const artistMusicGenresToInsert: NewArtistMusicGenre[] = genres.map((genre) => ({
    artistId: artist.id,
    genreId: genre.id
  }))

  const query = db.insert(artistMusicGenres).values(artistMusicGenresToInsert)
    .onConflictDoNothing()

  return query.returning()
}

export async function selectMusicGenresForArtist(artist: Artist): Promise<MusicGenre[]> {
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
}
