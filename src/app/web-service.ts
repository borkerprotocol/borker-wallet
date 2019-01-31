import rp from 'request-promise'
import { config } from '../config/config'
import BigNumber from 'bignumber.js'
import { BorkType, User, Bork } from '../types/types'
import { FollowsType } from './pages/user-list/user-list'
import { UserFilter } from './pages/sniff-around/sniff-around'

class WebService {

  constructor (public myAddress?: string) {}

  async getTxFee (): Promise<BigNumber> {
    return new BigNumber(1)
  }

  async getUsers (filter: UserFilter): Promise<User[]> {

    const options: rp.Options = {
      method: 'GET',
      url: config.borker.url + `/users`,
      headers: {
        'myAddress': this.myAddress,
      },
      qs: { filter },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res
  }

  async getUsersByTx (txid: string, type: BorkType.rebork | BorkType.like): Promise<User[]> {

    const options: rp.Options = {
      method: 'GET',
      url: config.borker.url + `/transactions/${txid}/users`,
      headers: {
        'myAddress': this.myAddress,
      },
      qs: { type },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res
  }

  async getUsersByUser (address: string, type: FollowsType): Promise<User[]> {

    const options: rp.Options = {
      method: 'GET',
      url: config.borker.url + `/users/${address}/users`,
      headers: {
        'myAddress': this.myAddress,
      },
      qs: { type },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res
  }

  async getUser (address: string): Promise<User> {

    const options: rp.Options = {
      method: 'GET',
      url: config.borker.url + `/users/${address}`,
      headers: {
        'myAddress': this.myAddress,
      },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res
  }

  async getBork (txid: string): Promise<Bork> {

    const options: rp.Options = {
      method: 'GET',
      url: config.borker.url + `/transactions/${txid}`,
      headers: {
        'myAddress': this.myAddress,
      },
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res
  }

  async getBorks (params: IndexTxParams = {}): Promise<Bork[]> {

    const options: rp.Options = {
      method: 'GET',
      url: config.borker.url + '/transactions',
      headers: {
        'myAddress': this.myAddress,
      },
      qs: params,
    }

    const res = JSON.parse(await rp(options))
    console.log(res)
    return res
  }
  
  async getProfileUpdates (senderAddress: string): Promise<Bork[]> {
    const options: rp.Options = {
      method: 'GET',
      url: config.borker.url + `/transactions`,
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
  }
}

export default WebService

export interface Response {
  result: string
  error: string | null
  id: string
}

export interface IndexParams {
  page?: number
  perPage?: number
}

export interface IndexTxParams extends IndexParams {
  senderAddress?: string
  parentTxid?: string
  types?: BorkType[]
}
