"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.locations = exports.countries = exports.artists = exports.userRepresentingArtists = exports.postGenreTags = exports.postArtistTags = exports.posts = exports.userLocations = exports.enhancedUserFavouriteArtists = exports.userFavouriteArtists = exports.users = exports.musicGenres = exports.artistMusicGenres = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.artistMusicGenres = (0, pg_core_1.pgTable)("artist_music_genres", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    artistId: (0, pg_core_1.integer)("artist_id").notNull().references(() => exports.artists.id, { onDelete: "cascade" }),
    genreId: (0, pg_core_1.integer)("genre_id").notNull().references(() => exports.musicGenres.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        artistMusicGenresArtistIdGenreIdKey: (0, pg_core_1.unique)("artist_music_genres_artist_id_genre_id_key").on(table.artistId, table.genreId),
    };
});
exports.musicGenres = (0, pg_core_1.pgTable)("music_genres", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
}, (table) => {
    return {
        musicGenresNameKey: (0, pg_core_1.unique)("music_genres_name_key").on(table.name),
    };
});
exports.users = (0, pg_core_1.pgTable)("users", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    lastSeenAt: (0, pg_core_1.timestamp)("last_seen_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    spotifyId: (0, pg_core_1.varchar)("spotify_id", { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    username: (0, pg_core_1.varchar)("username", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull(),
}, (table) => {
    return {
        usersSpotifyIdKey: (0, pg_core_1.unique)("users_spotify_id_key").on(table.spotifyId),
        usersUsernameKey: (0, pg_core_1.unique)("users_username_key").on(table.username),
        usersEmailKey: (0, pg_core_1.unique)("users_email_key").on(table.email),
    };
});
exports.userFavouriteArtists = (0, pg_core_1.pgTable)("user_favourite_artists", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    artistId: (0, pg_core_1.integer)("artist_id").notNull().references(() => exports.artists.id, { onDelete: "cascade" }),
    isFollowing: (0, pg_core_1.boolean)("is_following").notNull(),
}, (table) => {
    return {
        userFavouriteArtistsUserIdArtistIdKey: (0, pg_core_1.unique)("user_favourite_artists_user_id_artist_id_key").on(table.userId, table.artistId),
    };
});
exports.enhancedUserFavouriteArtists = (0, pg_core_1.pgTable)("enhanced_user_favourite_artists", {
    id: (0, pg_core_1.integer)("id"),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }),
    userId: (0, pg_core_1.integer)("user_id"),
    artistId: (0, pg_core_1.integer)("artist_id"),
    isFollowing: (0, pg_core_1.boolean)("is_following"),
    spotifyArtistId: (0, pg_core_1.varchar)("spotify_artist_id", { length: 255 }),
    artistName: (0, pg_core_1.varchar)("artist_name", { length: 255 }),
    spotifyUserId: (0, pg_core_1.varchar)("spotify_user_id", { length: 255 }),
    userName: (0, pg_core_1.varchar)("user_name", { length: 255 }),
});
exports.userLocations = (0, pg_core_1.pgTable)("user_locations", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    locationId: (0, pg_core_1.integer)("location_id").notNull().references(() => exports.locations.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        userLocationsUserIdLocationIdKey: (0, pg_core_1.unique)("user_locations_user_id_location_id_key").on(table.userId, table.locationId),
    };
});
exports.posts = (0, pg_core_1.pgTable)("posts", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    publishedAt: (0, pg_core_1.timestamp)("published_at", { withTimezone: true, mode: 'string' }),
    userId: (0, pg_core_1.integer)("user_id").references(() => exports.users.id, { onDelete: "set null" }),
    slug: (0, pg_core_1.varchar)("slug", { length: 255 }),
    title: (0, pg_core_1.varchar)("title", { length: 255 }),
    content: (0, pg_core_1.text)("content").notNull(),
}, (table) => {
    return {
        postsUserIdSlugKey: (0, pg_core_1.unique)("posts_user_id_slug_key").on(table.userId, table.slug),
    };
});
exports.postArtistTags = (0, pg_core_1.pgTable)("post_artist_tags", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    postId: (0, pg_core_1.integer)("post_id").notNull().references(() => exports.posts.id, { onDelete: "cascade" }),
    artistId: (0, pg_core_1.integer)("artist_id").notNull().references(() => exports.artists.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        postArtistTagsPostIdArtistIdKey: (0, pg_core_1.unique)("post_artist_tags_post_id_artist_id_key").on(table.postId, table.artistId),
    };
});
exports.postGenreTags = (0, pg_core_1.pgTable)("post_genre_tags", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    postId: (0, pg_core_1.integer)("post_id").notNull().references(() => exports.posts.id, { onDelete: "cascade" }),
    genreId: (0, pg_core_1.integer)("genre_id").notNull().references(() => exports.musicGenres.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        postGenreTagsPostIdGenreIdKey: (0, pg_core_1.unique)("post_genre_tags_post_id_genre_id_key").on(table.postId, table.genreId),
    };
});
exports.userRepresentingArtists = (0, pg_core_1.pgTable)("user_representing_artists", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    userId: (0, pg_core_1.integer)("user_id").notNull().references(() => exports.users.id, { onDelete: "cascade" }),
    artistId: (0, pg_core_1.integer)("artist_id").notNull().references(() => exports.artists.id, { onDelete: "cascade" }),
}, (table) => {
    return {
        userRepresentingArtistsUserIdArtistIdKey: (0, pg_core_1.unique)("user_representing_artists_user_id_artist_id_key").on(table.userId, table.artistId),
    };
});
exports.artists = (0, pg_core_1.pgTable)("artists", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    spotifyId: (0, pg_core_1.varchar)("spotify_id", { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
}, (table) => {
    return {
        artistsSpotifyIdKey: (0, pg_core_1.unique)("artists_spotify_id_key").on(table.spotifyId),
    };
});
exports.countries = (0, pg_core_1.pgTable)("countries", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    code: (0, pg_core_1.varchar)("code", { length: 8 }).notNull(),
}, (table) => {
    return {
        countriesCodeKey: (0, pg_core_1.unique)("countries_code_key").on(table.code),
    };
});
exports.locations = (0, pg_core_1.pgTable)("locations", {
    id: (0, pg_core_1.serial)("id").primaryKey().notNull(),
    createdAt: (0, pg_core_1.timestamp)("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    updatedAt: (0, pg_core_1.timestamp)("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
    geoapifyPlaceId: (0, pg_core_1.varchar)("geoapify_place_id", { length: 255 }).notNull(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }),
    countryId: (0, pg_core_1.integer)("country_id").notNull().references(() => exports.countries.id, { onDelete: "cascade" }),
    region: (0, pg_core_1.varchar)("region", { length: 255 }),
    state: (0, pg_core_1.varchar)("state", { length: 255 }),
    county: (0, pg_core_1.varchar)("county", { length: 255 }),
    city: (0, pg_core_1.varchar)("city", { length: 255 }),
    municipality: (0, pg_core_1.varchar)("municipality", { length: 255 }),
    postcode: (0, pg_core_1.varchar)("postcode", { length: 255 }),
    suburb: (0, pg_core_1.varchar)("suburb", { length: 255 }),
    lon: (0, pg_core_1.numeric)("lon", { precision: 15, scale: 10 }).notNull(),
    lat: (0, pg_core_1.numeric)("lat", { precision: 15, scale: 10 }).notNull(),
    stateCode: (0, pg_core_1.varchar)("state_code", { length: 8 }),
    stateCog: (0, pg_core_1.varchar)("state_cog", { length: 8 }),
    formatted: (0, pg_core_1.varchar)("formatted", { length: 255 }).notNull(),
    addressLine1: (0, pg_core_1.varchar)("address_line1", { length: 255 }),
    addressLine2: (0, pg_core_1.varchar)("address_line2", { length: 255 }),
    departmentCog: (0, pg_core_1.varchar)("department_cog", { length: 255 }),
    category: (0, pg_core_1.varchar)("category", { length: 255 }).notNull(),
    plusCode: (0, pg_core_1.varchar)("plus_code", { length: 255 }),
    plusCodeShort: (0, pg_core_1.varchar)("plus_code_short", { length: 255 }),
    resultType: (0, pg_core_1.varchar)("result_type", { length: 255 }).notNull(),
}, (table) => {
    return {
        locationsGeoapifyPlaceIdKey: (0, pg_core_1.unique)("locations_geoapify_place_id_key").on(table.geoapifyPlaceId),
    };
});
