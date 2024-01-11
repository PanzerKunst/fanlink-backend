import { httpStatusCode } from "../Util/HttpUtils"
import { Artist, NewPost, Post, User } from "../Models/DrizzleModels"
import { Request, Response, Router } from "express"
import {
  deletePost,
  insertPost,
  selectPostOfId,
  selectPostOfUserAndSlug, selectPostsOfIds,
  selectPostsOfUser,
  updatePost,
  updatePostPublicationStatusAndSlug
} from "../DB/Queries/Posts"
import { deletePostArtistTags, insertPostArtistTags, selectPostIdsTaggingArtist } from "../DB/Queries/PostArtistTags"
import { PostWithTags } from "../Models/Backend/PostWithTags"
import { selectUserOfId, selectUserOfUsername } from "../DB/Queries/Users"
import dayjs from "dayjs"
import { selectArtistOfTagName } from "../DB/Queries/Artists"
import { getPostWithTags } from "../Util/DomainUtils"

export function postRoutes(router: Router) {
  router.post("/post", async (req: Request, res: Response) => {
    try {
      const newPost: NewPost = req.body.post as NewPost // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      if (newPost.heroImagePath && newPost.heroVideoUrl) {
        res.status(httpStatusCode.BAD_REQUEST).send("Hero image and video cannot be set at the same time")
        return
      }

      const taggedArtists: Artist[] = req.body.taggedArtists as Artist[] // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      if (taggedArtists.length > 2) {
        res.status(httpStatusCode.BAD_REQUEST).send("Too many tags")
        return
      }

      const insertedPost = await insertPost(newPost)
      await insertPostArtistTags(insertedPost, taggedArtists)
      const postWithTags = await getPostWithTags(insertedPost, false)

      res.status(httpStatusCode.OK).json(postWithTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.put("/post", async (req: Request, res: Response) => {
    try {
      const post: Post = req.body.post as Post // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      if (post.heroImagePath && post.heroVideoUrl) {
        res.status(httpStatusCode.BAD_REQUEST).send("Hero image and video cannot be set at the same time")
        return
      }

      const taggedArtists: Artist[] = req.body.taggedArtists as Artist[] // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      if (taggedArtists.length > 2) {
        res.status(httpStatusCode.BAD_REQUEST).send("Too many tags")
        return
      }

      const updatedPost = await updatePost(post)
      await deletePostArtistTags(updatedPost)
      await insertPostArtistTags(updatedPost, taggedArtists)
      const postWithTags = await getPostWithTags(updatedPost, false)

      res.status(httpStatusCode.OK).json(postWithTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  // Publish or unpublish
  router.put("/post/:id", async (req: Request, res: Response) => {
    try {
      const { id } = req.params
      const postId = parseInt(id || "")

      if (isNaN(postId)) {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing or incorrect 'id' in path")
        return
      }

      const storedPost: Post | undefined = await selectPostOfId(postId)

      if (!storedPost) {
        res.status(httpStatusCode.BAD_REQUEST).send("Post not found in DB")
        return
      }

      if (!("publish" in req.query)) {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'publish' query param")
        return
      }

      const author: User | undefined = await selectUserOfId(storedPost.userId!)

      if (!author) {
        res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
        return
      }

      const updatedPost: Post = await updatePostPublicationStatusAndSlug(storedPost, req.query.publish === "true")
      const postWithAuthorAndTags = await getPostWithTags(updatedPost)

      res.status(httpStatusCode.OK).json(postWithAuthorAndTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.delete("/post", async (req, res) => {
    try {
      const post = req.body.post as Post // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const storedPost = await selectPostOfId(post.id)

      if (!storedPost) {
        res.status(httpStatusCode.BAD_REQUEST).send("Post not found in DB")
        return
      }

      if (dayjs(storedPost.createdAt).isSame(dayjs(post.createdAt), "millisecond")) {
        await deletePost(post)
      }

      res.sendStatus(httpStatusCode.OK)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/post/:id", async (req, res) => {
    try {
      const { id } = req.params
      const postId = parseInt(id)

      if (isNaN(postId)) {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing or incorrect 'id' in path")
        return
      }

      const storedPost: Post | undefined = await selectPostOfId(postId)

      if (!storedPost) {
        res.sendStatus(httpStatusCode.NO_CONTENT)
        return
      }

      const postWithAuthorAndTags = await getPostWithTags(storedPost)

      res.status(httpStatusCode.OK).json(postWithAuthorAndTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/post/:username/:slug", async (req, res) => {
    try {
      const { username, slug } = req.params

      if (username === "") {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'username' in path")
        return
      }

      const author: User | undefined = await selectUserOfUsername(username)

      if (!author) {
        res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
        return
      }

      if (slug === "") {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'slug' in path")
        return
      }

      const storedPost: Post | undefined = await selectPostOfUserAndSlug(author.id, slug)

      if (!storedPost) {
        res.sendStatus(httpStatusCode.NO_CONTENT)
        return
      }

      const postWithAuthorAndTags = await getPostWithTags(storedPost)

      res.status(httpStatusCode.OK).json(postWithAuthorAndTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/posts/user/:username", async (req, res) => {
    try {
      const { username } = req.params

      if (username === "") {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'username' in path")
        return
      }

      const author: User | undefined = await selectUserOfUsername(username)

      if (!author) {
        res.status(httpStatusCode.OK).json([])
        return
      }

      const authorsPosts: Post[] = await selectPostsOfUser(author.id)

      const authorsPostsWithTagsPromises = authorsPosts.map(async (post) => {
        return getPostWithTags(post)
      })

      const authorsPostsWithTags: PostWithTags[] = await Promise.all(authorsPostsWithTagsPromises)

      res.status(httpStatusCode.OK).json(authorsPostsWithTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/posts/artist/:tagName", async (req, res) => {
    try {
      const { tagName } = req.params

      if (tagName === "") {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'tagName' in path")
        return
      }

      const artist: Artist | undefined = await selectArtistOfTagName(tagName)

      if (!artist) {
        res.status(httpStatusCode.OK).json([])
        return
      }

      const postIdsTaggingArtist: number[] = await selectPostIdsTaggingArtist(artist.id)
      const postsTaggingArtist: Post[] = await selectPostsOfIds(postIdsTaggingArtist)
      const publishedPostsTaggingArtist: Post[] = postsTaggingArtist.filter((post) => !!post.publishedAt)

      const postsWithAuthorAndTagsPromises = publishedPostsTaggingArtist.map(async (post) => {
        return getPostWithTags(post)
      })

      const postsWithAuthorAndTags: PostWithTags[] = await Promise.all(postsWithAuthorAndTagsPromises)

      res.status(httpStatusCode.OK).json(postsWithAuthorAndTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/posts/home/:id", async (req, res) => {
    try {
      const { id } = req.params
      const userId = parseInt(id)

      if (isNaN(userId)) {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing or incorrect 'id' in path")
        return
      }

      const user: User | undefined = await selectUserOfId(userId)

      if (!user) {
        res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
        return
      }

      // Fetch all followed users

      // Fetch all followed artists
      /* const followedArtistIds = await selectArtistIdsFollowedByUser(user.id)
      const followedArtists: Artist[] = await selectArtistsOfIds(followedArtistIds) */

      res.status(httpStatusCode.OK).json([])
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })
}