// @ts-ignore TS6059: File C:/Pro/fanlink-backend/drizzle/schema.ts is not under rootDir C:/Pro/fanlink-backend/src. rootDir is expected to contain all source files.
import { artists, countries, locations, userFavouriteArtists, userLocations, users } from "../../drizzle/schema"

export type Artist = typeof artists.$inferSelect; // return type when queried
export type NewArtist = typeof artists.$inferInsert; // insert type

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
