import { Post, User, PostType, ProfileUpdate, ProfileFields, RelativePost, RelativePostWithUser, Like } from "../../types/types"
import { avatar1, avatar2 } from './avatars'
import moment from 'moment'

export async function getUser(address: string): Promise<User> {
  return sampleUsers.find(u => u.address === address) as User
}

export async function getRelativePosts(userAddress: string, myAddress: string): Promise<RelativePost[]> {
  return samplePosts
          .filter((p: Post) => p.address === userAddress)
          .map(p => {
            return {
              ...p,
              iReply: false,
              iRepost: false,
              iLike: !!sampleLikes.filter(l => l.address === myAddress).find(l => l.txid === p.txid)
          }})
}

export async function getPosts(address: string): Promise<RelativePostWithUser[]> {
  return samplePosts.map(p => {
    const user = sampleUsers.find(u => u.address === p.address) as User
    return {
      ...p,
      user,
      iReply: false,
      iRepost: false,
      iLike: !!sampleLikes.filter(l => l.address === address).find(l => l.txid === p.txid)
    }})
}

export async function getLikes(address: string): Promise<RelativePostWithUser[]> {
  const likes = sampleLikes.filter(l => l.address === address)
  return likes.map(l => {
    const post = samplePosts.find(p => p.txid === l.txid) as Post
    const user = sampleUsers.find(u => u.address === post.address) as User
    return {
      ...post,
      user,
      iReply: false,
      iRepost: false,
      iLike: !!likes.find(l => l.txid === post.txid)
    }})
}

export async function getProfileUpdates(address: string): Promise<ProfileUpdate[]> {
  return sampleProfileUpdates.filter(p => p.address === address)
}

export const sampleUsers: User[] = [
  {
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    birthBlock: 551973,
    name: 'MattHill',
    bio: '',
    avatar: avatar1
  },
  {
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    birthBlock: 421871,
    name: 'DR-BoneZ',
    bio: '',
    avatar: avatar2
  }
]

export const samplePosts: Post[] = [
  {
    type: PostType.post,
    timestamp: moment().subtract(30, 's').toISOString(),
    txid: '1c8cd0ebe84a81971527e390b0dd9631a14aeb1708428fa1a71914c10930f744',
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    content: 'I like to post. I like to post',
    replies: 2,
    reposts: 4,
    likes: 20
  },
  {
    type: PostType.post,
    timestamp: moment().subtract(30, 'm').toISOString(),
    txid: 'f5bf8f50a9b2d9ffd1ac23dc606ae7eb47a3fed7498f508fc000c206c417a675',
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    content: 'Post some more. Post some more.',
    replies: 4,
    reposts: 20,
    likes: 100
  },
  {
    type: PostType.post,
    timestamp: moment().subtract(12, 'h').toISOString(),
    txid: '83fc80db8971becfb3bd31a9333bc9fb62b57ffaf1a6029793aed2b67e3e7b72',
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    content: 'Posting like there aint no tomorrow',
    replies: 44,
    reposts: 500,
    likes: 250
  },
  {
    type: PostType.post,
    timestamp: moment().subtract(2, 'd').toISOString(),
    txid: '5c4e82eb1a754aca919d92c7f1c7e1f92445a841123d6e07dd444d911f675fbf',
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    content: 'Ill just go ahead and Post again',
    replies: 0,
    reposts: 2,
    likes: 15
  }
]

export const sampleLikes: Like[] = [
  {
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    txid: '1c8cd0ebe84a81971527e390b0dd9631a14aeb1708428fa1a71914c10930f744'
  },
  {
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    txid: '83fc80db8971becfb3bd31a9333bc9fb62b57ffaf1a6029793aed2b67e3e7b72'
  }
]

export const sampleProfileUpdates: ProfileUpdate[] = [
  {
    timestamp: moment().subtract(10, 'd').toISOString(),
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    txid: '55599a0761029be6f64189cddee2e587d2b92661dee84bcc89da72d186022c80',
    field: ProfileFields.name,
    value: 'MattHill'
  },
  {
    timestamp: moment().subtract(14, 'd').toISOString(),
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    txid: '447fe55c3b8b38006b2c1842b050e8e1ae2e926a8cf47a973ce62b4416deb32e',
    field: ProfileFields.name,
    value: 'MatthewHill'
  },
  {
    timestamp: moment().subtract(2, 'd').toISOString(),
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    txid: '72a5e6bb58ee860fe4ba9d254a13fc319e5f9f6a86a68406fcc39ff558bea287',
    field: ProfileFields.name,
    value: 'DR-BoneZ'
  },
  {
    timestamp: moment().subtract(7, 'd').toISOString(),
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    txid: '8013bcfc7f4620a82ac7c778e31c2f19a2a7cea43fb76adc9841d24fffb12a58',
    field: ProfileFields.avatar,
    value: avatar2
  },
  {
    timestamp: moment().subtract(30, 'd').toISOString(),
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    txid: '3b03b3c58c5096cc1b03ecf79af2668fa6e053cb4183d466338259e27e16a441',
    field: ProfileFields.name,
    value: 'Aiden'
  }
]
