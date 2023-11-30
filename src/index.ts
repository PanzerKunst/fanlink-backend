import * as dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import _isEmpty from "lodash/isEmpty"
import { config } from "./config"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { migrateDb } from "./DB/DB"
import { insertArtists, selectArtistOfSpotifyId, selectArtistsOfSpotifyIds, selectSpotifyArtistsNotYetStored } from "./DB/Queries/Artists"
import { insertUser, selectUserOfSpotifyId, selectUserOfUsername } from "./DB/Queries/Users"
import { httpStatusCode } from "./Util/HttpUtils"
import { insertUserFavouriteArtists, selectUserFavouriteArtistsNotYetStored } from "./DB/Queries/UserFavouriteArtists"
import { Artist, Country, Location, NewCountry, NewLocation, NewUser, User } from "./Models/DrizzleModels"
import { insertLocation, selectLocationOfGeoapifyPlaceId } from "./DB/Queries/Locations"
import { GeoapifyFeature } from "./Models/Geoapify/GeoapifyFeature"
import { insertCountry, selectCountryOfCode } from "./DB/Queries/Countries"

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
    const newUser: NewUser = req.body.user
    const alreadyStoredUser: User | undefined = await selectUserOfSpotifyId(newUser.spotifyId)

    if (alreadyStoredUser) {
      res.status(httpStatusCode.OK).json(alreadyStoredUser)
      return
    }

    const insertedUser: User = await insertUser(newUser)

    const geoapifyFeature: GeoapifyFeature = req.body.geoapifyFeature
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


// Artists

app.get("/artists", async (req: Request, res: Response) => {
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

    res.status(httpStatusCode.OK).json(artists)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.post("/artists", async (req: Request, res: Response) => {
  try {
    const spotifyArtists: SpotifyArtist[] = req.body.artists

    if (_isEmpty(spotifyArtists)) {
      res.status(httpStatusCode.OK).json([])
      return
    }

    const notYetStoredSpotifyArtists = await selectSpotifyArtistsNotYetStored(spotifyArtists)
    await insertArtists(notYetStoredSpotifyArtists)
    const artists: Artist[] = await selectArtistsOfSpotifyIds(spotifyArtists.map((spotifyArtist) => spotifyArtist.id))

    res.status(httpStatusCode.OK).json(artists)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.post("/userFavouriteArtists", async (req: Request, res: Response) => {
  try {
    const userFavourites: Artist[] = req.body.favouriteArtists

    if (_isEmpty(userFavourites)) {
      res.status(httpStatusCode.OK).json([])
      return
    }

    const user: User = req.body.user
    const followedArtists: Artist[] = req.body.followedArtists
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
