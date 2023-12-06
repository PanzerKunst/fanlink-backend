import { pgSql } from "../DB"

export async function migrateTablePostArtistTags() {
  await createTablePostArtistTags()
}

async function createTablePostArtistTags() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.post_artist_tags
  (
    id serial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_id integer NOT NULL,
    artist_id integer NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (post_id, artist_id),
    FOREIGN KEY (post_id)
        REFERENCES public.posts (id) MATCH SIMPLE
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
