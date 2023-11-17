import { sql } from "../DB"

export async function migrateTableUserFavouriteArtists() {
  await createTableUserFavouriteArtists()
}

async function createTableUserFavouriteArtists() {
  await sql`
  CREATE TABLE IF NOT EXISTS public."userFavouriteArtists"
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
