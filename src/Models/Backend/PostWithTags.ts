import { Artist, Post, User } from "../DrizzleModels"

/* TODO export type NewPostWithTags = {
  post: NewPost;
  taggedArtists: Artist[];
} */

export type PostWithTags = {
  post: Post;
  taggedArtists: Artist[];
  author?: User;
}
