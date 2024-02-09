import { Artist } from "../DrizzleModels"

export type ArtistWithFollowStatus = {
  artist: Artist;
  isFollowed: boolean;
}
