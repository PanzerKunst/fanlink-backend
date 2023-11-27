import { boolean, integer, numeric, pgTable, serial, timestamp, unique, varchar } from "drizzle-orm/pg-core"


export const locations = pgTable("locations", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	geoapifyPlaceId: varchar("geoapify_place_id", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }),
	countryId: integer("country_id").notNull().references(() => countries.id, { onDelete: "cascade" } ),
	region: varchar("region", { length: 255 }),
	state: varchar("state", { length: 255 }),
	county: varchar("county", { length: 255 }),
	city: varchar("city", { length: 255 }),
	municipality: varchar("municipality", { length: 255 }),
	postcode: varchar("postcode", { length: 255 }),
	suburb: varchar("suburb", { length: 255 }),
	lon: numeric("lon", { precision: 15, scale:  10 }).notNull(),
	lat: numeric("lat", { precision: 15, scale:  10 }).notNull(),
	stateCode: varchar("state_code", { length: 255 }),
	stateCog: varchar("state_cog", { length: 255 }),
	formatted: varchar("formatted", { length: 255 }).notNull(),
	addressLine1: varchar("address_line1", { length: 255 }),
	addressLine2: varchar("address_line2", { length: 255 }),
	departmentCog: varchar("department_cog", { length: 255 }),
	category: varchar("category", { length: 255 }).notNull(),
	plusCode: varchar("plus_code", { length: 255 }),
	plusCodeShort: varchar("plus_code_short", { length: 8 }),
	resultType: varchar("result_type", { length: 255 }).notNull(),
},
(table) => {
	return {
		locationsGeoapifyPlaceIdKey: unique("locations_geoapify_place_id_key").on(table.geoapifyPlaceId),
	}
});

export const userLocations = pgTable("user_locations", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	locationId: integer("location_id").notNull().references(() => locations.id, { onDelete: "cascade" } ),
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	spotifyId: varchar("spotify_id", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	username: varchar("username", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
},
(table) => {
	return {
		usersSpotifyIdKey: unique("users_spotify_id_key").on(table.spotifyId),
		usersUsernameKey: unique("users_username_key").on(table.username),
		usersEmailKey: unique("users_email_key").on(table.email),
	}
});

export const userFavouriteArtists = pgTable("user_favourite_artists", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	artistId: integer("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" } ),
	isFollowing: boolean("is_following").notNull(),
});

export const artists = pgTable("artists", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	spotifyId: varchar("spotify_id", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
},
(table) => {
	return {
		artistsSpotifyIdKey: unique("artists_spotify_id_key").on(table.spotifyId),
	}
});

export const enhancedUserFavouriteArtists = pgTable("enhanced_user_favourite_artists", {
	id: integer("id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id"),
	artistId: integer("artist_id"),
	isFollowing: boolean("is_following"),
	spotifyArtistId: varchar("spotify_artist_id", { length: 255 }),
	artistName: varchar("artist_name", { length: 255 }),
	spotifyUserId: varchar("spotify_user_id", { length: 255 }),
	userName: varchar("user_name", { length: 255 }),
});

export const countries = pgTable("countries", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	code: varchar("code", { length: 8 }).notNull(),
},
(table) => {
	return {
		countriesCodeKey: unique("countries_code_key").on(table.code),
	}
});