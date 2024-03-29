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
    access_tier integer NOT NULL, /* 0: public, 1: premium subscribers */
    slug character varying(256), /* only set upon first publication */
    title character varying(256),
    hero_image_path character varying(256),
    hero_video_url character varying(256),
    content text NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (user_id, slug),
    FOREIGN KEY (user_id)
        REFERENCES public.users (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
  )`
}
