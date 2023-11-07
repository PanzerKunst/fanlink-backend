/* export type NewArtist = {
  spotifyId: string;
  name: string;
}

export type Artist = NewArtist & {
  id: number;
} */

export type NewArtist = {
  spotify_id: string;
  name: string;
}

export type Artist = NewArtist & {
  id: number;
  created_at: Date;
  updated_at?: Date;
}
