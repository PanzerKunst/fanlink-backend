import { User } from "../DrizzleModels"
import { ArtistWithFollowStatus } from "./ArtistWithMore"

export type UserWithFavouriteArtistsAndAuthors = {
  user: User;
  favouriteArtists: ArtistWithFollowStatus[];
  followedAuthors: User[];
}
