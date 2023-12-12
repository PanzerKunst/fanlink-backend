import { pgSql } from "../DB"

export async function migrateTableUserRepresentingArtists() {
  await createTableUserRepresentingArtists()
}

async function createTableUserRepresentingArtists() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.user_representing_artists
  (
    id serial,
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    user_id integer NOT NULL,
    artist_id integer NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (user_id, artist_id),
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
