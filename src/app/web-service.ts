import rp from 'request-promise'
import { config } from '../config/config'
import BigNumber from 'bignumber.js'
import { BorkType, User, Bork, ProfileUpdate, WalletInfo } from '../types/types'
import { sampleTransactions } from './util/mocks'

const url = 'http://localhost:3000'

class WebService {

  constructor (public myAddress?: string) {}

  async getTxFee (): Promise<BigNumber> {
    return new BigNumber(1)
  }

  async getUsers (txParams?: { txid: string, types: BorkType[] }): Promise<User[]> {

    const route = txParams ? `/transactions/${txParams.txid}/users` : `/users`
    const qs = txParams ? { types: txParams.types } : {}

    const options: rp.Options = {
      method: 'GET',
      url: url + route,
      headers: {
        'myAddress': this.myAddress,
      },
      qs,
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res

    // const samples = type === BorkType.rebork ? sampleReborks : sampleLikes
    // const borks = samples.filter(b => b.txid === txid)
    // const users = sampleUsers.filter(u => {
    //   const bork = borks.find(b => b.address === u.address) as Bork
    //   if (bork) return u
    // })
    // return users
  }

  async getUser (address: string): Promise<User> {

    const options: rp.Options = {
      method: 'GET',
      url: url + `/users/${address}`,
      headers: {
        'myAddress': this.myAddress,
      },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res

    // return sampleUsers.find(u => u.address === address) as User
  }

  async getBork (txid: string): Promise<Bork> {

    const options: rp.Options = {
      method: 'GET',
      url: url + `/transactions/${txid}`,
      headers: {
        'myAddress': this.myAddress,
      },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res

    // const bork = sampleBorks.find(b => b.txid === txid)

    // if (bork) {
    //   return {
    //     ...bork,
    //     user: sampleUsers.find(u => u.address === bork.address) as User,
    //     iComment: false,
    //     iRebork: false,
    //     iLike: !!sampleLikes.filter(l => l.address === this.myAddress).find(l => l.txid === bork.txid),
    //   }
    // }
  }

  async getBorks (params: IndexTxParams = {}): Promise<Bork[]> {

    const options: rp.Options = {
      method: 'GET',
      url: url + '/transactions',
      headers: {
        'myAddress': this.myAddress,
      },
      qs: params,
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res

    // let borksToMap: Bork[] = []
    // if (address) {
    //   borksToMap = sampleBorks.filter(b => b.address === address && !b.refTxid)
    // } else if (txid) {
    //   borksToMap = sampleBorks.filter(b => b.txid === txid || b.refTxid === txid)
    // } else {
    //   borksToMap = sampleBorks.filter(b => !b.refTxid)
    // }
  
    // return borksToMap.map(b => {
    //   return {
    //     ...b,
    //     user: sampleUsers.find(u => u.address === b.address) as User,
    //     iComment: false,
    //     iRebork: false,
    //     iLike: !!sampleLikes.filter(l => l.address === this.props.address).find(l => l.txid === b.txid),
    // }})
  }
  
  async getProfileUpdates (senderAddress: string): Promise<Bork[]> {
    const options: rp.Options = {
      method: 'GET',
      url: url + `/transactions`,
      headers: {
        'myAddress': this.myAddress,
      },
      qs: {
        senderAddress,
        types: [BorkType.setName, BorkType.setBio, BorkType.setAvatar],
      },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res

    // return sampleProfileUpdates.filter(p => p.address === address)
  }
  
  async getWallet (address: string): Promise<WalletInfo> {
    const transactions = sampleTransactions.filter(t => t.address === address)
    const balance = transactions.reduce((total, tx) => {
        return total.plus(tx.amount)
    }, new BigNumber(0))
  
    return {
      balance,
      transactions,
    }
  }
  
  async getNetworkInfo () {
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
  
  private async rpcRequest (method: string, params: {} = {}) {

    const options: rp.Options = {
      method: 'POST',
      url: 'https://bitcoin.captjakk.com',
      auth: {
        user: config.rpcusername,
        password: config.rpcpassword,
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method, // 'getbestblockhash'
        id: 'test1',
        params,
      }),
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res
  }
}

export default WebService

export interface IndexParams {
  page?: number
  perPage?: number
}

export interface IndexTxParams extends IndexParams {
  senderAddress?: string
  parentTxid?: string
  types?: BorkType[]
}
