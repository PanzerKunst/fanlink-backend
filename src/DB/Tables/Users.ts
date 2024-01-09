import { pgSql } from "../DB"

export async function migrateTableUsers() {
  await createTableUsers()
  await addColumnEmail()
}

async function createTableUsers() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.users
  (
    id serial,
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    last_seen_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    spotify_id character varying(256) NOT NULL UNIQUE,
    name character varying(256) NOT NULL,
    username character varying(256) NOT NULL UNIQUE,
    PRIMARY KEY (id)
  )`
}

async function addColumnEmail() {
  const rows = await pgSql`
  SELECT EXISTS (
    SELECT FROM information_schema.columns
    WHERE table_schema = 'public'
    AND table_name = 'users'
    AND column_name = 'email'
  )`

  const row = rows.pop()

  if (row?.exists) {
    return
  }
  
  await pgSql`
  ALTER TABLE IF EXISTS public.users
    ADD COLUMN email character varying(256) NOT NULL UNIQUE,
    ADD COLUMN avatar_url character varying(512)`
}
