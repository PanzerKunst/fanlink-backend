import { pgTable, index, foreignKey, serial, timestamp, integer, boolean, varchar, unique } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"


export const userFavouriteArtists = pgTable("user_favourite_artists", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	userId: integer("user_id").notNull().references(() => users.id, { onDelete: "cascade" } ),
	artistId: integer("artist_id").notNull().references(() => artists.id, { onDelete: "cascade" } ),
	isFollowing: boolean("is_following").notNull(),
	spotifyUserId: varchar("spotify_user_id", { length: 255 }).notNull().references(() => users.spotifyId, { onDelete: "cascade" } ),
	spotifyArtistId: varchar("spotify_artist_id", { length: 255 }).notNull().references(() => artists.spotifyId, { onDelete: "cascade" } ),
},
(table) => {
	return {
		fkSpotifyUserId: index("fk_spotify_user_id").on(table.spotifyUserId),
		fkSpotifyArtistId: index("fk_spotify_artist_id").on(table.spotifyArtistId),
	}
});

export const users = pgTable("users", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	spotifyId: varchar("spotify_id", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull(),
},
(table) => {
	return {
		usersSpotifyIdKey: unique("users_spotify_id_key").on(table.spotifyId),
		usersEmailKey: unique("users_email_key").on(table.email),
	}
});

export const artists = pgTable("artists", {
	id: serial("id").primaryKey().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	spotifyId: varchar("spotify_id", { length: 255 }).notNull(),
	name: varchar("name", { length: 255 }).notNull(),
},
(table) => {
	return {
		artistsSpotifyIdKey: unique("artists_spotify_id_key").on(table.spotifyId),
	}
});