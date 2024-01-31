import { db } from "../DB"
import { Location, NewLocation } from "../../Models/DrizzleModels"
import { locations } from "../_Generated/Drizzle/schema"
import { eq } from "drizzle-orm"

export async function insertLocation(newLocation: NewLocation) {
  await db.insert(locations).values(newLocation)
    .onConflictDoNothing()
}

export async function selectLocationOfGeoapifyPlaceId(geoapifyPlaceId: string): Promise<Location | undefined> {
  const rows = await db.select().from(locations)
    .where(eq(locations.geoapifyPlaceId, geoapifyPlaceId))
    .limit(1)

  return rows.at(0)
}
