import rp from 'request-promise'
import { config } from '../config/config'

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

export async function getRandomInt () {
  const options: rp.Options = {
    method: 'POST',
    url: 'https://api.random.org/json-rpc/1/invoke',
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'generateIntegers',
      id: 'test1',
      params: {
        apiKey: config.randomOrgApiKey,
        n: 1,
        min: 1,
        max: 10,
      },
    }),
  }
  try {
    const res = await rp(options)
    console.log(res)
  } catch (e) {
    console.error('error: ', e)
  }
}