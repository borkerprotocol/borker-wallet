export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface User {
  address: string
  birthBlock: number | null
  name: string
  bio: string
  avatar: string
}

export interface Post {
  type: PostType
  timestamp: string
  nonce: number
  txid: string
  refTxid: string
  content: string
  address: string
  isThread: boolean
  threadIndex: number
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
  post = 'POST',
  repost = 'REPOST',
  reply = 'REPLY',
  like = 'LIKE',
  follow = 'FOLLOW',
  profileUpdate = 'PROFILE UPDATE',
}

export enum ProfileFields {
  name = 'name',
  avatar = 'avatar',
  bio = 'bio',
}