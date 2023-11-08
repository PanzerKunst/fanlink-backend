import * as dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import { config } from "./config"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { migrateDb } from "./DB/DB"
import { insertArtists } from "./DB/Schema/Artists"

// Catch unhandled promise rejections
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
})

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

app.get("/", async (_req, res) => {
  res.send(JSON.stringify("finkInDb"))
})

app.post("/artists", async (req: Request, res: Response) => {
  const spotifyArtists: SpotifyArtist[] = req.body
  const insertedArtists = await insertArtists(spotifyArtists)

  res.status(200).json(insertedArtists)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`)
  migrateDb()
})
