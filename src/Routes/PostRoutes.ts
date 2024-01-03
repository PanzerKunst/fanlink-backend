import { httpStatusCode } from "../Util/HttpUtils"
import { Artist, NewPost, Post, User } from "../Models/DrizzleModels"
import { Request, Response, Router } from "express"
import {
  deletePost,
  insertPost,
  selectEmptyPostOfId,
  selectPostOfId,
  selectPostOfUserAndSlug,
  selectPostsOfUser,
  updatePost,
  updatePostPublicationStatusAndSlug
} from "../DB/Queries/Posts"
import { deletePostArtistTags, insertPostArtistTags, selectArtistsTaggedInPost } from "../DB/Queries/PostArtistTags"
import { EmptyPostWithTags, PostWithAuthorAndTags } from "../Models/Backend/PostWithTags"
import { EmptyPost } from "../Models/Backend/Post"
import { selectUserOfId, selectUserOfUsername } from "../DB/Queries/Users"
import dayjs from "dayjs"

export function postRoutes(router: Router) {
  router.post("/post", async (req: Request, res: Response) => {
    try {
      const newPost: NewPost = req.body.post as NewPost // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const insertedPost = await insertPost(newPost)

      const taggedArtists: Artist[] = req.body.taggedArtists as Artist[] // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      if (taggedArtists.length > 2) {
        res.status(httpStatusCode.BAD_REQUEST).send("Too many tags")
        return
      }

      await insertPostArtistTags(insertedPost, taggedArtists)

      const emptyPostWithTags: EmptyPostWithTags = {
        post: insertedPost,
        taggedArtists
      }

      res.status(httpStatusCode.OK).json(emptyPostWithTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.put("/post", async (req: Request, res: Response) => {
    try {
      const post: Post = req.body.post as Post // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const updatedPost = await updatePost(post)

      const taggedArtists: Artist[] = req.body.taggedArtists as Artist[] // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      if (taggedArtists.length > 2) {
        res.status(httpStatusCode.BAD_REQUEST).send("Too many tags")
        return
      }

      await deletePostArtistTags(updatedPost)
      await insertPostArtistTags(updatedPost, taggedArtists)

      const emptyPostWithTags: EmptyPostWithTags = {
        post: updatedPost,
        taggedArtists
      }

      res.status(httpStatusCode.OK).json(emptyPostWithTags)
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

      const updatedEmptyPost: EmptyPost = await updatePostPublicationStatusAndSlug(storedPost, req.query.publish === "true")
      const taggedArtists: Artist[] = await selectArtistsTaggedInPost(postId)

      const emptyPostWithTags: EmptyPostWithTags = {
        post: updatedEmptyPost,
        taggedArtists
      }

      res.status(httpStatusCode.OK).json(emptyPostWithTags)
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

      const author: User | undefined = await selectUserOfId(storedPost.userId!)

      if (!author) {
        res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
        return
      }

      const taggedArtists: Artist[] = await selectArtistsTaggedInPost(postId)

      const postWithAuthorAndTags: PostWithAuthorAndTags = {
        post: storedPost,
        author,
        taggedArtists
      }

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

      const taggedArtists: Artist[] = await selectArtistsTaggedInPost(storedPost.id)

      const postWithAuthorAndTags: PostWithAuthorAndTags = {
        post: storedPost,
        author,
        taggedArtists
      }

      res.status(httpStatusCode.OK).json(postWithAuthorAndTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.delete("/post", async (req, res) => {
    try {
      const emptyPost = req.body.emptyPost as EmptyPost // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const storedEmptyPost = await selectEmptyPostOfId(emptyPost.id)

      if (!storedEmptyPost) {
        res.status(httpStatusCode.BAD_REQUEST).send("Post not found in DB")
        return
      }

      if (dayjs(storedEmptyPost.createdAt).isSame(dayjs(emptyPost.createdAt), "millisecond")) {
        await deletePost(emptyPost)
      }

      res.sendStatus(httpStatusCode.OK)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/posts/user/:id", async (req, res) => {
    try {
      const { id } = req.params
      const userId = parseInt(id || "")

      if (isNaN(userId)) {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing or incorrect 'id' in path")
        return
      }

      const user: User = (await selectUserOfId(userId))!
      const usersPosts: Post[] = await selectPostsOfUser(userId)

      const usersPostsWithTagsPromises = usersPosts.map(async (post) => {
        const taggedArtists = await selectArtistsTaggedInPost(post.id)

        return {
          post,
          author: user,
          taggedArtists
        }
      })

      const usersPostsWithTags: PostWithAuthorAndTags[] = await Promise.all(usersPostsWithTagsPromises)

      res.status(httpStatusCode.OK).json(usersPostsWithTags)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })
}
