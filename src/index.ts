import * as dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import { config } from "./config"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { migrateDb } from "./DB/DB"
import { insertArtists, selectArtistOfSpotifyId, selectArtistsNotYetStored } from "./DB/Queries/Artists"
import { SpotifyUserProfile } from "./Models/Spotify/SpotifyUserProfile"
import { insertUser, selectUserOfSpotifyId } from "./DB/Queries/Users"
import { httpStatusCode } from "./Util/HttpUtils"

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

app.post("/user", async (req: Request, res: Response) => {
  try {
    const spotifyUserProfile: SpotifyUserProfile = req.body
    const alreadyStored = await selectUserOfSpotifyId(spotifyUserProfile.id)

    if (alreadyStored) {
      res.status(httpStatusCode.NO_CONTENT)
      return
    }

    const insertedUser = await insertUser(spotifyUserProfile)

    res.status(httpStatusCode.OK).json(insertedUser)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.post("/artists", async (req: Request, res: Response) => {
  try {
    const spotifyArtists: SpotifyArtist[] = req.body
    const notYetStored = await selectArtistsNotYetStored(spotifyArtists)
    const insertedArtists = await insertArtists(notYetStored)

    res.status(httpStatusCode.OK).json(insertedArtists)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/, config.IS_PROD: ${config.IS_PROD}`)
  migrateDb()
})
