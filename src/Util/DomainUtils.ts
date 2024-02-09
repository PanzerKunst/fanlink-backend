import { removeAccents, removePunctuation, stripHtml } from "./StringUtils"
import { selectArtistOfTagName, selectArtistsOfIds } from "../DB/Queries/Artists"
import { Artist, Post, User, UserFavouriteArtist } from "../Models/DrizzleModels"
import { selectUserOfId, selectUsersOfIds } from "../DB/Queries/Users"
import { selectArtistsTaggedInPost, selectPostIdsTaggingArtist } from "../DB/Queries/PostArtistTags"
import { selectPostsOfIds, selectPostsOfUser } from "../DB/Queries/Posts"
import { selectFavouriteArtists } from "../DB/Queries/UserFavouriteArtists"
import { selectAuthorIdsFollowedByUser } from "../DB/Queries/UserFollowingAuthors"
import { PostWithTags } from "../Models/Backend/PostWithMore"
import { UserWithFavouriteArtistsAndAuthors } from "../Models/Backend/UserWithMore"
import { ArtistWithFollowStatus } from "../Models/Backend/ArtistWithMore"

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

  while (await selectArtistOfTagName(tagName)) {
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

export async function fetchPostsTaggingArtist(artistId: number, fromDate: Date): Promise<PostWithTags[]> {
  const postIdsTaggingArtist: number[] = await selectPostIdsTaggingArtist(artistId)
  const postsTaggingArtist: Post[] = await selectPostsOfIds(postIdsTaggingArtist, fromDate)
  const publishedPostsTaggingArtist: Post[] = postsTaggingArtist.filter((post) => !!post.publishedAt)

  const postsWithAuthorAndTagsPromises = publishedPostsTaggingArtist.map(async (post) => {
    return getPostWithTags(post)
  })

  return await Promise.all(postsWithAuthorAndTagsPromises)
}

export async function fetchPostsTaggingArtists(artists: Artist[], fromDate: Date): Promise<PostWithTags[]> {
  const postsPromises = artists.map(artist => fetchPostsTaggingArtist(artist.id, fromDate))
  const postsArrays = await Promise.all(postsPromises)
  return postsArrays.flat()
}

export async function fetchPostsByAuthor(userId: number, fromDate: Date): Promise<PostWithTags[]> {
  const authorsPosts: Post[] = await selectPostsOfUser(userId, fromDate)

  const authorsPostsWithTagsPromises = authorsPosts.map(async (post) => {
    return getPostWithTags(post)
  })

  return await Promise.all(authorsPostsWithTagsPromises)
}

export async function fetchPostsByAuthors(authors: User[], fromDate: Date): Promise<PostWithTags[]> {
  const postsPromises = authors.map(author => fetchPostsByAuthor(author.id, fromDate))
  const postsArrays = await Promise.all(postsPromises)
  return postsArrays.flat()
}

export async function fetchUserFavouriteArtists(userId: number): Promise<ArtistWithFollowStatus[]> {
  const userFavouriteArtists: UserFavouriteArtist[] = await selectFavouriteArtists(userId)
  const userFavouriteArtistsIds = userFavouriteArtists.map((userFavouriteArtist) => userFavouriteArtist.artistId)
  const favouriteArtists: Artist[] = await selectArtistsOfIds(userFavouriteArtistsIds)

  return favouriteArtists.map((artist: Artist) => ({
    artist,
    isFollowed: userFavouriteArtists.some((userFavouriteArtist) => userFavouriteArtist.artistId === artist.id && userFavouriteArtist.isFollowing)
  }))
}

export async function fetchAuthorsFollowedByUser(userId: number): Promise<User[]> {
  const followedAuthorIds = await selectAuthorIdsFollowedByUser(userId)
  return await selectUsersOfIds(followedAuthorIds)
}

export async function getUserWithFavouriteArtistsAndAuthors(user: User): Promise<UserWithFavouriteArtistsAndAuthors> {
  const favouriteArtists = await fetchUserFavouriteArtists(user.id)
  const followedAuthors = await fetchAuthorsFollowedByUser(user.id)

  return {
    user,
    favouriteArtists,
    followedAuthors
  }
}