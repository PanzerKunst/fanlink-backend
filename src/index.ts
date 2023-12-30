import * as dotenv from "dotenv"
dotenv.config()

import cors from "cors"
import dayjs from "dayjs"
import express, { Request, Response } from "express"
import _isEmpty from "lodash/isEmpty"
import { exec } from "node:child_process"
import { migrateDb } from "./DB/DB"
import { insertArtistMusicGenres, selectMusicGenresForArtists } from "./DB/Queries/ArtistMusicGenres"
import { insertArtists, selectArtistOfSpotifyId, selectArtistsOfSpotifyIds } from "./DB/Queries/Artists"
import { insertCountry, selectCountryOfCode } from "./DB/Queries/Countries"
import { insertLocation, selectLocationOfGeoapifyPlaceId } from "./DB/Queries/Locations"
import { insertMusicGenres, selectMusicGenresOfNames } from "./DB/Queries/MusicGenres"
import { deletePostArtistTags, insertPostArtistTags, selectArtistsTaggedInPost } from "./DB/Queries/PostArtistTags"
import {
  deletePost,
  insertPost,
  selectEmptyPostOfId, selectPostOfId, selectPostOfUserAndSlug,
  selectPostsOfUser,
  updatePost,
  updatePostPublicationStatusAndSlug
} from "./DB/Queries/Posts"
import { insertUserFavouriteArtists } from "./DB/Queries/UserFavouriteArtists"
import { deleteUser, insertUser, selectUserOfId, selectUserOfSpotifyId, selectUserOfUsername, updateUser } from "./DB/Queries/Users"
import { ArtistWithGenres } from "./Models/Backend/ArtistWithGenres"
import { EmptyPost } from "./Models/Backend/Post"
import { EmptyPostWithTags, PostWithAuthorAndTags } from "./Models/Backend/PostWithTags"
import { Artist, Country, Location, MusicGenre, NewCountry, NewLocation, NewPost, NewUser, Post, User } from "./Models/DrizzleModels"
import { GeoapifyFeature } from "./Models/Geoapify/GeoapifyFeature"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { httpStatusCode } from "./Util/HttpUtils"
import { config } from "./config"
import path from "node:path"
import * as fs from "fs"
import { getContentTypeFromFilePath } from "./Util/FileUtils"

const app = express()
const port = config.PORT

// Increases the limit for JSON, raw (for files), and URL-encoded payloads from 100kb to 50mb
const payloadLimit = "50mb"
app.use(express.json({ limit: payloadLimit }))
app.use(express.raw({ type: "text/plain", limit: payloadLimit }))
app.use(express.urlencoded({ limit: payloadLimit, extended: true }))

// Configure CORS middleware options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true)

    if (config.FRONTEND_URL !== origin) {
      // TODO: remove
      console.log("Refused origin : " + origin)

      const msg = "The CORS policy for this site does not allow access from the specified Origin."
      return callback(new Error(msg), false)
    }

    // Allow request
    return callback(null, true)
  }
}

// Enable CORS with the above options
app.use(cors(corsOptions))

app.get("/", async (_req, res) => {
  try {
    const fink = await selectArtistOfSpotifyId("2t9yJDJIEtvPmr2iRIdqBf")
    res.status(httpStatusCode.OK).json(fink)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})


// Users

app.get("/user/spotifyId/:spotifyId", async (req, res) => {
  try {
    const { spotifyId } = req.params

    if (spotifyId === "") {
      res.status(httpStatusCode.BAD_REQUEST).send("Missing 'spotifyId' in path")
      return
    }

    const alreadyStored: User | undefined = await selectUserOfSpotifyId(spotifyId)

    if (!alreadyStored) {
      res.sendStatus(httpStatusCode.NO_CONTENT)
      return
    }

    res.status(httpStatusCode.OK).json(alreadyStored)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.get("/user/username/:username", async (req, res) => {
  try {
    const { username } = req.params

    if (username === "") {
      res.status(httpStatusCode.BAD_REQUEST).send("Missing 'username' in path")
      return
    }

    const alreadyStored: User | undefined = await selectUserOfUsername(username)

    if (!alreadyStored) {
      res.sendStatus(httpStatusCode.NO_CONTENT)
      return
    }

    res.status(httpStatusCode.OK).json(alreadyStored)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.post("/user", async (req: Request, res: Response) => {
  try {
    const newUser: NewUser = req.body.user as NewUser // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    const alreadyStoredUser: User | undefined = await selectUserOfSpotifyId(newUser.spotifyId)

    if (alreadyStoredUser) {
      res.status(httpStatusCode.OK).json(alreadyStoredUser)
      return
    }

    const insertedUser: User = await insertUser(newUser)

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const geoapifyFeature: GeoapifyFeature = req.body.geoapifyFeature as GeoapifyFeature
    const alreadyStoredLocation: Location | undefined = await selectLocationOfGeoapifyPlaceId(geoapifyFeature.place_id)

    if (!alreadyStoredLocation) {
      let country: Country | undefined = await selectCountryOfCode(geoapifyFeature.country_code)

      if (!country) {
        const newCountry: NewCountry = {
          name: geoapifyFeature.country,
          code: geoapifyFeature.country_code
        }

        country = await insertCountry(newCountry)
      }

      const newLocation: NewLocation = {
        ...geoapifyFeature,
        geoapifyPlaceId: geoapifyFeature.place_id,
        countryId: country.id,
        lon: geoapifyFeature.lon.toString(),
        lat: geoapifyFeature.lat.toString(),
        stateCode: geoapifyFeature.state_code,
        stateCog: geoapifyFeature.state_COG,
        addressLine1: geoapifyFeature.address_line1,
        addressLine2: geoapifyFeature.address_line2,
        departmentCog: geoapifyFeature.department_COG,
        plusCode: geoapifyFeature.plus_code,
        plusCodeShort: geoapifyFeature.plus_code_short,
        resultType: geoapifyFeature.result_type
      }

      await insertLocation(newLocation)
    }

    res.status(httpStatusCode.OK).json(insertedUser)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.put("/user", async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user as User // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    const updatedUser = await updateUser(user)

    res.status(httpStatusCode.OK).json(updatedUser)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.delete("/user", async (req: Request, res: Response) => {
  try {
    const user: User = req.body.user as User // eslint-disable-line @typescript-eslint/no-unsafe-member-access
    const storedUser: User | undefined = await selectUserOfId(user.id)

    if (!storedUser) {
      res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
      return
    }

    if (dayjs(storedUser.createdAt).isSame(dayjs(user.createdAt), "millisecond")) {
      await deleteUser(user)
    }

    res.sendStatus(httpStatusCode.OK)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})


// Artists

/* app.get("/artistsAndTheirGenres", async (req: Request, res: Response) => {
  try {
    let spotifyIds: string[] = []

    try {
      spotifyIds = JSON.parse(req.query.spotifyIds as string) as string[]
    } catch (error) {
      res.status(httpStatusCode.BAD_REQUEST).json(error)
    }

    if (_isEmpty(spotifyIds)) {
      res.status(httpStatusCode.OK).json([])
      return
    }

    const artists: Artist[] = await selectArtistsOfSpotifyIds(spotifyIds)
    const artistAndTheirGenres: ArtistWithGenres[] = await selectMusicGenresForArtists(artists)

    res.status(httpStatusCode.OK).json(artistAndTheirGenres)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
}) */

app.post("/artists", async (req: Request, res: Response) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const spotifyArtists: SpotifyArtist[] = req.body.spotifyArtists as SpotifyArtist[]

    if (_isEmpty(spotifyArtists)) {
      res.status(httpStatusCode.OK).json([])
      return
    }

    const insertedArtists: Artist[] = await insertArtists(spotifyArtists)

    // Insert MusicGenres
    const genreNames = spotifyArtists.flatMap(artist => artist.genres)
    await insertMusicGenres(genreNames)

    // Insert ArtistMusicGenres
    for (const artist of insertedArtists) {
      const genreNamesForArtist = spotifyArtists.find((spotifyArtist) => spotifyArtist.id === artist.spotifyId)!.genres

      if (_isEmpty(genreNamesForArtist)) {
        continue // Skip this iteration
      }

      const genresForArtist: MusicGenre[] = await selectMusicGenresOfNames(genreNamesForArtist)
      await insertArtistMusicGenres(artist, genresForArtist)
    }

    const artists: Artist[] = await selectArtistsOfSpotifyIds(spotifyArtists.map((spotifyArtist) => spotifyArtist.id))
    const artistAndTheirGenres: ArtistWithGenres[] = await selectMusicGenresForArtists(artists)

    res.status(httpStatusCode.OK).json(artistAndTheirGenres)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.post("/userFavouriteArtists", async (req: Request, res: Response) => {
  try {
    const userFavourites: Artist[] = req.body.favouriteArtists as Artist[] // eslint-disable-line @typescript-eslint/no-unsafe-member-access

    if (_isEmpty(userFavourites)) {
      res.status(httpStatusCode.OK).json([])
      return
    }

    const user: User = req.body.user as User // eslint-disable-line @typescript-eslint/no-unsafe-member-access

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const followedArtists: SpotifyArtist[] = req.body.followedArtists as SpotifyArtist[]

    await insertUserFavouriteArtists(user, userFavourites, followedArtists)

    res.status(httpStatusCode.OK).json(userFavourites)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})


// Posts

app.post("/post", async (req: Request, res: Response) => {
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

app.put("/post", async (req: Request, res: Response) => {
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
app.put("/post/:id", async (req: Request, res: Response) => {
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

app.get("/post/:id", async (req, res) => {
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

app.get("/post/:username/:slug", async (req, res) => {
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

app.delete("/post", async (req, res) => {
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

app.get("/posts/user/:id", async (req, res) => {
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


// File upload / serving

app.post("/file/image", (req: Request, res: Response) => {
  try {
    const base64 = req.body.base64 as string // eslint-disable-line @typescript-eslint/no-unsafe-member-access

    const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
      res.status(httpStatusCode.BAD_REQUEST).send("Invalid base64 string")
      return
    }

    const todayYyyyMmDd = dayjs().format("YYYY-MM-DD")
    const directoryPath = path.join(config.UPLOADS_DIR, todayYyyyMmDd)
    fs.mkdirSync(directoryPath, { recursive: true })

    const contentType = matches[1]!
    const extension = contentType.split("/")[1]
    const timestamp = Date.now()
    const fileName = `image-${timestamp}.${extension}`
    const absolutePath = path.join(directoryPath, fileName)

    const base64Data = matches[2]!
    const buffer = Buffer.from(base64Data, "base64")
    fs.writeFileSync(absolutePath, buffer)

    res.status(httpStatusCode.OK).json(`${todayYyyyMmDd}/${fileName}`)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.get("/file/image/:dir/:fileName", (req, res) => {
  try {
    const { dir, fileName } = req.params

    if (dir === "" || fileName === "") {
      res.status(httpStatusCode.BAD_REQUEST).send("Missing 'dir' or 'filePath' in path")
      return
    }

    const absolutePath = path.join(config.UPLOADS_DIR, dir, fileName)

    if (!fs.existsSync(absolutePath)) {
      res.sendStatus(httpStatusCode.NO_CONTENT)
      return
    }

    res.setHeader("Content-Type", getContentTypeFromFilePath(absolutePath))
    fs.createReadStream(absolutePath).pipe(res)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})


// Github webhook

app.post("/webhook", (req, res) => {
  try {
    // TODO: remove
    console.log("Received webhook")

    exec("/home/panzerkunst/fanlink-backend-test/deploy-test.sh", (err) => {
      if (err) {
        throw new Error("The Github webkook failed")
      }

      // TODO: remove
      console.log("Deployed!")
      res.status(200).send("Deployed!")
    })
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})


// Start server

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}/, config.IS_PROD: ${config.IS_PROD}`)
  await migrateDb()
})
