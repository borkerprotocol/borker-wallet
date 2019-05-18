export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type OrderBy<Entity> = { [P in keyof Entity]?: 'ASC' | 'DESC' }

export interface TxData {
  inputs: Utxo[],
  outputs: Output[],
  fee: string
  txHash: string
}

export interface Output {
  address: string
  value: string
  content: string
}

export interface User {
  address: string
  createdAt: string
  birthBlock: number
  name: string
  bio: string
  avatarLink: string
  followingCount: number
  followersCount: number
  iFollow: boolean
  iBlock: boolean
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
  flagsCount: number
  sender: User
  parent: Bork
  mentions: User[]
  extensions: Bork[]
  iComment: boolean
  iRebork: boolean
  iLike: boolean
  iFlag: boolean
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
  createdAt: string
  address: string
  value: string
  raw: string
}

export enum BorkType {
  bork = 'bork',
  comment = 'comment',
  extension = 'extension',
  follow = 'follow',
  like = 'like',
  rebork = 'rebork',
  block = 'block',
  unblock = 'unblock',
  flag = 'flag',
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