import BigNumber from "bignumber.js";

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export interface User {
  address: string
  birthBlock: number | null
  name: string
  bio: string
  avatar: string
}

export interface Bork {
  type: BorkType
  timestamp: string
  nonce: number
  txid: string
  refTxid: string
  content: string
  address: string
  isThread: boolean
  threadIndex: number
  replies: number
  reborks: number
  likes: number
}

export interface RelativeBork extends Bork {
  iReply: boolean
  iRebork: boolean
  iLike: boolean
}

export interface RelativeBorkWithUser extends RelativeBork {
  user: User
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

export interface Transaction {
  txid: string
  timestamp: string
  amount: BigNumber
  address: string
}

export interface WalletInfo {
  balance: BigNumber
  transactions: Transaction[]
}

export enum BorkType {
  bork = 'BORK',
  rebork = 're:BORK',
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