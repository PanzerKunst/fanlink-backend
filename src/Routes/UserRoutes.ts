import { httpStatusCode } from "../Util/HttpUtils"
import { Country, Location, NewCountry, NewLocation, NewUser, User } from "../Models/DrizzleModels"
import { deleteUser, insertUser, selectUserOfId, selectUserOfSpotifyId, selectUserOfUsername, updateUser } from "../DB/Queries/Users"
import { Request, Response } from "express"
import { GeoapifyFeature } from "../Models/Geoapify/GeoapifyFeature"
import { insertLocation, selectLocationOfGeoapifyPlaceId } from "../DB/Queries/Locations"
import { insertCountry, selectCountryOfCode } from "../DB/Queries/Countries"
import dayjs from "dayjs"
import { Router } from "express"

export function userRoutes(router: Router) {
  router.get("/user/spotifyId/:spotifyId", async (req, res) => {
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

  router.get("/user/username/:username", async (req, res) => {
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

  router.post("/user", async (req: Request, res: Response) => {
    try {
      const newUser: NewUser = req.body.user as NewUser // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const alreadyStoredUser: User | undefined = await selectUserOfSpotifyId(newUser.spotifyId)

      if (alreadyStoredUser) {
        res.status(httpStatusCode.OK).json(alreadyStoredUser)
        return
      }

      const insertedUser: User = await insertUser(newUser)

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const geoapifyFeature: GeoapifyFeature = req.body.geoapifyFeature as GeoapifyFeature
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

  router.put("/user", async (req: Request, res: Response) => {
    try {
      const user: User = req.body.user as User // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const updatedUser = await updateUser(user)

      res.status(httpStatusCode.OK).json(updatedUser)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.delete("/user", async (req: Request, res: Response) => {
    try {
      const user: User = req.body.user as User // eslint-disable-line @typescript-eslint/no-unsafe-member-access
      const storedUser: User | undefined = await selectUserOfId(user.id)

      if (!storedUser) {
        res.status(httpStatusCode.BAD_REQUEST).send("User not found in DB")
        return
      }

      if (dayjs(storedUser.createdAt).isSame(dayjs(user.createdAt), "millisecond")) {
        await deleteUser(user)
      }

      res.sendStatus(httpStatusCode.OK)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })
}
