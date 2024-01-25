import { httpStatusCode } from "../Util/HttpUtils"
import { Artist, MusicGenre } from "../Models/DrizzleModels"
import { Request, Response, Router } from "express"
import { SpotifyArtist } from "../Models/Spotify/SpotifyArtist"
import _isEmpty from "lodash/isEmpty"
import { insertArtist, selectArtistOfSpotifyId, selectArtistOfTagName, selectArtistsOfSpotifyIds } from "../DB/Queries/Artists"
import { insertMusicGenres, selectMusicGenresOfNames } from "../DB/Queries/MusicGenres"
import { insertArtistMusicGenres } from "../DB/Queries/ArtistMusicGenres"

export function artistRoutes(router: Router) {
  router.post("/artists", async (req: Request, res: Response) => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const spotifyArtists: SpotifyArtist[] = req.body.spotifyArtists as SpotifyArtist[]

      if (_isEmpty(spotifyArtists)) {
        res.status(httpStatusCode.OK).json([])
        return
      }

      const insertedArtists: Artist[] = []

      for (const spotifyArtist of spotifyArtists) {
        const storedArtist: Artist | undefined = await selectArtistOfSpotifyId(spotifyArtist.id)

        if (!storedArtist) {
          insertedArtists.push(await insertArtist(spotifyArtist))
        }
      }

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

      res.status(httpStatusCode.OK).json(artists)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/artist/tag/:tagName", async (req, res) => {
    try {
      const { tagName } = req.params

      if (tagName === "") {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'tagName' in path")
        return
      }

      const alreadyStored: Artist | undefined = await selectArtistOfTagName(tagName)

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
}
