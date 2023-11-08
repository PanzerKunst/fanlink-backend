import * as dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import { config } from "./config"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { migrateDb } from "./DB/DB"
import { insertArtists, selectArtistOfSpotifyId, selectArtistsNotYetStored } from "./DB/Schema/Artists"

/* // Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason)
  // Your error logging or cleanup code here
})

// Catch uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error)
  // Your error logging or cleanup code here
  // It is not safe to continue running the server after an uncaught exception.
  // You should consider shutting down the process gracefully.
}) */

const app = express()
const port = config.PORT

app.use(express.json())

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

// Increases the limit for JSON payloads from 100kb to 50mb
app.use(express.json({ limit: "50mb" }))

// Same as above, for URL-encoded payloads
app.use(express.urlencoded({ limit: "50mb", extended: true }))

app.get("/", async (_req, res) => {
  try {
    const fink = await selectArtistOfSpotifyId("2t9yJDJIEtvPmr2iRIdqBf")
    res.status(200).json(fink)
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
})

app.post("/artists", async (req: Request, res: Response) => {
  try {
    const spotifyArtists: SpotifyArtist[] = req.body
    const notYetStored = await selectArtistsNotYetStored(spotifyArtists)
    const insertedArtists = await insertArtists(notYetStored)

    res.status(200).json(insertedArtists)
  } catch (error) {
    console.error(error)
    res.status(500).json(error)
  }
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/, config.IS_PROD: ${config.IS_PROD}`)
  migrateDb()
})
