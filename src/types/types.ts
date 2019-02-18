import BigNumber from "bignumber.js";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface User {
  address: string
  createdAt: string
  birthBlock: number
  name: string
  bio: string
  avatarLink: string
  blockersCount: number
  blockingCount: number
  followingCount: number
  followersCount: number
  iFollow: boolean
}

export interface Bork {
  type: BorkType
  createdAt: string
  nonce: number
  txid: string
  content: string
  fee: string
  value: string
  commentsCount: number
  reborksCount: number
  likesCount: number
  sender: User
  parent: Bork
  mentions: User[]
  extensions: Bork[]
  iComment: boolean
  iRebork: boolean
  iLike: boolean
}

export interface FullUser extends User {
  borks: Bork[]
  profileUpdates: ProfileUpdate[]
}

export interface ProfileUpdate {
  address: string
  timestamp: string
  txid: string
  field: ProfileFields
  value: string
}

export interface Utxo {
  txid: string
  index: number
  value: string
}

export enum BorkType {
  bork = 'bork',
  comment = 'comment',
  extension = 'extension',
  follow = 'follow',
  like = 'like',
  rebork = 'rebork',
  setName = 'set_name',
  setBio = 'set_bio',
  setAvatar = 'set_avatar',
  unfollow = 'unfollow',
}

export enum ProfileFields {
  name = 'name',
  avatar = 'avatar',
  bio = 'bio',
}