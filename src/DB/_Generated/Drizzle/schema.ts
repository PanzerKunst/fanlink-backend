import { pgTable, foreignKey, unique, serial, timestamp, integer, boolean, varchar, text, numeric } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"


export const userFavouriteArtists = pgTable("user_favourite_artists", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	artistId: integer("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" } ),
	isFollowing: boolean("is_following").notNull(),
},
(table) => {
	return {
		userFavouriteArtistsUserIdArtistIdKey: unique("user_favourite_artists_user_id_artist_id_key").on(table.userId, table.artistId),
	}
});

export const artistMusicGenres = pgTable("artist_music_genres", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	artistId: integer("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" } ),
	genreId: integer("genre_id").notNull().references(() => musicGenres.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		artistMusicGenresArtistIdGenreIdKey: unique("artist_music_genres_artist_id_genre_id_key").on(table.artistId, table.genreId),
	}
});

export const enhancedUserFavouriteArtists = pgTable("enhanced_user_favourite_artists", {
	id: integer("id"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id"),
	artistId: integer("artist_id"),
	isFollowing: boolean("is_following"),
	spotifyArtistId: varchar("spotify_artist_id", { length: 256 }),
	artistName: varchar("artist_name", { length: 128 }),
	spotifyUserId: varchar("spotify_user_id", { length: 256 }),
	userName: varchar("user_name", { length: 256 }),
});

export const userLocations = pgTable("user_locations", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	locationId: integer("location_id").notNull().references(() => locations.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		userLocationsUserIdLocationIdKey: unique("user_locations_user_id_location_id_key").on(table.userId, table.locationId),
	}
});

export const postArtistTags = pgTable("post_artist_tags", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	postId: integer("post_id").notNull().references(() => posts.id, { onDelete: "cascade" } ),
	artistId: integer("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		postArtistTagsPostIdArtistIdKey: unique("post_artist_tags_post_id_artist_id_key").on(table.postId, table.artistId),
	}
});

export const posts = pgTable("posts", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	publishedAt: timestamp("published_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id").references(() => users.id, { onDelete: "set null" } ),
	slug: varchar("slug", { length: 256 }),
	title: varchar("title", { length: 256 }),
	heroImagePath: varchar("hero_image_path", { length: 256 }),
	heroVideoUrl: varchar("hero_video_url", { length: 256 }),
	content: text("content").notNull(),
},
(table) => {
	return {
		postsUserIdSlugKey: unique("posts_user_id_slug_key").on(table.userId, table.slug),
	}
});

export const userRepresentingArtists = pgTable("user_representing_artists", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	artistId: integer("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" } ),
},
(table) => {
	return {
		userRepresentingArtistsUserIdArtistIdKey: unique("user_representing_artists_user_id_artist_id_key").on(table.userId, table.artistId),
	}
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	lastSeenAt: timestamp("last_seen_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	spotifyId: varchar("spotify_id", { length: 256 }).notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	username: varchar("username", { length: 256 }).notNull(),
	email: varchar("email", { length: 256 }).notNull(),
	avatarUrl: varchar("avatar_url", { length: 512 }),
},
(table) => {
	return {
		usersSpotifyIdKey: unique("users_spotify_id_key").on(table.spotifyId),
		usersUsernameKey: unique("users_username_key").on(table.username),
		usersEmailKey: unique("users_email_key").on(table.email),
	}
});

export const countries = pgTable("countries", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
	code: varchar("code", { length: 8 }).notNull(),
},
(table) => {
	return {
		countriesCodeKey: unique("countries_code_key").on(table.code),
	}
});

export const locations = pgTable("locations", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	geoapifyPlaceId: varchar("geoapify_place_id", { length: 256 }).notNull(),
	name: varchar("name", { length: 256 }),
	countryId: integer("country_id").notNull().references(() => countries.id, { onDelete: "cascade" } ),
	region: varchar("region", { length: 256 }),
	state: varchar("state", { length: 256 }),
	county: varchar("county", { length: 256 }),
	city: varchar("city", { length: 256 }),
	municipality: varchar("municipality", { length: 256 }),
	postcode: varchar("postcode", { length: 256 }),
	suburb: varchar("suburb", { length: 256 }),
	lon: numeric("lon", { precision: 15, scale:  10 }).notNull(),
	lat: numeric("lat", { precision: 15, scale:  10 }).notNull(),
	stateCode: varchar("state_code", { length: 8 }),
	stateCog: varchar("state_cog", { length: 8 }),
	formatted: varchar("formatted", { length: 256 }).notNull(),
	addressLine1: varchar("address_line1", { length: 256 }),
	addressLine2: varchar("address_line2", { length: 256 }),
	departmentCog: varchar("department_cog", { length: 256 }),
	category: varchar("category", { length: 256 }).notNull(),
	plusCode: varchar("plus_code", { length: 256 }),
	plusCodeShort: varchar("plus_code_short", { length: 256 }),
	resultType: varchar("result_type", { length: 256 }).notNull(),
},
(table) => {
	return {
		locationsGeoapifyPlaceIdKey: unique("locations_geoapify_place_id_key").on(table.geoapifyPlaceId),
	}
});

export const artists = pgTable("artists", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	spotifyId: varchar("spotify_id", { length: 256 }).notNull(),
	name: varchar("name", { length: 128 }).notNull(),
	tagName: varchar("tag_name", { length: 128 }).notNull(),
},
(table) => {
	return {
		artistsSpotifyIdKey: unique("artists_spotify_id_key").on(table.spotifyId),
	}
});

export const musicGenres = pgTable("music_genres", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	name: varchar("name", { length: 256 }).notNull(),
},
(table) => {
	return {
		musicGenresNameKey: unique("music_genres_name_key").on(table.name),
	}
});