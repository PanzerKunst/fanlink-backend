import { sql } from "../DB"

export async function createTableUserArtists() {
  await sql`
  CREATE TABLE IF NOT EXISTS public."userArtists"
  (
    id serial,
    user_id integer NOT NULL,
    artist_id integer NOT NULL,
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
