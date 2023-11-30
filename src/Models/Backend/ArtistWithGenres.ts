import { Artist, MusicGenre } from "../DrizzleModels"

export type ArtistWithGenres = {
  artist: Artist,
  genres: MusicGenre[]
}
