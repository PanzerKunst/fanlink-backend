import { Artist, MusicGenre, NewPost, Post, User } from "../DrizzleModels"
import { EmptyPost } from "./Post"

export type NewPostWithTags = {
  post: NewPost;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
}

export type PostWithAuthorAndTags = {
  post: Post;
  author: User;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
}

export type EmptyPostWithTags = {
  post: EmptyPost;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
}
