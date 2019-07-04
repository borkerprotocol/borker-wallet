import rp from 'request-promise'
import * as Storage from 'idb-keyval'
import BigNumber from 'bignumber.js'
import { User, Bork, BorkType, OrderBy, Utxo, Tag } from '../types/types'
import { FollowsType } from './pages/user-list/user-list'
import { BorkerConfig } from './pages/settings/settings'

class WebService {

  async getBalance (): Promise<BigNumber> {
    const address = await Storage.get<string>('address')

    const res = await this.request({
      method: 'GET',
      url: `/users/${address}/balance`,
    })

    return new BigNumber(res)
  }

  async getUtxos (amount: BigNumber): Promise<Utxo[]> {
    const address = await Storage.get<string>('address')

    return this.request({
      method: 'GET',
      url: `/users/${address}/utxos`,
      qs: { amount: amount.toString() },
    })
  }

  async getTags (params: IndexTagParams = {}): Promise<Tag[]> {
    return this.request({
      method: 'GET',
      url: `/borks/tags`,
      qs: params,
    })
  }

  async getReferenceId (txid: string, address: string): Promise<string> {
    const res = await this.request({
      method: 'GET',
      url: `/borks/referenceId`,
      qs: { txid, address },
    })

    return res.referenceId
  }

  async signAndBroadcastTx (body: string[]): Promise<string[]> {
    return this.request({
      method: 'POST',
      url: `/borks/broadcast`,
      body,
    })
  }

  async getUsers (params: IndexUserParams = {}): Promise<User[]> {
    return this.request({
      method: 'GET',
      url: `/users`,
      qs: params,
    })
  }

  async getUsersByTx (
    txid: string,
    type: BorkType.Comment | BorkType.Rebork | BorkType.Like | BorkType.Flag,
    page: number,
  ): Promise<User[]> {

    return this.request({
      method: 'GET',
      url: `/borks/${txid}/users`,
      qs: { page, type },
    })
  }

  async getUsersByUser (
    address: string,
    type: FollowsType,
    page: number,
  ): Promise<User[]> {

    return this.request({
      method: 'GET',
      url: `/users/${address}/users`,
      qs: { page, type },
    })
  }

  async getUser (address: string): Promise<User> {
    return this.request({
      method: 'GET',
      url: `/users/${address}`,
    })
  }

  async getBork (txid: string): Promise<Bork> {

    return this.request({
      method: 'GET',
      url: `/borks/${txid}`,
    })
  }

  async getBorks (params: IndexBorkParams = {}): Promise<Bork[]> {

    return this.request({
      method: 'GET',
      url: '/borks',
      qs: params,
    })
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

export interface IndexUserParams extends IndexParams {
  order?: OrderBy<User>
  name?: string
}

export interface IndexTagParams extends IndexParams {
  order?: OrderBy<User>
  name?: string
}
