import { Artist, User } from "../DrizzleModels"

export type UserWithFollowedArtistsAndAuthors = {
  user: User;
  followedArtists: Artist[];
  followedAuthors: User[];
}
