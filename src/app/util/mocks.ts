import { Post, User } from "../../types/types"
import { avatar1, avatar2 } from './avatars'

export async function getUser(address: string): Promise<User> {
  return sampleUsers.find(user => {
    return user.address === address
  }) as User
}

export async function getPosts(): Promise<Post[]> {
  return samplePosts
}

export const sampleUsers: User[] = [
  {
    name: 'MattHill',
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    birthBlock: 551973,
    avatar: avatar1,
    profileTxids: [
      '447fe55c3b8b38006b2c1842b050e8e1ae2e926a8cf47a973ce62b4416deb32e',
      '55599a0761029be6f64189cddee2e587d2b92661dee84bcc89da72d186022c80'
    ],
    postTxids: [
      '1c8cd0ebe84a81971527e390b0dd9631a14aeb1708428fa1a71914c10930f744',
      '83fc80db8971becfb3bd31a9333bc9fb62b57ffaf1a6029793aed2b67e3e7b72'
    ]
  },
  {
    name: 'AidenMcClelland',
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    birthBlock: 421871,
    avatar: avatar2,
    profileTxids: [
      '3b03b3c58c5096cc1b03ecf79af2668fa6e053cb4183d466338259e27e16a441',
      '72a5e6bb58ee860fe4ba9d254a13fc319e5f9f6a86a68406fcc39ff558bea287'
    ],
    postTxids: [
      'f5bf8f50a9b2d9ffd1ac23dc606ae7eb47a3fed7498f508fc000c206c417a675',
      '5c4e82eb1a754aca919d92c7f1c7e1f92445a841123d6e07dd444d911f675fbf'
    ]
  }
]

export const samplePosts: Post[] = [
  {
    timestamp: new Date().toLocaleDateString(),
    txid: '9d7a8a062d13d9ce87558b0107f29c3a241d6cea0c2ae432d559b3258e67bd7b',
    user: sampleUsers[0],
    content: 'I like post. I like post'  
  },
  {
    timestamp: new Date().toLocaleDateString(),
    txid: '44f192d7b259859beed1a41a5a7cb5f0d5bb4f906c75d0e1e84edd3694386dd7',
    user: sampleUsers[1],
    content: 'Post some more. Post some more.'  
  }
]
