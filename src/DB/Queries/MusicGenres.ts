import { inArray } from "drizzle-orm"
import { MusicGenre, NewMusicGenre } from "../../Models/DrizzleModels"
import { db } from "../DB"
import { musicGenres } from "../../../drizzle/schema"
import _isEmpty from "lodash/isEmpty"

export async function insertMusicGenres(names: string[]): Promise<MusicGenre[]> {
  if (_isEmpty(names)) {
    return []
  }

  const uniqueGenres: string[] = Array.from(new Set(names))

  const musicGenresToInsert: NewMusicGenre[] = uniqueGenres.map((name) => ({ name }))
  const query = db.insert(musicGenres).values(musicGenresToInsert)
    .onConflictDoNothing()

  return query.returning()
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
