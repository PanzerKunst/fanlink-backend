import * as dotenv from "dotenv"
dotenv.config()

import express, { Request, Response } from "express"
import cors from "cors"
import _isEmpty from "lodash/isEmpty"
import { config } from "./config"
import { SpotifyArtist } from "./Models/Spotify/SpotifyArtist"
import { migrateDb } from "./DB/DB"
import { insertArtists, selectArtistOfSpotifyId, selectArtistsOfSpotifyIds } from "./DB/Queries/Artists"
import { insertUser, selectUserOfSpotifyId, selectUserOfUsername } from "./DB/Queries/Users"
import { httpStatusCode } from "./Util/HttpUtils"
import { insertUserFavouriteArtists } from "./DB/Queries/UserFavouriteArtists"
import { Artist, Country, Location, MusicGenre, NewCountry, NewLocation, NewPost, NewUser, Post, User } from "./Models/DrizzleModels"
import { insertLocation, selectLocationOfGeoapifyPlaceId } from "./DB/Queries/Locations"
import { GeoapifyFeature } from "./Models/Geoapify/GeoapifyFeature"
import { insertCountry, selectCountryOfCode } from "./DB/Queries/Countries"
import { insertMusicGenres, selectAllMusicGenres, selectMusicGenresOfNames } from "./DB/Queries/MusicGenres"
import { insertArtistMusicGenres, selectMusicGenresForArtists } from "./DB/Queries/ArtistMusicGenres"
import { ArtistWithGenres } from "./Models/Backend/ArtistWithGenres"
import { insertPost, selectPostOfId, updatePost } from "./DB/Queries/Posts"

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
    const spotifyArtists: SpotifyArtist[] = req.body.spotifyArtists

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

      // TODO: remvoe
      console.log("genreNamesForArtist", genreNamesForArtist, artist.name)

      const genresForArtist: MusicGenre[] = await selectMusicGenresOfNames(genreNamesForArtist)

      // TODO: remvoe
      console.log("genresForArtist", genresForArtist)

      await insertArtistMusicGenres(artist, genresForArtist)
    }

    const artists: Artist[] = await selectArtistsOfSpotifyIds(spotifyArtists.map((spotifyArtist) => spotifyArtist.id))

    // TODO: remvoe
    console.log("const artists: Artist[] = await selectArtistsOfSpotifyIds(spotifyArtists.map((spotifyArtist) => spotifyArtist.id))")

    const artistAndTheirGenres: ArtistWithGenres[] = await selectMusicGenresForArtists(artists)

    // TODO: remvoe
    console.log("const artistAndTheirGenres: ArtistWithGenres[] = await selectMusicGenresForArtists(artists)", artistAndTheirGenres)

    res.status(httpStatusCode.OK).json(artistAndTheirGenres)
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
    const followedArtists: SpotifyArtist[] = req.body.followedArtists
    await insertUserFavouriteArtists(user, userFavourites, followedArtists)

    res.status(httpStatusCode.OK).json(userFavourites)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})


// Music genres

app.get("/musicGenres", async (_req: Request, res: Response) => {
  try {
    const musicGenres: MusicGenre[] = await selectAllMusicGenres()

    res.status(httpStatusCode.OK).json(musicGenres)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})


// Posts

app.post("/post", async (req: Request, res: Response) => {
  try {
    const newPost: NewPost = req.body.post
    const insertedPost: Post = await insertPost(newPost)

    res.status(httpStatusCode.OK).json(insertedPost)
  } catch (error) {
    console.error(error)
    res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
  }
})

app.put("/post", async (req: Request, res: Response) => {
  try {
    const post: Post = req.body.post
    const updatedPost: Post = await updatePost(post)

    res.status(httpStatusCode.OK).json(updatedPost)
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

    const alreadyStored: Post | undefined = await selectPostOfId(postId)

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


// Start server

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/, config.IS_PROD: ${config.IS_PROD}`)
  migrateDb()
})
