// @ts-ignore TS6059: File C:/Pro/fanlink-backend/drizzle/schema.ts is not under rootDir C:/Pro/fanlink-backend/src. rootDir is expected to contain all source files.
import { artistMusicGenres, artists, countries, locations, musicGenres, userFavouriteArtists, userLocations, users } from "../../drizzle/schema"

export type MusicGenre = typeof musicGenres.$inferSelect; // return type when queried
export type NewMusicGenre = typeof musicGenres.$inferInsert; // insert type

export type Artist = typeof artists.$inferSelect;
export type NewArtist = typeof artists.$inferInsert;

export type ArtistMusicGenre = typeof artistMusicGenres.$inferSelect;
export type NewArtistMusicGenre = typeof artistMusicGenres.$inferInsert;

export type Country = typeof countries.$inferSelect;
export type NewCountry = typeof countries.$inferInsert;

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;

export type UserFavouriteArtist = typeof userFavouriteArtists.$inferSelect;
export type NewUserFavouriteArtist = typeof userFavouriteArtists.$inferInsert;

export type UserLocation = typeof userLocations.$inferSelect;
export type NewUserLocation = typeof userLocations.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
