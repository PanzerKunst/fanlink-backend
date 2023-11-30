import { eq, sql } from "drizzle-orm"
import { MusicGenre, NewMusicGenre } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { musicGenres } from "../../../drizzle/schema"

export async function insertMusicGenre(newMusicGenre: NewMusicGenre): Promise<MusicGenre> {
  const query = db.insert(musicGenres).values(newMusicGenre)

  const rows = await query.returning()
  const row = rows.at(0)

  if (!row) {
    throw new Error("Failed to insert music genre")
  }

  return row
}

export async function selectGenreOfName(name: string): Promise<MusicGenre | undefined> {
  const rows = await db.select().from(musicGenres)
    .where(eq(musicGenres.name, name))
    .limit(1)

  return rows.at(0)
}

export async function selectGenresNotYetStored(genreNames: string[]): Promise<string[]> {
  const rows = await db.select().from(musicGenres)
    .where(sql`${musicGenres.name} in ${genreNames}`)

  const storedGenreNames: string[] = rows.map((row) => row.name)

  return genreNames.filter((name) => !storedGenreNames.includes(name))
}
