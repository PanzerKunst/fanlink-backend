import { db } from "../DB"
import { postLikes } from "../_Generated/Drizzle/schema"
import { NewPostLike, PostLike } from "../../Models/DrizzleModels"
import { and, eq } from "drizzle-orm"

export async function insertPostLike(postId: number, userId: number): Promise<PostLike> {
  const newPostLike: NewPostLike = { postId, userId }

  const query = db.insert(postLikes).values(newPostLike)
    .onConflictDoNothing()

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert post like")
  }

  return row
}

export async function deletePostLike(postId: number, userId: number): Promise<void> {
  await db.delete(postLikes)
    .where(and(
      eq(postLikes.postId, postId),
      eq(postLikes.userId, userId)
    ))
}

export async function selectPostLikes(postId: number): Promise<PostLike[]> {
  return db.select().from(postLikes)
    .where(eq(postLikes.postId, postId))
}
