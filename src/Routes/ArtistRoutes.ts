import { httpStatusCode } from "../Util/HttpUtils"
import { Artist, MusicGenre, User } from "../Models/DrizzleModels"
import { Request, Response, Router } from "express"
import { SpotifyArtist } from "../Models/Spotify/SpotifyArtist"
import _isEmpty from "lodash/isEmpty"
import { insertArtists, selectArtistsOfSpotifyIds } from "../DB/Queries/Artists"
import { insertMusicGenres, selectMusicGenresOfNames } from "../DB/Queries/MusicGenres"
import { insertArtistMusicGenres, selectMusicGenresForArtists } from "../DB/Queries/ArtistMusicGenres"
import { ArtistWithGenres } from "../Models/Backend/ArtistWithGenres"
import { insertUserFavouriteArtists } from "../DB/Queries/UserFavouriteArtists"

export function artistRoutes(router: Router) {
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

  router.post("/artists", async (req: Request, res: Response) => {
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

  router.post("/userFavouriteArtists", async (req: Request, res: Response) => {
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
}
