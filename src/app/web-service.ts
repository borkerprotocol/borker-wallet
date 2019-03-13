import rp from 'request-promise'
import * as Storage from 'idb-keyval'
import BigNumber from 'bignumber.js'
import { BorkType, User, Bork, OrderBy, TxData } from '../types/types'
import { FollowsType } from './pages/user-list/user-list'
import { BorkerConfig } from './pages/settings/settings'

class WebService {

  constructor () {}

  async getBalance (address: string): Promise<BigNumber> {
    const options: rp.Options = {
      method: 'GET',
      url: `/users/${address}/balance`,
    }

    const res = await this.request(options)
    return new BigNumber(res)
  }

  async construct (body: ConstructRequest): Promise<TxData[]> {
    const options: rp.Options = {
      method: 'POST',
      url: `/transactions/construct`,
      body,
    }

    return this.request(options)
  }

  async signAndBroadcastTx (body: string[]): Promise<void> {
    const options: rp.Options = {
      method: 'POST',
      url: `/transactions/broadcast`,
      body,
    }

    return this.request(options)
  }

  async getUsers (order: OrderBy<User>): Promise<User[]> {

    const options: rp.Options = {
      method: 'GET',
      url: `/users`,
      qs: { order },
    }

    return this.request(options)
  }

  async getUsersByTx (txid: string, type: BorkType.rebork | BorkType.like | BorkType.flag): Promise<User[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/transactions/${txid}/users`,
      qs: { type },
    }

    return this.request(options)
  }

  async getUsersByUser (address: string, type: FollowsType): Promise<User[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/users/${address}/users`,
      qs: { type },
    }

    return this.request(options)
  }

  async getUser (address: string): Promise<User> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/users/${address}`,
    }

    return this.request(options)
  }

  async getBork (txid: string): Promise<Bork> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/transactions/${txid}`,
    }

    return this.request(options)
  }

  async getBorks (params: IndexTxParams = {}): Promise<Bork[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: '/transactions',
      qs: params,
    }

    return this.request(options)
  }
  
  async getProfileUpdates (senderAddress: string): Promise<Bork[]> {
    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: '/transactions',
      qs: {
        senderAddress,
        types: [BorkType.setName, BorkType.setBio, BorkType.setAvatar],
      },
    }

    return this.request(options)
  }

  private async request (options: rp.OptionsWithUrl) {

    const [config, address] = await Promise.all([
      Storage.get<BorkerConfig>('borkerconfig'),
      Storage.get<string>('address'),
    ])

    if (!config || !config.externalip) {
      alert('please go to "Settings" and provide an IP address of a Borker node.')
      return
    }

    Object.assign(options, {
      json: true,
      url: config.externalip + options.url,
      headers: { 'my-address': address },
    })

    try {

      return rp(options)

    } catch (err) {

      console.error(err)
      alert(err)
    }
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
  filterFollowing?: boolean
  senderAddress?: string
  parentTxid?: string
  types?: BorkType[]
}

export interface ConstructRequest {
  type: BorkType,
  content?: string
  parent?: {
    txid: string
    tip: string,
  }
}
