import { db } from "../DB"
import { userFollowingAuthors } from "../_Generated/Drizzle/schema"
import { NewUserFollowingAuthor, User, UserFollowingAuthor } from "../../Models/DrizzleModels"
import { and, eq, inArray } from "drizzle-orm"

export async function insertUserFollowingAuthor(user: User, followedAuthor: User): Promise<UserFollowingAuthor[]> {
  const userFollowingAuthorToInsert: NewUserFollowingAuthor = {
    userId: user.id,
    followedUserId: followedAuthor.id
  }

  const query = db.insert(userFollowingAuthors).values(userFollowingAuthorToInsert)
    .onConflictDoNothing()

  return query.returning()
}

export async function selectAuthorIdsFollowedByUser(userId: number): Promise<number[]> {
  const followedAuthors: UserFollowingAuthor[] = await db.select().from(userFollowingAuthors)
    .where(eq(userFollowingAuthors.userId, userId))

  return followedAuthors.map((userFollowingArtist) => userFollowingArtist.followedUserId)
}

export async function updateFollowedAuthors(
  user: User,
  currentlyFollowedAuthorIds: number[],
  newFollowedAuthors: User[]
): Promise<number[]> {
  const unfollowedAuthorIds = currentlyFollowedAuthorIds.filter((authorId) => !newFollowedAuthors.some((author) => author.id === authorId))

  const query = db.delete(userFollowingAuthors)
    .where(and(
      eq(userFollowingAuthors.userId, user.id),
      inArray(userFollowingAuthors.followedUserId, unfollowedAuthorIds)
    ))

  const deletedRows = await query.returning()

  return deletedRows.map((userFollowingAuthor) => userFollowingAuthor.followedUserId)
}
