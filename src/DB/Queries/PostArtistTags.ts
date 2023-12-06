import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { postArtistTags } from "../../../drizzle/schema"
import { Artist, NewPostArtistTag, PostArtistTag } from "../../Models/DrizzleModels"
import { EmptyPost } from "../../Models/Backend/Post"
import { eq } from "drizzle-orm"

export async function insertPostArtistTags(emptyPost: EmptyPost, taggedArtists: Artist[]): Promise<PostArtistTag[]> {
  if (_isEmpty(taggedArtists)) {
    return []
  }

  const postArtistTagsToInsert: NewPostArtistTag[] = taggedArtists.map((artist: Artist) => ({
    postId: emptyPost.id,
    artistId: artist.id
  }))

  const query = db.insert(postArtistTags).values(postArtistTagsToInsert)
    .onConflictDoNothing()

  return query.returning()
}

export async function deletePostArtistTags(emptyPost: EmptyPost): Promise<PostArtistTag[]> {
  const query = db.delete(postArtistTags)
    .where(eq(postArtistTags.postId, emptyPost.id))

  return query.returning()
}
