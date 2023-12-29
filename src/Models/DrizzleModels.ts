import {
  artistMusicGenres,
  artists,
  countries,
  locations,
  musicGenres, postArtistTags,
  posts,
  userFavouriteArtists,
  userLocations,
  userRepresentingArtists,
  users
// @ts-ignore TS6059: File C:/Pro/fanlink-backend/drizzle/schema.ts is not under rootDir C:/Pro/fanlink-backend/src.
} from "../../drizzle/schema"

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

export type Post = typeof posts.$inferSelect;
export type NewPost = typeof posts.$inferInsert;

export type PostArtistTag = typeof postArtistTags.$inferSelect;
export type NewPostArtistTag = typeof postArtistTags.$inferInsert;

export type UserRepresentingArtist = typeof userRepresentingArtists.$inferSelect;
export type NewUserRepresentingArtist = typeof userRepresentingArtists.$inferInsert;
