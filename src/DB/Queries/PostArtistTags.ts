import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { postArtistTags } from "../../../drizzle/schema"
import { Artist, NewPostArtistTag, PostArtistTag } from "../../Models/DrizzleModels"
import { EmptyPost } from "../../Models/Backend/Post"
import { eq } from "drizzle-orm"
import { selectArtistsOfIds } from "./Artists"

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

export async function selectArtistsTaggedInPost(postId: number): Promise<Artist[]> {
  const artistTags: PostArtistTag[] = await db.select().from(postArtistTags)
    .where(eq(postArtistTags.postId, postId))

  return await selectArtistsOfIds(artistTags.map((postArtistTag: PostArtistTag) => postArtistTag.artistId))
}
