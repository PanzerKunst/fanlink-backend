import * as dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import { isEmpty as _isEmpty } from "lodash"
import { config } from "./config"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { migrateDb } from "./DB/DB"
import { insertArtists, selectArtistOfSpotifyId, selectArtistsOfSpotifyIds, selectSpotifyArtistsNotYetStored } from "./DB/Queries/Artists"
import { insertUser, selectUserOfSpotifyId, selectUserOfUsername } from "./DB/Queries/Users"
import { httpStatusCode } from "./Util/HttpUtils"
import { insertUserFavouriteArtists, selectUserFavouriteArtistsNotYetStored } from "./DB/Queries/UserFavouriteArtists"
import { Artist, NewUser, User } from "./Models/DrizzleModels"

const app = express()
const port = config.PORT

// Increases the limit for JSON and URL-encoded payloads from 100kb to 50mb
const payloadLimit = "50mb"
app.use(express.json({ limit: payloadLimit }))
app.use(express.urlencoded({ limit: payloadLimit, extended: true }))

// Configure CORS middleware options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin
    if (!origin) return callback(null, true)

    if (config.FRONTEND_URL !== origin) {
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
    const newUser: NewUser = req.body
    const alreadyStored: User | undefined = await selectUserOfSpotifyId(newUser.spotifyId)

    if (alreadyStored) {
      res.status(httpStatusCode.OK).json(alreadyStored)
      return
    }

    const insertedUser: User = await insertUser(newUser)
    res.status(httpStatusCode.OK).json(insertedUser)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.post("/userFavouriteArtists", async (req: Request, res: Response) => {
  try {
    const favouriteArtists: SpotifyArtist[] = req.body.favouriteArtists

    if (_isEmpty(favouriteArtists)) {
      res.status(httpStatusCode.OK).json([])
      return
    }

    const notYetStoredSpotifyArtists = await selectSpotifyArtistsNotYetStored(favouriteArtists)
    await insertArtists(notYetStoredSpotifyArtists)

    const userFavourites: Artist[] = await selectArtistsOfSpotifyIds(favouriteArtists.map((spotifyArtist) => spotifyArtist.id))

    const user: User = req.body.user
    const followedArtists: SpotifyArtist[] = req.body.followedArtists
    const notYetStoredFavourites: Artist[] = await selectUserFavouriteArtistsNotYetStored(user, userFavourites)
    await insertUserFavouriteArtists(user, notYetStoredFavourites, followedArtists)

    res.status(httpStatusCode.OK).json(notYetStoredFavourites)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/, config.IS_PROD: ${config.IS_PROD}`)
  migrateDb()
})
