import { httpStatusCode } from "../Util/HttpUtils"
import { Post, PostLike, User } from "../Models/DrizzleModels"
import { Request, Response, Router } from "express"
import { selectPostOfId } from "../DB/Queries/Posts"
import { selectUserOfId } from "../DB/Queries/Users"
import dayjs from "dayjs"
import { deletePostLike, insertPostLike, selectPostLikes } from "../DB/Queries/PostLIkes"
import { Likes } from "../Models/Backend/LikeWithMore"

export function postLikeRoutes(router: Router) {
  router.post("/post/like/:id", async (req: Request, res: Response) => {
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

      const user: User = req.body.user as User // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      const storedUser: User | undefined = await selectUserOfId(user.id)

      if (!storedUser) {
        res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
        return
      }

      if (dayjs(storedUser.createdAt).isSame(dayjs(user.createdAt), "millisecond")) {
        await insertPostLike(postId, storedUser.id)
      }

      res.sendStatus(httpStatusCode.OK)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.delete("/post/like/:id", async (req, res) => {
    try {
      const { id } = req.params
      const postId = parseInt(id)

      if (isNaN(postId)) {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing or incorrect 'id' in path")
        return
      }

      const storedPost: Post | undefined = await selectPostOfId(postId)

      if (!storedPost) {
        res.status(httpStatusCode.BAD_REQUEST).send("Post not found in DB")
        return
      }

      const user: User = req.body.user as User // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      const storedUser: User | undefined = await selectUserOfId(user.id)

      if (!storedUser) {
        res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
        return
      }

      if (dayjs(storedUser.createdAt).isSame(dayjs(user.createdAt), "millisecond")) {
        await deletePostLike(postId, storedUser.id)
      }

      res.sendStatus(httpStatusCode.OK)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/post/likes/:post_id/:user_id", async (req, res) => {
    try {
      const { post_id } = req.params
      const postId = parseInt(post_id)

      if (isNaN(postId)) {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing or incorrect 'post_id' in path")
        return
      }

      const storedPost: Post | undefined = await selectPostOfId(postId)

      if (!storedPost) {
        res.status(httpStatusCode.BAD_REQUEST).send("Post not found in DB")
        return
      }

      // `user_id` is optional, as posts can be viewed when not logged in
      const { user_id } = req.params
      const parsedUserId = parseInt(user_id)
      const userId = isNaN(parsedUserId) ? undefined : parsedUserId

      if (userId) {
        const storedUser: User | undefined = await selectUserOfId(parsedUserId)

        if (!storedUser) {
          res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
          return
        }
      }

      const postLikes: PostLike[] = await selectPostLikes(postId)

      const likes: Likes = {
        count: postLikes.length,
        isLikedByUser: postLikes.some((postLike: PostLike) => postLike.userId === userId)
      }

      res.status(httpStatusCode.OK).json(likes)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })
}
