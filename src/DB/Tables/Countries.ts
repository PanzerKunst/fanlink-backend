import { pgSql } from "../DB"

export async function migrateTableCountries() {
  await createTableCountries()
}

async function createTableCountries() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.countries
  (
    id serial NOT NULL,
    name character varying(255) NOT NULL,
    code character varying(8) NOT NULL UNIQUE,
    PRIMARY KEY (id)
  )`
}
