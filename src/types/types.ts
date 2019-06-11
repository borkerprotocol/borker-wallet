export type OrderBy<Entity> = { [P in keyof Entity]?: 'ASC' | 'DESC' }

export interface User {
  address: string
  createdAt: string
  birthBlock: number
  name: string
  bio: string
  avatarLink: string
  followingCount: number
  followersCount: number
  iFollow: string
  iBlock: string
}

export interface Bork {
  type: BorkType
  createdAt: string
  nonce: number
  position: number
  txid: string
  content: string
  sender: User
  parent: Bork
  mentions: User[]
  extensions: Bork[]
  commentsCount: number
  reborksCount: number
  likesCount: number
  flagsCount: number
  iComment: string | null
  iRebork: string | null
  iLike: string | null
  iFlag: string | null
}

export enum BorkType {
  SetName = 'set_name',
  SetBio = 'set_bio',
  SetAvatar = 'set_avatar',
  Bork = 'bork',
  Comment = 'comment',
  Rebork = 'rebork',
  Extension = 'extension',
  Delete = 'delete',
  Like = 'like',
  Flag = 'flag',
  Follow = 'follow',
  Block = 'block',
}

export interface FullUser extends User {
  borks: Bork[]
}

export interface Utxo {
  txid: string
  position: number
  createdAt: string
  address: string
  value: string
  raw: string
}

export enum ProfileFields {
  name = 'name',
  avatar = 'avatar',
  bio = 'bio',
}