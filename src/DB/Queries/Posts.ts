import { NewPost, Post } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { posts } from "../_Generated/Drizzle/schema"
import { and, desc, eq, inArray, isNull, lt, or, sql } from "drizzle-orm"
import _isEmpty from "lodash/isEmpty"
import { getPostSlug } from "../../Util/DomainUtils"

const postFetchPageSize = 10

export async function insertPost(newPost: NewPost): Promise<Post> {
  const titleForDb = !_isEmpty(newPost.title) ? newPost.title! : null // Replacing "" by null

  const newPostForDb: NewPost = {
    ...newPost,
    accessTier: 0,
    title: titleForDb
  }

  const query = db.insert(posts).values(newPostForDb)
    .onConflictDoNothing()

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert post")
  }

  return row
}

export async function updatePost(post: Post): Promise<Post> {
  const titleForDb = !_isEmpty(post.title) ? post.title! : null // Replacing "" by null

  const query = db.update(posts)
    .set({
      updatedAt: sql`CURRENT_TIMESTAMP`,
      publishedAt: post.publishedAt,
      accessTier: post.accessTier,
      title: titleForDb,
      content: post.content,
      heroImagePath: post.heroImagePath || null,
      heroVideoUrl: post.heroVideoUrl || null,
    })
    .where(eq(posts.id, post.id))

  const updatedRows = await query.returning()
  const updatedRow = updatedRows.at(0)

  if (!updatedRow) {
    throw new Error("Failed to update post")
  }

  return updatedRow
}

export async function updatePostPublicationSettingsAndSlug(post: Post, isPublishing: boolean): Promise<Post> {
  let slug = post.slug

  // We never change the slug once set
  if (!slug) {
    slug = getPostSlug(post.content, post.title)

    // If an existing post already has this slug, we add the current timestamp at the end
    const existingPostForThisSlug = await selectPostOfUserAndSlug(post.userId!, slug)

    if (existingPostForThisSlug) {
      const timestamp = Date.now()
      slug = `${slug}-${timestamp}`
    }
  }

  const query = db.update(posts)
    .set({
      updatedAt: sql`CURRENT_TIMESTAMP`,
      publishedAt: isPublishing ? sql`CURRENT_TIMESTAMP` : null,
      accessTier: post.accessTier,
      slug
    })
    .where(eq(posts.id, post.id))

  const updatedRows = await query.returning()
  const updatedRow = updatedRows.at(0)

  if (!updatedRow) {
    throw new Error("Failed to update post publication settings and slug")
  }

  return updatedRow
}

export async function deletePost(post: Post): Promise<void> {
  await db.delete(posts)
    .where(eq(posts.id, post.id))
}

export async function selectPostOfId(id: number): Promise<Post | undefined> {
  const rows = await db.select().from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  return rows.at(0)
}

export async function selectPostsOfIds(ids: number[], fromDate: Date): Promise<Post[]> {
  if (_isEmpty(ids)) {
    return []
  }

  return db.select().from(posts)
    .where(and(
      inArray(posts.id, ids),
      or(
        isNull(posts.publishedAt),
        lt(posts.publishedAt, fromDate.toISOString())
      )
    ))
    .limit(postFetchPageSize)
    .orderBy(desc(posts.publishedAt), desc(posts.id))
}

export async function selectPostOfUserAndSlug(userId: number, slug: string): Promise<Post | undefined> {
  const rows = await db.select().from(posts)
    .where(and(
      eq(posts.userId, userId),
      eq(posts.slug, slug)
    ))
    .limit(1)

  return rows.at(0)
}

export async function selectPostsOfUser(userId: number, fromDate: Date): Promise<Post[]> {
  return db.select().from(posts)
    .where(and(
      eq(posts.userId, userId),
      or(
        isNull(posts.publishedAt),
        lt(posts.publishedAt, fromDate.toISOString())
      )
    ))
    .limit(postFetchPageSize)
    .orderBy(desc(posts.publishedAt), desc(posts.id))
}
