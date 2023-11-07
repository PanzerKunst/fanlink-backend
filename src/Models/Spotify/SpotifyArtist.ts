import { SpotifyExternalUrls } from "./SpotifyExternalUrls"
import { SpotifyFollowers } from "./SpotifyFollowers"
import { SpotifyMedia } from "./SpotifyMedia"

export type SpotifyArtist = {
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  genres: string[];
  href: string;
  id: string;
  images: SpotifyMedia[];
  name: string;
  popularity: number;
  uri: string;
}
