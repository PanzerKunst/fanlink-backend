import { Post } from "../DrizzleModels"

export type EmptyPost = Omit<Post, "content">
