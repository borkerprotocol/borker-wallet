import * as rp from 'request-promise'
import { config } from '../config/config'

export interface Response {
  result: string
  error: string | null
  id: string
}

export async function getBlockHash (blockHeight: number): Promise<string> {
  if (blockHeight <= 17905) {
    return request('getblockhash', `${blockHeight}`, [blockHeight])
  } else {
    return ''
  }
}

export async function getBlock (blockHash: string): Promise<string> {
  return request('getblock', `${blockHash}`, [blockHash, false])
}

// private

async function request (method: string, id: string, params: any[] = []): Promise<string> {

	const raw: string = await rp.post(`http://${config.dogecoin.externalip}:22555`, {
		auth: {
			user: config.dogecoin.rpcuser,
      pass: config.dogecoin.rpcpassword,
      sendImmediately: false,
		},
		body: JSON.stringify({
			jsonrpc: '2.0',
			method,
			id,
			params,
		}),
  })
  
  const res: Response = JSON.parse(raw)
  return res.result
}
