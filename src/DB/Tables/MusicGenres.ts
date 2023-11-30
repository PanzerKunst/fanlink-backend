import { pgSql } from "../DB"

export async function migrateTableMusicGenres() {
  await createTableMusicGenres()
}

async function createTableMusicGenres() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.music_genres
  (
    id serial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name character varying(255) NOT NULL UNIQUE,
    PRIMARY KEY (id)
  )`
}
