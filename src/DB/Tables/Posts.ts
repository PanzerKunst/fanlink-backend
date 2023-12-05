import { pgSql } from "../DB"

export async function migrateTablePosts() {
  await createTablePosts()
}

async function createTablePosts() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.posts
  (
    id serial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at timestamp with time zone,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    content text NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
  )`
}
