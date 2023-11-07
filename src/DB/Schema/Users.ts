import { sql } from "../DB"

export async function createTableUsers() {
  await sql`
  CREATE TABLE IF NOT EXISTS public.users
  (
    id serial,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone,
    spotify_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (spotify_id)
  )`
}
