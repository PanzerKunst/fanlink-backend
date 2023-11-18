import { pgSql } from "../DB"

export async function migrateTableUserFavouriteArtists() {
  await createTableUserFavouriteArtists()
  await addColumnsSpotifyUserIdSpotifyArtistId()
}

async function createTableUserFavouriteArtists() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.user_favourite_artists
  (
    id serial,
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    user_id integer NOT NULL,
    artist_id integer NOT NULL,
    is_following boolean NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
      REFERENCES public.users (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
      NOT VALID,
    FOREIGN KEY (artist_id)
      REFERENCES public.artists (id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE
      NOT VALID
  )`
}

async function addColumnsSpotifyUserIdSpotifyArtistId() {
  let rows = await pgSql`
  SELECT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_favourite_artists'
    AND column_name = 'spotify_user_id'
  )`

  let row = rows.pop()

  if (!row?.exists) {
    await pgSql`
    ALTER TABLE IF EXISTS public.user_favourite_artists
      ADD COLUMN spotify_user_id character varying(255) NOT NULL`

    await pgSql`
    ALTER TABLE IF EXISTS public.user_favourite_artists
      ADD FOREIGN KEY (spotify_user_id)
      REFERENCES public.users (spotify_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE`

    await pgSql`
    CREATE INDEX IF NOT EXISTS fk_spotify_user_id
      ON public.user_favourite_artists(spotify_user_id)`
  }

  rows = await pgSql`
  SELECT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'user_favourite_artists'
    AND column_name = 'spotify_artist_id'
  )`

  row = rows.pop()

  if (!row?.exists) {
    await pgSql`
    ALTER TABLE IF EXISTS public.user_favourite_artists
      ADD COLUMN spotify_artist_id character varying(255) NOT NULL`

    await pgSql`
    ALTER TABLE IF EXISTS public.user_favourite_artists
      ADD FOREIGN KEY (spotify_artist_id)
      REFERENCES public.artists (spotify_id) MATCH SIMPLE
      ON UPDATE NO ACTION
      ON DELETE CASCADE`

    await pgSql`
    CREATE INDEX IF NOT EXISTS fk_spotify_artist_id
      ON public.user_favourite_artists(spotify_artist_id)`
  }
}
