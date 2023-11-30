import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { artistMusicGenres } from "../../../drizzle/schema"
import { sql } from "drizzle-orm"
import { Artist, ArtistMusicGenre, MusicGenre, NewArtistMusicGenre } from "../../Models/DrizzleModels"

export async function selectArtistMusicGenresNotYetStored(artist: Artist, genres: MusicGenre[]): Promise<MusicGenre[]> {
  const genreIds = genres.map((genre) => genre.id)

  const rows = await db.select().from(artistMusicGenres)
    .where(sql`${artistMusicGenres.artistId} = ${artist.id}
        and ${artistMusicGenres.genreId} in ${genreIds}`)

  const storedGenreIdsForArtist: number[] = rows.map((row) => row.genreId)

  return genres.filter((genre) => !storedGenreIdsForArtist.includes(genre.id))
}

export async function insertArtistMusicGenres(
  artist: Artist,
  genres: MusicGenre[]
): Promise<ArtistMusicGenre[]> {
  if (_isEmpty(genres)) {
    return []
  }

  const artistMusicGenresToInsert: NewArtistMusicGenre[] = genres.map((genre) => ({
    artistId: artist.id,
    genreId: genre.id
  }))

  const query = db.insert(artistMusicGenres).values(artistMusicGenresToInsert)

  return query.returning()
}
