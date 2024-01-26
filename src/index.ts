import * as dotenv from "dotenv"
dotenv.config()

import cors from "cors"
import express, { Router } from "express"
import path from "node:path"
import * as fs from "fs"
import multer from "multer"
import { migrateDb } from "./DB/DB"
import { config } from "./config"
import { artistRoutes } from "./Routes/ArtistRoutes"
import { fileRoutes } from "./Routes/FileRoutes"
import { postRoutes } from "./Routes/PostRoutes"
import { userRoutes } from "./Routes/UserRoutes"
import dayjs from "dayjs"
import { postLikeRoutes } from "./Routes/PostLikeRoutes"

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

const multerStorage = multer.diskStorage({
  destination: function(_req, _file, callback) {
    const todayYyyyMmDd = dayjs().format("YYYY-MM-DD")
    const directoryPath = path.join(config.UPLOADS_DIR, todayYyyyMmDd)
    fs.mkdirSync(directoryPath, { recursive: true })

    callback(null, directoryPath)
  },

  filename: function(_req, file, callback) {
    const originalName = file.originalname
    const extension = path.extname(originalName)
    const originalNameWithoutExtension = path.basename(originalName, extension)
    const timestamp = Date.now()

    callback(null, `${originalNameWithoutExtension}-${timestamp}${extension}`)
  }
})

export const formDataFileUploader = multer({ storage: multerStorage })


// Router

const router = Router()

artistRoutes(router)
fileRoutes(router)
postLikeRoutes(router)
postRoutes(router)
userRoutes(router)

app.use(router)


// Start server

app.listen(port, async () => {
  console.log(`Server running on http://localhost:${port}/, config.IS_PROD: ${config.IS_PROD}`)
  await migrateDb()
})
