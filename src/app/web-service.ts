import rp from 'request-promise'
import * as Storage from 'idb-keyval'
import BigNumber from 'bignumber.js'
import { User, Bork, BorkType, OrderBy, Utxo, Tag } from '../types/types'
import { FollowsType } from './pages/user-list/user-list'
import { BorkerConfig } from './pages/settings/settings'

class WebService {

  async getBalance (): Promise<BigNumber> {
    const address = await Storage.get<string>('address')

    const options: rp.Options = {
      method: 'GET',
      url: `/users/${address}/balance`,
    }

    const res = await this.request(options)
    return new BigNumber(res)
  }

  async getUtxos (amount: BigNumber): Promise<Utxo[]> {
    const address = await Storage.get<string>('address')

    const options: rp.Options = {
      method: 'GET',
      url: `/users/${address}/utxos`,
      qs: { amount: amount.toString() },
    }

    return this.request(options)
  }

  async getTags (page?: number, perPage?: number): Promise<Tag[]> {
    const options: rp.Options = {
      method: 'GET',
      url: `/borks/tags`,
      qs: { page, perPage },
    }

    return this.request(options)
  }

  async getReferenceId (txid: string, address: string): Promise<string> {
    const options: rp.Options = {
      method: 'GET',
      url: `/borks/referenceId`,
      qs: { txid, address },
    }

    const res = await this.request(options)
    return res.referenceId
  }

  async signAndBroadcastTx (body: string[]): Promise<string[]> {
    const options: rp.Options = {
      method: 'POST',
      url: `/borks/broadcast`,
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

  async getUsersByTx (txid: string, type: BorkType.Comment | BorkType.Rebork | BorkType.Like | BorkType.Flag): Promise<User[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: `/borks/${txid}/users`,
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
      url: `/borks/${txid}`,
    }

    return this.request(options)
  }

  async getBorks (params: IndexBorkParams = {}): Promise<Bork[]> {

    const options: rp.OptionsWithUrl = {
      method: 'GET',
      url: '/borks',
      qs: params,
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

export interface IndexBorkParams extends IndexParams {
  filterFollowing?: boolean
  senderAddress?: string
  parentTxid?: string
  types?: BorkType[]
  order?: OrderBy<Bork>
  tags?: string[]
}
