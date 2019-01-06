import rp from 'request-promise'
import { config } from '../config/config'
import BigNumber from 'bignumber.js';
import { BorkType, Bork, User, RelativeBorkWithUser, ProfileUpdate, WalletInfo } from '../types/types';
import { sampleUsers, sampleReborks, sampleLikes, sampleBorks, sampleProfileUpdates, sampleTransactions } from './util/mocks';

export async function getTxFee (): Promise<BigNumber> {
  return new BigNumber(1)
}

export async function getUsers (txid: string, type: BorkType): Promise<User[]> {
  const samples = type === BorkType.rebork ? sampleReborks : sampleLikes
  const borks = samples.filter(b => b.txid === txid)
  const users = sampleUsers.filter(u => {
    const bork = borks.find(b => b.address === u.address) as Bork
    if (bork) return u
  })
  return users
}

export async function getUser (address: string): Promise<User> {
  return sampleUsers.find(u => u.address === address) as User
}

export async function getBork (txid: string, myAddress: string): Promise<RelativeBorkWithUser | undefined> {
  const bork = sampleBorks.find(b => b.txid === txid)

  if (bork) {
    return {
      ...bork,
      user: sampleUsers.find(u => u.address === bork.address) as User,
      iReply: false,
      iRebork: false,
      iLike: !!sampleLikes.filter(l => l.address === myAddress).find(l => l.txid === bork.txid),
    }
  }
}

export async function getBorks (myAddress: string, userAddress?: string, txid?: string): Promise<RelativeBorkWithUser[]> {
  let borksToMap: Bork[] = []
  if (userAddress) {
    borksToMap = sampleBorks.filter(b => b.address === userAddress && !b.refTxid)
  } else if (txid) {
    borksToMap = sampleBorks.filter(b => b.txid === txid || b.refTxid === txid)
  } else {
    borksToMap = sampleBorks.filter(b => !b.refTxid)
  }

  return borksToMap.map(b => {
    return {
      ...b,
      user: sampleUsers.find(u => u.address === b.address) as User,
      iReply: false,
      iRebork: false,
      iLike: !!sampleLikes.filter(l => l.address === myAddress).find(l => l.txid === b.txid),
  }})
}

export async function getLikes (address: string): Promise<RelativeBorkWithUser[]> {
  const likes = sampleLikes.filter(l => l.address === address)
  return likes.map(l => {
    const bork = sampleBorks.find(b => b.txid === l.txid) as Bork
    const user = sampleUsers.find(u => u.address === bork.address) as User
    return {
      ...bork,
      user,
      iReply: false,
      iRebork: false,
      iLike: !!likes.find(l => l.txid === bork.txid),
    }})
}

export async function getProfileUpdates (address: string): Promise<ProfileUpdate[]> {
  return sampleProfileUpdates.filter(p => p.address === address)
}

export async function getWallet (address: string): Promise<WalletInfo> {
  const transactions = sampleTransactions.filter(t => t.address === address)
  const balance = transactions.reduce((total, tx) => {
      return total.plus(tx.amount)
  }, new BigNumber(0))

  return {
    balance,
    transactions,
  }
}

export async function getNetworkInfo () {
  const options: rp.Options = {
    method: 'GET',
    url: 'https://chain.so/api/v2/get_info/DOGE',
  }
  try {
    return rp(options)
  } catch (e) {
    console.error('error: ', e)
  }
}

export async function getBestBlockHash () {
  const options: rp.Options = {
    method: 'POST',
    url: 'https://bitcoin.captjakk.com',
    auth: {
      user: config.rpcusername,
      password: config.rpcpassword,
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'getbestblockhash',
      id: 'test1',
      params: {},
    }),
  }
  try {
    const res = await rp(options)
    console.log(res)
  } catch (e) {
    console.error('error: ', e)
  }
}
