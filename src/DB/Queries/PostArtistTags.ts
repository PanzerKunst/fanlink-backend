import _isEmpty from "lodash/isEmpty"
import { db } from "../DB"
import { postArtistTags } from "../_Generated/Drizzle/schema"
import { Artist, NewPostArtistTag, PostArtistTag } from "../../Models/DrizzleModels"
import { eq } from "drizzle-orm"
import { selectArtistsOfIds } from "./Artists"

export async function insertPostArtistTags(postId: number, taggedArtists: Artist[]) {
  if (_isEmpty(taggedArtists)) {
    return
  }

  const postArtistTagsToInsert: NewPostArtistTag[] = taggedArtists.map((artist: Artist) => ({
    postId: postId,
    artistId: artist.id
  }))

  await db.insert(postArtistTags).values(postArtistTagsToInsert)
    .onConflictDoNothing()
}

export async function deletePostArtistTags(postId: number): Promise<PostArtistTag[]> {
  const query = db.delete(postArtistTags)
    .where(eq(postArtistTags.postId, postId))

  return query.returning()
}

export async function selectArtistsTaggedInPost(postId: number): Promise<Artist[]> {
  const artistTags: PostArtistTag[] = await db.select().from(postArtistTags)
    .where(eq(postArtistTags.postId, postId))

  return await selectArtistsOfIds(artistTags.map((postArtistTag: PostArtistTag) => postArtistTag.artistId))
}

export async function selectPostIdsTaggingArtist(artistId: number): Promise<number[]> {
  const rows = await db.select().from(postArtistTags)
    .where(eq(postArtistTags.artistId, artistId))

  return rows.map(row => row.postId)
}
