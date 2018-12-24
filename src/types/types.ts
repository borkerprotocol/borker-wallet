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
  replies: number
  reposts: number
  likes: number
}

export interface RelativePost extends Post {
  iReply: boolean
  iRepost: boolean
  iLike: boolean
}

export interface RelativePostWithUser extends RelativePost {
  user: User
}

export interface Like {
  address: string
  txid: string
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
  repost = 'repost',
  reply = 'reply',
}

export enum ProfileFields {
  name = 'name',
  avatar = 'avatar',
  bio = 'bio',
}