import { inArray } from "drizzle-orm"
import { MusicGenre, NewMusicGenre } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { musicGenres } from "../_Generated/Drizzle/schema"
import _isEmpty from "lodash/isEmpty"

export async function insertMusicGenres(names: string[]) {
  if (_isEmpty(names)) {
    return
  }

  const uniqueGenres: string[] = Array.from(new Set(names))

  const musicGenresToInsert: NewMusicGenre[] = uniqueGenres.map((name) => ({ name }))
  await db.insert(musicGenres).values(musicGenresToInsert)
    .onConflictDoNothing()
}

export async function selectAllMusicGenres(): Promise<MusicGenre[]> {
  return db.select().from(musicGenres)
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
