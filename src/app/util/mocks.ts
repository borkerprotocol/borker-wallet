import { Post, User, PostType, ProfileUpdate, ProfileFields, RelativePostWithUser } from "../../types/types"
import { avatar1, avatar2 } from './avatars'
import BigNumber from 'bignumber.js'
import moment from 'moment'

export async function getRates (): Promise<{ txRate: BigNumber, charRate: BigNumber }> {
  return { txRate: new BigNumber(1), charRate: new BigNumber(.01) }
}

export async function getUsers (txid: string, type: PostType): Promise<User[]> {
  const samples = type === PostType.repost ? sampleReposts : sampleLikes
  const posts = samples.filter(p => p.txid === txid)
  const users = sampleUsers.filter(u => {
    const post = posts.find(p => p.address === u.address) as Post
    if (post) return u
  })
  return users
}

export async function getUser (address: string): Promise<User> {
  return sampleUsers.find(u => u.address === address) as User
}

export async function getPosts (myAddress: string, userAddress?: string, txid?: string): Promise<RelativePostWithUser[]> {
  let postsToMap: Post[] = []
  if (userAddress) {
    postsToMap = samplePosts.filter(p => p.address === userAddress && !p.refTxid)
  } else if (txid) {
    postsToMap = samplePosts.filter(p => p.txid === txid || p.refTxid === txid)
  } else {
    postsToMap = samplePosts.filter(p => !p.refTxid)
  }

  return postsToMap.map(p => {
    return {
      ...p,
      user: sampleUsers.find(u => u.address === p.address) as User,
      iReply: false,
      iRepost: false,
      iLike: !!sampleLikes.filter(l => l.address === myAddress).find(l => l.txid === p.txid),
  }})
}

export async function getLikes (address: string): Promise<RelativePostWithUser[]> {
  const likes = sampleLikes.filter(l => l.address === address)
  return likes.map(l => {
    const post = samplePosts.find(p => p.txid === l.txid) as Post
    const user = sampleUsers.find(u => u.address === post.address) as User
    return {
      ...post,
      user,
      iReply: false,
      iRepost: false,
      iLike: !!likes.find(l => l.txid === post.txid),
    }})
}

export async function getProfileUpdates (address: string): Promise<ProfileUpdate[]> {
  return sampleProfileUpdates.filter(p => p.address === address)
}

export const sampleWords = [
  'blade',
  'cruise',
  'jewel',
  'thank',
  'upset',
  'random',
  'thing',
  'rose',
  'rare',
  'split',
  'crystal',
  'opinion',
]

export const sampleUsers: User[] = [
  {
    address: 'DSJdZogGLmREMZTyJGSzSs2RL9UJjeqKd7',
    birthBlock: 551973,
    name: 'MattHill',
    bio: 'Tae Kwon Do master, standing up for freedom of speech.',
    avatar: avatar1,
  },
  {
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    birthBlock: 421871,
    name: 'DR-BoneZ',
    bio: 'Hacker extraordinaire, and a mean karaoke singer too.',
    avatar: avatar2,
  },
]

export const samplePosts: Post[] = [
  {
    type: PostType.post,
    timestamp: moment().subtract(30, 's').toISOString(),
    nonce: 0,
    txid: '8b5ab18a8593ba3f1abae61c07bf02169487c58b0e244922b6c4578eaf6e0d35',
    refTxid: '',
    address: 'DSJdZogGLmREMZTyJGSzSs2RL9UJjeqKd7',
    content: 'I like to bork. I like to bork',
    isThread: false,
    threadIndex: 0,
    replies: 2,
    reposts: 4,
    likes: 20,
  },
  {
    type: PostType.post,
    timestamp: moment().subtract(30, 'm').toISOString(),
    nonce: 0,
    txid: '43873bcc83d6d811df6bff1909a5cd3fc98eb84bbaded5a44443fc86f9ef0e3b',
    refTxid: '',
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    content: 'Bork some more. Bork some more.',
    isThread: false,
    threadIndex: 0,
    replies: 4,
    reposts: 20,
    likes: 100,
  },
  {
    type: PostType.post,
    timestamp: moment().subtract(12, 'h').toISOString(),
    nonce: 1,
    txid: '069aa2f138cbdc6ebd379b1e6d1cb7f86c8770ad58be27006671d528a75ba0e3',
    refTxid: '',
    address: 'DSJdZogGLmREMZTyJGSzSs2RL9UJjeqKd7',
    content: 'Borking like there aint no tomorrow',
    isThread: false,
    threadIndex: 0,
    replies: 44,
    reposts: 500,
    likes: 250,
  },
  {
    type: PostType.post,
    timestamp: moment().subtract(2, 'd').toISOString(),
    nonce: 1,
    txid: '164af924f859c9936f3bda737a986a1a85b3708c9b2fd150b36b964b11c858a6',
    refTxid: '',
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    content: 'This is a long bork that will take up two whole transactions. I will write',
    isThread: true,
    threadIndex: 0,
    replies: 0,
    reposts: 2,
    likes: 15,
  },
  {
    type: PostType.reply,
    timestamp: moment().subtract(2, 'd').toISOString(),
    nonce: 2,
    txid: 'e3b3a8bf7e3796d908b731c0d16baba0f1e161b97d917e00cde81ff0f1452fd1',
    refTxid: '164af924f859c9936f3bda737a986a1a85b3708c9b2fd150b36b964b11c858a6',
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    content: 'just a little more. See, I told you. Bork on. We will actually do one more',
    isThread: true,
    threadIndex: 1,
    replies: 1,
    reposts: 1,
    likes: 1,
  },
  {
    type: PostType.reply,
    timestamp: moment().subtract(2, 'd').toISOString(),
    nonce: 3,
    txid: 'ead67d64e2f563400873cbbe47601e89cecfabf5a4c0e05d599cd7ee98388b74',
    refTxid: '164af924f859c9936f3bda737a986a1a85b3708c9b2fd150b36b964b11c858a6',
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    content: 'just to seal the deal. There. Done and done.',
    isThread: true,
    threadIndex: 2,
    replies: 1,
    reposts: 2,
    likes: 10,
  },
]

export const sampleReposts: Partial<Post>[] = []

export const sampleLikes: Partial<Post>[] = [
  {
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    txid: '8b5ab18a8593ba3f1abae61c07bf02169487c58b0e244922b6c4578eaf6e0d35',
  },
  {
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    txid: '069aa2f138cbdc6ebd379b1e6d1cb7f86c8770ad58be27006671d528a75ba0e3',
  },
]

export const sampleProfileUpdates: ProfileUpdate[] = [
  {
    timestamp: moment().subtract(10, 'd').toISOString(),
    address: 'DSJdZogGLmREMZTyJGSzSs2RL9UJjeqKd7',
    txid: '39128e8edacce1ada4e1df9aa5fc91431302ef951df06a78e13f4fbc3759e752',
    field: ProfileFields.name,
    value: 'MattHill',
  },
  {
    timestamp: moment().subtract(14, 'd').toISOString(),
    address: 'DSJdZogGLmREMZTyJGSzSs2RL9UJjeqKd7',
    txid: 'd128ab6c2de86559b0dfe408a62a37073a65934eda8c4283bcfacb0cf3da7b56',
    field: ProfileFields.name,
    value: 'MatthewHill',
  },
  {
    timestamp: moment().subtract(2, 'd').toISOString(),
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    txid: '94a10c877bdace5b0ccf17f0b718ba602c9f878f9a4a35fd3e68518accb859c2',
    field: ProfileFields.name,
    value: 'DR-BoneZ',
  },
  {
    timestamp: moment().subtract(7, 'd').toISOString(),
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    txid: '41266e19b39dbba35128f3af72299b4636cb9250d81741b5db1987716043a7af',
    field: ProfileFields.avatar,
    value: avatar2,
  },
  {
    timestamp: moment().subtract(30, 'd').toISOString(),
    address: 'D65dwxsVdaCFHUGqAVWKgdddsa9ADxXcGk',
    txid: '774bef2197e6394112e1ee18246f1a0137ddb19a4d2d4464c1e25217977a0460',
    field: ProfileFields.name,
    value: 'Aiden',
  },
]
