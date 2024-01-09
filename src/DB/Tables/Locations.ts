import { pgSql } from "../DB"

export async function migrateTableLocations() {
  await createTableLocations()
}

async function createTableLocations() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.locations
  (
    id serial,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geoapify_place_id character varying(256) NOT NULL UNIQUE,
    name character varying(256),
    country_id integer NOT NULL,
    region character varying(256),
    state character varying(256),
    county character varying(256),
    city character varying(256),
    municipality character varying(256),
    postcode character varying(256),
    suburb character varying(256),
    lon numeric(15, 10) NOT NULL,
    lat numeric(15, 10) NOT NULL,
    state_code character varying(8),
    state_cog character varying(8),
    formatted character varying(256) NOT NULL,
    address_line1 character varying(256),
    address_line2 character varying(256),
    department_cog character varying(256),
    category character varying(256) NOT NULL,
    plus_code character varying(256),
    plus_code_short character varying(256),
    result_type character varying(256) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (country_id)
        REFERENCES public.countries (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
  )`
}
