import { Bork, User, BorkType, ProfileUpdate, ProfileFields, BorkWithUser } from "../../types/types"
import { avatar1, avatar2 } from './avatars'

export async function getUser(address: string): Promise<User> {
  return sampleUsers.find(u => {
    return u.address === address
  }) as User
}

export async function getBorks(address: string): Promise<Bork[]> {
  return sampleBorks.filter(b => b.address === address)
}

export async function getLikes(address: string): Promise<Bork[]> {
  return []
}

export async function getBorksWithUser(): Promise<BorkWithUser[]> {
  return Promise.all(sampleBorks.map(async b => {
    const user = await getUser(b.address)
    return { ...b, user }
  }))
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

export const sampleBorks: Bork[] = [
  {
    type: BorkType.post,
    timestamp: new Date().toLocaleDateString(),
    txid: '1c8cd0ebe84a81971527e390b0dd9631a14aeb1708428fa1a71914c10930f744',
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    content: 'I like to bork. I like to bork'  
  },
  {
    type: BorkType.post,
    timestamp: new Date().toLocaleDateString(),
    txid: 'f5bf8f50a9b2d9ffd1ac23dc606ae7eb47a3fed7498f508fc000c206c417a675',
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    content: 'Bork some more. Bork some more.'  
  },
  {
    type: BorkType.post,
    timestamp: new Date().toLocaleDateString(),
    txid: '83fc80db8971becfb3bd31a9333bc9fb62b57ffaf1a6029793aed2b67e3e7b72',
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    content: 'Borking like there aint no tomorrow'
  },
  {
    type: BorkType.post,
    timestamp: new Date().toLocaleDateString(),
    txid: '5c4e82eb1a754aca919d92c7f1c7e1f92445a841123d6e07dd444d911f675fbf',
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    content: 'Ill just go ahead and Bork again'
  }
]

export const sampleProfileUpdates: ProfileUpdate[] = [
  {
    timestamp: new Date().toLocaleDateString(),
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    txid: '55599a0761029be6f64189cddee2e587d2b92661dee84bcc89da72d186022c80',
    field: ProfileFields.name,
    value: 'MattHill'
  },
  {
    timestamp: new Date().toLocaleDateString(),
    address: '34MyMBkDQXdq3yG2tszaZYQUtndKnXBaN4',
    txid: '447fe55c3b8b38006b2c1842b050e8e1ae2e926a8cf47a973ce62b4416deb32e',
    field: ProfileFields.name,
    value: 'MatthewHill'
  },
  {
    timestamp: new Date().toLocaleDateString(),
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    txid: '72a5e6bb58ee860fe4ba9d254a13fc319e5f9f6a86a68406fcc39ff558bea287',
    field: ProfileFields.name,
    value: 'DR-BoneZ'
  },
  {
    timestamp: new Date().toLocaleDateString(),
    address: '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh',
    txid: '3b03b3c58c5096cc1b03ecf79af2668fa6e053cb4183d466338259e27e16a441',
    field: ProfileFields.name,
    value: 'Aiden'
  }
]
