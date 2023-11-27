import { db } from "../DB"
import { Location, NewLocation } from "../../Models/DrizzleModels"
import { locations } from "../../../drizzle/schema"
import { eq } from "drizzle-orm"

export async function insertLocation(newLocation: NewLocation): Promise<Location> {
  const query = db.insert(locations).values(newLocation)

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert location")
  }

  return row
}

export async function selectLocationOfGeoapifyPlaceId(geoapifyPlaceId: string): Promise<Location | undefined> {
  const rows = await db.select().from(locations)
    .where(eq(locations.geoapifyPlaceId, geoapifyPlaceId))
    .limit(1)

  return rows.at(0)
}
