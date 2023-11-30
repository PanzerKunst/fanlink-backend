import { pgSql } from "../DB"

export async function migrateTableArtistMusicGenres() {
  await createTableArtistMusicGenres()
}

async function createTableArtistMusicGenres() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.artist_music_genres
  (
    id serial,
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    artist_id integer NOT NULL,
    genre_id integer NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (artist_id)
      REFERENCES public.artists (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
      NOT VALID,
    FOREIGN KEY (genre_id)
      REFERENCES public.music_genres (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
      NOT VALID
  )`
}
