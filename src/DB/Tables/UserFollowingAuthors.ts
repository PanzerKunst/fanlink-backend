import { pgSql } from "../DB"

export async function migrateTableUserFollowingAuthors() {
  await createTableUserFollowingAuthors()
}

async function createTableUserFollowingAuthors() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.user_following_authors
  (
    id serial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    user_id integer NOT NULL,
    followed_user_id integer NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (user_id, followed_user_id),
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID,
    FOREIGN KEY (followed_user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
  )`
}
