export interface User {
  address: string
  name: string
  birthBlock: number
  avatar?: string
  profileTxids: string[]
  postTxids: string[]
}

export interface Post {
  timestamp: string
  txid: string
  content: string
  user: User
}
