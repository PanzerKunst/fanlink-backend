import { db } from "../DB"
import { SpotifyUserProfile } from "../../Models/Spotify/SpotifyUserProfile"
import { eq } from "drizzle-orm"
import { users } from "../../../drizzle/schema"
import { User } from "../../Models/DrizzleModels"

export async function insertUser(spotifyUserProfile: SpotifyUserProfile): Promise<User> {
  const query = db.insert(users).values({
    spotifyId: spotifyUserProfile.id,
    name: spotifyUserProfile.display_name,
    email: spotifyUserProfile.email,
  })

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert user")
  }

  return row
}

export async function selectUserOfSpotifyId(spotifyId: string): Promise<User | undefined> {
  const rows = await db.select().from(users)
    .where(eq(users.spotifyId, spotifyId))
    .limit(1)

  return rows.at(0)
}
