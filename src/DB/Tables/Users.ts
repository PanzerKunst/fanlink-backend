import { sql } from "../DB"

export async function migrateTableUsers() {
  await createTableUsers()
  await addColumnEmail()
}

async function createTableUsers() {
  await sql`
  CREATE TABLE IF NOT EXISTS public.users
  (
    id serial,
    created_at timestamp with time zone NOT NULL default CURRENT_TIMESTAMP,
    updated_at timestamp with time zone,
    spotify_id character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE (spotify_id)
  )`
}

async function addColumnEmail() {
  const rows = await sql`
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
  
  await sql`
  ALTER TABLE IF EXISTS public.users
    ADD COLUMN email character varying(255) NOT NULL UNIQUE`
}
