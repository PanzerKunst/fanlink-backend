import { db } from "../DB"
import { eq } from "drizzle-orm"
import { users } from "../../../drizzle/schema"
import { NewUser, User } from "../../Models/DrizzleModels"

export async function insertUser(newUser: NewUser): Promise<User> {
  const query = db.insert(users).values(newUser)
    .onConflictDoNothing()

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert user")
  }

  return row
}

export async function selectUserOfId(id: number): Promise<User | undefined> {
  const rows = await db.select().from(users)
    .where(eq(users.id, id))
    .limit(1)

  return rows.at(0)
}

export async function selectUserOfSpotifyId(spotifyId: string): Promise<User | undefined> {
  const rows = await db.select().from(users)
    .where(eq(users.spotifyId, spotifyId))
    .limit(1)

  return rows.at(0)
}

export async function selectUserOfUsername(username: string): Promise<User | undefined> {
  const rows = await db.select().from(users)
    .where(eq(users.username, username))
    .limit(1)

  return rows.at(0)
}
