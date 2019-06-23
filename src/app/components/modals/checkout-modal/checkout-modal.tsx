import React from 'react'
import { withAuthContext, AuthProps } from '../../../contexts/auth-context'
import BigNumber from 'bignumber.js'
import WebService from '../../../web-service'
import '../../../App.scss'
import './checkout-modal.scss'
import { BorkType } from '../../../../types/types'

export interface CheckoutModalProps extends AuthProps {
  type: BorkType,
  txCount?: number
  content?: string
  parent?: {
    txid: string
    senderAddress: string
    tip: BigNumber
  }
}

export interface CheckoutModalState {
  fee: BigNumber
  tip: BigNumber
  totalCost: BigNumber
  password: string
  processing: boolean
  error: string
}

class CheckoutModal extends React.Component<CheckoutModalProps, CheckoutModalState> {
  public webService: WebService

  constructor (props: CheckoutModalProps) {
    super(props)
    this.state = {
      fee: new BigNumber(0),
      tip: new BigNumber(0),
      totalCost: new BigNumber(0),
      password: '',
      processing: false,
      error: '',
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    const { txCount, parent } = this.props

    const fee = txCount ? new BigNumber(txCount).times(100000000) : new BigNumber(100000000)

    const tip = parent ? parent.tip : new BigNumber(0)

    this.setState({
      fee,
      tip,
      totalCost: fee.plus(tip),
    })
  }

  handlePasswordChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ password: e.target.value })
  }
  signAndBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({
      processing: true,
    })

    try {
      const borkerLib = await import('borker-rs-browser')
      const { type, content, parent, wallet, decryptWallet } = this.props
      const { fee, tip, totalCost, password } = this.state

      // decrypt wallet and set in memory if not already
      const localWallet = wallet || await decryptWallet(password)
      const ret_utxos = await this.webService.getUtxos(totalCost)
      const utxos = ret_utxos.filter(u => !(window.sessionStorage.getItem('usedUTXOs') || '').includes(`${u.txid}-${u.position}`))

      // set referenceId based on type
      let referenceId = ''
      if (parent) {
        if ([BorkType.Comment, BorkType.Rebork, BorkType.Delete, BorkType.Like].includes(type)) {
          referenceId = await this.webService.getReferenceId(parent.txid, parent.senderAddress)
        } else if (type === BorkType.Flag) {
          referenceId = parent.txid
        }
      }

      // construct params for lib
      const data = {
        type,
        content,
        referenceId,
      }
      let inputs = utxos.map(utxo => utxo.raw)
      if (inputs.length === 0) {
        const last = window.sessionStorage.getItem('lastTransaction')
        inputs = last ? [last.split(':')[1]] : []
      }
      const recipient = [BorkType.Comment, BorkType.Rebork, BorkType.Like].includes(type) ?
        { address: parent!.senderAddress, value: tip.toNumber() } :
        null
      // construct the txs
      const rawTxs = localWallet!.newBork(data, inputs, recipient, [], fee.toNumber(), borkerLib.Network.Dogecoin)
      // broadcast
      let res = await this.webService.signAndBroadcastTx(rawTxs)
      window.sessionStorage.setItem('usedUTXOs', ret_utxos.map(u => `${u.txid}-${u.position}`) + ',' + (window.sessionStorage.getItem('lastTransaction') || '').split(':')[0])
      window.sessionStorage.setItem('lastTransaction', `${res[res.length - 1]}-0:${rawTxs[rawTxs.length - 1]}`)
      // close modal
      this.props.toggleModal(null)
    } catch (err) {
      this.setState({
        error: `Error sending bork: "${err.message}"`,
      })
    }
  }

  render () {
    const { type, txCount, wallet } = this.props
    const { tip, totalCost, fee, password, processing, error } = this.state

    return (
      <div className="checkout-modal-content">
        <h1>Order Summary</h1>
        <p>Transaction Type: <b>{type}</b></p>
        <br></br>
        <p>Total Transactions: {txCount || 1}</p>
        <p>Fees: {fee.dividedBy(100000000).toString()} DOGE</p>
        {tip.isGreaterThan(0) &&
          <p>Tip: {tip.dividedBy(100000000).toString()} DOGE</p>
        }
        <br></br>
        <p>Total Cost: <b>{totalCost.dividedBy(100000000).toString()} DOGE</b></p>
        <form onSubmit={this.signAndBroadcast} className="checkout-form">
          {!wallet &&
            <input type="password" placeholder="Password or Pin" value={password} onChange={this.handlePasswordChange} />
          }
          <input type="submit" disabled={processing} value={processing ? 'Processing' : 'Bork!'} />
          {error &&
            <p style={{ color: 'red' }}>{error}</p>
          }
        </form>
      </div>
    )
  }
}

export default withAuthContext(CheckoutModal)
