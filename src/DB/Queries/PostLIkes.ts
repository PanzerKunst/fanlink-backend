import { db } from "../DB"
import { postLikes } from "../_Generated/Drizzle/schema"
import { NewPostLike, PostLike } from "../../Models/DrizzleModels"
import { and, eq } from "drizzle-orm"

export async function insertPostLike(postId: number, userId: number) {
  const newPostLike: NewPostLike = { postId, userId }

  await db.insert(postLikes).values(newPostLike)
    .onConflictDoNothing()
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
