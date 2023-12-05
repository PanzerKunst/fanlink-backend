import { NewPost, Post } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { posts } from "../../../drizzle/schema"
import { eq } from "drizzle-orm"

export async function insertPost(newPost: NewPost): Promise<Post> {
  const query = db.insert(posts).values(newPost)
    .onConflictDoNothing()

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert post")
  }

  return row
}

export async function selectPostOfId(id: number): Promise<Post | undefined> {
  const rows = await db.select().from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  return rows.at(0)
}
