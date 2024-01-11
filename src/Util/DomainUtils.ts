import { removeAccents, removePunctuation, stripHtml } from "./StringUtils"
import { selectArtistOfTagName } from "../DB/Queries/Artists"
import { Artist, Post, User } from "../Models/DrizzleModels"
import { PostWithTags } from "../Models/Backend/PostWithTags"
import { selectUserOfId } from "../DB/Queries/Users"
import { selectArtistsTaggedInPost } from "../DB/Queries/PostArtistTags"

export function asTag(text: string) {
  const withoutAccents = removeAccents(text)

  return removePunctuation(withoutAccents)
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
    .join("")
}

export function getPostSlug(htmlContent: string, title: string | null) {
  const slugSource = title || stripHtml(htmlContent)
  const withoutAccents = removeAccents(slugSource)

  return removePunctuation(withoutAccents)
    .toLowerCase()
    .trim()
    .split(" ")
    .filter(word => !["and", "or", "but", "the"].includes(word)) // Remove stop words
    .slice(0, 6) // limit to first 6 words
    .join("-") // join with hyphens
}

export async function getAvailableArtistTagName(artistName: string): Promise<string> {
  const idealTagName = asTag(artistName)
  let tagName = idealTagName
  let suffix = 0

  while(await selectArtistOfTagName(tagName)) {
    suffix += 1
    tagName = `${idealTagName}${suffix}`
  }

  return tagName
}

export async function getPostWithTags(post: Post, isAuthorRequired: boolean = true): Promise<PostWithTags> {
  const author: User | undefined = await selectUserOfId(post.userId!)

  if (isAuthorRequired && !author) {
    throw new Error("Post author not found in DB")
  }

  const taggedArtists: Artist[] = await selectArtistsTaggedInPost(post.id)

  return {
    post,
    author,
    taggedArtists
  }
}
