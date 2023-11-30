import { inArray, sql } from "drizzle-orm"
import { MusicGenre, NewMusicGenre } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { musicGenres } from "../../../drizzle/schema"
import _isEmpty from "lodash/isEmpty"

export async function selectMusicGenresNotYetStored(names: string[]): Promise<string[]> {
  const rows = await db.select().from(musicGenres)
    .where(sql`${musicGenres.name} in ${names}`)

  const storedGenreNames: string[] = rows.map((row) => row.name)

  return names.filter((name) => !storedGenreNames.includes(name))
}

export async function insertMusicGenres(names: string[]): Promise<MusicGenre[]> {
  if (_isEmpty(names)) {
    return []
  }

  const uniqueGenres: string[] = Array.from(new Set(names))

  const musicGenresToInsert: NewMusicGenre[] = uniqueGenres.map((name) => ({ name }))
  const query = db.insert(musicGenres).values(musicGenresToInsert)

  return query.returning()
}

export async function selectMusicGenresOfIds(ids: number[]): Promise<MusicGenre[]> {
  if (_isEmpty(ids)) {
    return []
  }

  return db.select().from(musicGenres)
    .where(inArray(musicGenres.id, ids))
}

export async function selectMusicGenresOfNames(names: string[]): Promise<MusicGenre[]> {
  if (_isEmpty(names)) {
    return []
  }

  return db.select().from(musicGenres)
    .where(inArray(musicGenres.name, names))
}
