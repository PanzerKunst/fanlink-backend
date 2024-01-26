import { pgSql } from "../DB"

export async function migrateTablePostLikes() {
  await createTablePostLikes()
}

async function createTablePostLikes() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.post_likes
  (
    id bigserial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    post_id integer NOT NULL,
    user_id integer NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (post_id, user_id),
    FOREIGN KEY (post_id)
        REFERENCES public.posts (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
  )`
}
