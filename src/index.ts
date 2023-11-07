import * as dotenv from "dotenv"
dotenv.config()

import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import { config } from "./config"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { migrateDb } from "./DB/DB"
import { insertArtists } from "./DB/Schema/Artists"

const app = express()
const port = config.PORT

app.use(express.json())

// Configure CORS middleware options
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
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

// Error handling middleware
app.use((error: any, req: Request, res: Response) => { // eslint-disable-line @typescript-eslint/no-explicit-any
  console.error(error.stack)
  res.status(500).send("Something broke!")
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`)
  migrateDb()
})
