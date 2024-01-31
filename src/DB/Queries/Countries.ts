import { eq } from "drizzle-orm"
import { Country, NewCountry } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { countries } from "../_Generated/Drizzle/schema"

export async function insertCountry(newCountry: NewCountry): Promise<Country> {
  const query = db.insert(countries).values(newCountry)
    .onConflictDoNothing()

  const rows = await query.returning()
  const row = rows.at(0)

  return row || (await selectCountryOfCode(newCountry.code))!
}

export async function selectCountryOfCode(code: string): Promise<Country | undefined> {
  const rows = await db.select().from(countries)
    .where(eq(countries.code, code))
    .limit(1)

  return rows.at(0)
}
