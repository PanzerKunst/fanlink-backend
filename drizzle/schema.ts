import { pgTable, unique, serial, timestamp, varchar, foreignKey, integer, boolean } from "drizzle-orm/pg-core"

import { sql } from "drizzle-orm"


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