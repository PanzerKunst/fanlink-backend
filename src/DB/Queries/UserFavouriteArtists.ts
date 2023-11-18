import { SpotifyUserProfile } from "../../Models/Spotify/SpotifyUserProfile"
import { SpotifyArtist } from "../../Models/Spotify/SpotifyArtist"
import { db } from "../DB"
import { userFavouriteArtists } from "../../../drizzle/schema"
import { sql } from "drizzle-orm"

export async function selectUserFavouriteArtistsNotYetStored(
  spotifyUserProfile: SpotifyUserProfile,
  spotifyArtists: SpotifyArtist[]
): Promise<SpotifyArtist[]> {
  const spotifyArtistIds = spotifyArtists.map((spotifyArtist) => spotifyArtist.id)

  const rows = await db.select().from(userFavouriteArtists)
    .where(sql`${userFavouriteArtists.spotifyUserId} = ${spotifyUserProfile.id} and ${userFavouriteArtists.spotifyArtistId} in ${spotifyArtistIds}`)

  const storedSpotifyArtistIds: string[] = rows.map((row) => row.spotifyArtistId)

  return spotifyArtists.filter((spotifyArtist) => !storedSpotifyArtistIds.includes(spotifyArtist.id))
}
