import { pgSql } from "../DB"

export async function migrateTableLocations() {
  await createTableLocations()
}

async function createTableLocations() {
  await pgSql`
  CREATE TABLE IF NOT EXISTS public.locations
  (
    id serial NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp with time zone NOT NULL DEFAULT CURRENT_TIMESTAMP,
    geoapify_place_id character varying(255) NOT NULL UNIQUE,
    name character varying(255),
    country_id integer NOT NULL,
    region character varying(255),
    state character varying(255),
    county character varying(255),
    city character varying(255),
    municipality character varying(255),
    postcode character varying(255),
    suburb character varying(255),
    lon numeric(15, 10) NOT NULL,
    lat numeric(15, 10) NOT NULL,
    state_code character varying(255),
    state_cog character varying(255),
    formatted character varying(255) NOT NULL,
    address_line1 character varying(255),
    address_line2 character varying(255),
    department_cog character varying(255),
    category character varying(255) NOT NULL,
    plus_code character varying(255),
    plus_code_short character varying(8),
    result_type character varying(255) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (country_id)
        REFERENCES public.countries (id) MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE CASCADE
        NOT VALID
  )`
}
