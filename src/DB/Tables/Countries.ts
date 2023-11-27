import { pgSql } from "../DB"

export async function migrateTableCountries() {
  await createTableCountries()
}

async function createTableCountries() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.countries
  (
    id serial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    name character varying(255) NOT NULL,
    code character varying(8) NOT NULL UNIQUE,
    PRIMARY KEY (id)
  )`
}
