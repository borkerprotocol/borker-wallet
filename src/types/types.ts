export interface User {
  address: string
  birthBlock?: number
  name?: string
  bio?: string
  avatar?: string
}

export interface Post {
  type: PostType
  timestamp: string
  txid: string
  content: string
  address: string
}

export interface PostWithUser extends Post {
  user: User
}

export interface FullUser extends User {
  posts: Post[]
  profileUpdates: ProfileUpdate[]
}

export interface ProfileUpdate {
  address: string
  timestamp: string
  txid: string
  field: ProfileFields
  value: string
}

export enum PostType {
  post = 'post',
  reply = 'reply',
  repost = 'repost'
}

export enum ProfileFields {
  name = 'name',
  avatar = 'avatar',
  bio = 'bio'
}