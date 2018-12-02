export interface User {
  birthBlock: number
  address: string
  name?: string
  bio?: string
  avatar?: string
}

export interface Bork {
  type: BorkType
  timestamp: string
  txid: string
  content: string
  address: string
}

export interface BorkWithUser extends Bork {
  user: User
}

export interface ProfileUpdate {
  address: string
  timestamp: string
  txid: string
  field: ProfileFields
  value: string
}

export enum BorkType {
  post = 'post',
  reply = 'reply',
  rebork = 'rebork'
}

export enum ProfileFields {
  name = 'name',
  avatar = 'avatar',
  bio = 'bio'
}