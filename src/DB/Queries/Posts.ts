import { NewPost, Post } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { posts } from "../../../drizzle/schema"
import { and, desc, eq, sql } from "drizzle-orm"
import { EmptyPost } from "../../Models/Backend/Post"
import _isEmpty from "lodash/isEmpty"
import { getPostSlug } from "../../Util/DomainUtils"

export async function insertPost(newPost: NewPost): Promise<EmptyPost> {
  const titleForDb = !_isEmpty(newPost.title) ? newPost.title! : undefined // Replacing "" by null

  const newPostForDb: NewPost = {
    ...newPost,
    title: titleForDb
  }

  const query = db.insert(posts).values(newPostForDb)
    .onConflictDoNothing()

  const rows = await query.returning({
    id: posts.id,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    publishedAt: posts.publishedAt,
    userId: posts.userId,
    slug: posts.slug,
    title: posts.title
  })

  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert post")
  }

  return row
}

export async function updatePost(post: Post): Promise<EmptyPost> {
  const titleForDb = !_isEmpty(post.title) ? post.title! : undefined // Replacing "" by null

  const query = db.update(posts)
    .set({
      updatedAt: sql`CURRENT_TIMESTAMP`,
      publishedAt: post.publishedAt,
      title: titleForDb,
      content: post.content
    })
    .where(eq(posts.id, post.id))

  const rows = await query.returning({
    id: posts.id,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    publishedAt: posts.publishedAt,
    userId: posts.userId,
    slug: posts.slug,
    title: posts.title
  })

  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to update post")
  }

  return row
}

export async function updatePostPublicationStatusAndSlug(post: Post, isPublishing: boolean): Promise<EmptyPost> {
  const query = db.update(posts)
    .set({
      updatedAt: sql`CURRENT_TIMESTAMP`,
      publishedAt: isPublishing ? sql`CURRENT_TIMESTAMP` : undefined,
      slug: post.slug || getPostSlug(post.content, post.title) // We never change the slug once set
    })
    .where(eq(posts.id, post.id))

  const rows = await query.returning({
    id: posts.id,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    publishedAt: posts.publishedAt,
    userId: posts.userId,
    slug: posts.slug,
    title: posts.title
  })

  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to update post publication status and slug")
  }

  return row
}

export async function selectPostOfId(id: number): Promise<Post | undefined> {
  const rows = await db.select().from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  return rows.at(0)
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

export async function selectPostsOfUser(userId: number): Promise<Post[]> {
  return db.select().from(posts)
    .where(eq(posts.userId, userId))
    .orderBy(desc(posts.id))
}

export async function selectEmptyPostOfId(id: number): Promise<EmptyPost | undefined> {
  const rows = await db.select({
    id: posts.id,
    createdAt: posts.createdAt,
    updatedAt: posts.updatedAt,
    publishedAt: posts.publishedAt,
    userId: posts.userId,
    slug: posts.slug,
    title: posts.title
  }).from(posts)
    .where(eq(posts.id, id))
    .limit(1)

  return rows.at(0)
}

export async function deletePost(emptyPost: EmptyPost): Promise<void> {
  await db.delete(posts)
    .where(eq(posts.id, emptyPost.id))
}
