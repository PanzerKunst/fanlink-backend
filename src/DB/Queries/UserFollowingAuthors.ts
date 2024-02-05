import { db } from "../DB"
import { userFollowingAuthors } from "../_Generated/Drizzle/schema"
import { NewUserFollowingAuthor, User, UserFollowingAuthor } from "../../Models/DrizzleModels"
import { and, eq, inArray } from "drizzle-orm"

export async function insertUserFollowingAuthor(user: User, followedAuthor: User) {
  const userFollowingAuthorToInsert: NewUserFollowingAuthor = {
    userId: user.id,
    followedUserId: followedAuthor.id
  }

  await db.insert(userFollowingAuthors).values(userFollowingAuthorToInsert)
    .onConflictDoNothing()
}

export async function selectAuthorIdsFollowedByUser(userId: number): Promise<number[]> {
  const followedAuthors: UserFollowingAuthor[] = await db.select().from(userFollowingAuthors)
    .where(eq(userFollowingAuthors.userId, userId))

  return followedAuthors.map((userFollowingArtist) => userFollowingArtist.followedUserId)
}

export async function deleteSelectedFollowedAuthors(user: User, authorsToDelete: User[] ) {
  const userIdsToDelete = authorsToDelete.map((user) => user.id)

  await db.delete(userFollowingAuthors)
    .where(and(
      eq(userFollowingAuthors.userId, user.id),
      inArray(userFollowingAuthors.userId, userIdsToDelete)
    ))
}

export async function deleteAllFollowedAuthorsForUser(user: User) {
  await db.delete(userFollowingAuthors)
    .where(eq(userFollowingAuthors.userId, user.id))
}
