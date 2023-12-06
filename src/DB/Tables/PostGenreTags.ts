import { pgSql } from "../DB"

export async function migrateTablePostGenreTags() {
  await createTablePostGenreTags()
}

async function createTablePostGenreTags() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.post_genre_tags
  (
    id serial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_id integer NOT NULL,
    genre_id integer NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (post_id, genre_id),
    FOREIGN KEY (post_id)
        REFERENCES public.posts (id) MATCH SIMPLE
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
