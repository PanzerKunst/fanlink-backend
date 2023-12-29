import { Artist, NewPost, Post, User } from "../DrizzleModels"
import { EmptyPost } from "./Post"

export type NewPostWithTags = {
  post: NewPost;
  taggedArtists: Artist[];
}

export type PostWithAuthorAndTags = {
  post: Post;
  author: User;
  taggedArtists: Artist[];
}

export type EmptyPostWithTags = {
  post: EmptyPost;
  taggedArtists: Artist[];
}
