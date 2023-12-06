import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { postGenreTags } from "../../../drizzle/schema"
import { MusicGenre, NewPostGenreTag, PostGenreTag } from "../../Models/DrizzleModels"
import { EmptyPost } from "../../Models/Backend/Post"
import { eq } from "drizzle-orm"
import { selectMusicGenresOfIds } from "./MusicGenres"

export async function insertPostGenreTags(emptyPost: EmptyPost, taggedGenres: MusicGenre[]): Promise<PostGenreTag[]> {
  if (_isEmpty(taggedGenres)) {
    return []
  }

  const postGenreTagsToInsert: NewPostGenreTag[] = taggedGenres.map((musicGenre: MusicGenre) => ({
    postId: emptyPost.id,
    genreId: musicGenre.id
  }))

  const query = db.insert(postGenreTags).values(postGenreTagsToInsert)
    .onConflictDoNothing()

  return query.returning()
}

export async function deletePostGenreTags(emptyPost: EmptyPost): Promise<PostGenreTag[]> {
  const query = db.delete(postGenreTags)
    .where(eq(postGenreTags.postId, emptyPost.id))

  return query.returning()
}

export async function selectGenresTaggedInPost(postId: number): Promise<MusicGenre[]> {
  const genreTags: PostGenreTag[] = await db.select().from(postGenreTags)
    .where(eq(postGenreTags.postId, postId))

  return await selectMusicGenresOfIds(genreTags.map((postGenreTag: PostGenreTag) => postGenreTag.genreId))
}
