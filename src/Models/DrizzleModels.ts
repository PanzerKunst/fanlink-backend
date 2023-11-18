// @ts-ignore TS6059: File C:/Pro/fanlink-backend/drizzle/schema.ts is not under rootDir C:/Pro/fanlink-backend/src. rootDir is expected to contain all source files.
import { artists, userFavouriteArtists, users } from "../../drizzle/schema"

export type Artist = typeof artists.$inferSelect; // return type when queried
export type NewArtist = typeof artists.$inferInsert; // insert type

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type UserFavouriteArtist = typeof userFavouriteArtists.$inferSelect;
export type NewUserFavouriteArtist = typeof userFavouriteArtists.$inferInsert;
