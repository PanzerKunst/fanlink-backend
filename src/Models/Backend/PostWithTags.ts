import { Artist, MusicGenre, NewPost, Post } from "../DrizzleModels"
import { EmptyPost } from "./Post"

export type NewPostWithTags = {
  post: NewPost;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
}

export type PostWithTags = {
  post: Post;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
}

export type EmptyPostWithTags = {
  post: EmptyPost;
  taggedArtists: Artist[];
  taggedGenres: MusicGenre[];
}
