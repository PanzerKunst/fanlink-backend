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
    user_id integer,
    slug character varying(255), /* only set upon first publication */
    title character varying(255),
    content text NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (user_id, slug),
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE SET NULL
        NOT VALID
  )`
}
