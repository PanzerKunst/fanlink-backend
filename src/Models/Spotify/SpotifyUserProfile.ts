import { SpotifyExternalUrls } from "./SpotifyExternalUrls"
import { SpotifyFollowers } from "./SpotifyFollowers"
import { SpotifyMedia } from "./SpotifyMedia"

export type SpotifyUserProfile = {
  country: string;
  display_name: string;
  email: string;
  explicit_content?: {
    filter_enabled: boolean,
    filter_locked: boolean
  },
  external_urls: SpotifyExternalUrls;
  followers: SpotifyFollowers;
  href: string;
  id: string;
  images: SpotifyMedia[];
  product: string;
  type: string;
  uri: string;
}
