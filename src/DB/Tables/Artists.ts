import { pgSql } from "../DB"

export async function migrateTableArtists() {
  await createTableArtists()
}

async function createTableArtists() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.artists
  (
    id serial,
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    spotify_id character varying(255) NOT NULL UNIQUE,
    name character varying(255) NOT NULL,
    PRIMARY KEY (id)
  )`
}
