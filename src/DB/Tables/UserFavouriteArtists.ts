import { pgSql } from "../DB"

export async function migrateTableUserFavouriteArtists() {
  await createTableUserFavouriteArtists()
  await createViewEnhancedUserFavouriteArtists()
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

async function createViewEnhancedUserFavouriteArtists() {
  const rows = await pgSql`
  SELECT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'enhanced_user_favourite_artists'
  )`

  const row = rows.pop()

  if (row?.exists) {
    return
  }

  await pgSql`
  CREATE VIEW public.enhanced_user_favourite_artists AS
  SELECT ufa.id,
    ufa.created_at,
    ufa.updated_at,
    ufa.user_id,
    ufa.artist_id,
    ufa.is_following,
    a.spotify_id AS spotify_artist_id,
    u.spotify_id AS spotify_user_id
  FROM public.user_favourite_artists ufa
  INNER JOIN public.artists a ON ufa.artist_id = a.id
  INNER JOIN public.users u ON ufa.user_id = u.id`
}
