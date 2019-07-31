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
  feePerTx: BigNumber
  totalFee: BigNumber
  tip: BigNumber
  extraTip: string
  totalCost: BigNumber
  pin: string
  processing: boolean
  error: string
}

class CheckoutModal extends React.Component<CheckoutModalProps, CheckoutModalState> {
  public webService: WebService

  constructor (props: CheckoutModalProps) {
    super(props)
    this.state = {
      feePerTx: new BigNumber(0),
      totalFee: new BigNumber(0),
      tip: new BigNumber(0),
      extraTip: '',
      totalCost: new BigNumber(0),
      pin: '',
      processing: false,
      error: '',
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    const { parent } = this.props

    const feePerTx = new BigNumber(100000000)
    const totalFee = feePerTx.times(this.props.txCount || 1)
    const tip = parent ? parent.tip : new BigNumber(0)

    this.setState({
      feePerTx,
      totalFee,
      tip,
      totalCost: totalFee.plus(tip),
    })
  }

  handlePinChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ pin: e.target.value })
  }

  handleExtraTip = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value ? e.target.value : ''
    const bigValue = value ? new BigNumber(value).times(100000000) : 0
    this.setState({
      extraTip: value,
      totalCost: this.state.totalFee.plus(this.state.tip).plus(bigValue),
    })
  }

  signAndBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    this.setState({
      processing: true,
    })

    try {
      const borkerLib = await import('borker-rs-browser')
      const { type, content, parent, wallet, decryptWallet } = this.props
      const { feePerTx, tip, extraTip, totalCost, pin } = this.state

      // decrypt wallet and set in memory if not already
      const localWallet = wallet || (await decryptWallet(pin)).childWallet
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
        { address: parent!.senderAddress, value: tip.plus(new BigNumber(extraTip || 0).times(100000000) || 0).toNumber() } :
        null
      // construct the txs
      const rawTxs = localWallet!.newBork(data, inputs, recipient, [], feePerTx.toNumber(), borkerLib.Network.Dogecoin)
      // broadcast
      let res = await this.webService.broadcastTx(rawTxs)
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
    const { tip, extraTip, totalCost, totalFee, pin, processing, error } = this.state

    return (
      <div className="checkout-modal-content">
        <form onSubmit={this.signAndBroadcast} className="checkout-form">
        <h1>Order Summary</h1>
        <p>Transaction Type: <b>{type}</b></p>
        <p>Total Transactions: {txCount || 1}</p>
        <p>Miner Fees: {totalFee.dividedBy(100000000).toString()} DOGE</p>
        {tip.isGreaterThan(0) &&
          <div>
            <p>Base Tip: {tip.dividedBy(100000000).toString()} DOGE</p>
            <input type="number" min="0" placeholder="Additional tip amount" value={extraTip} onChange={this.handleExtraTip} />
          </div>
        }
        <p>Total Cost: <b>{totalCost.dividedBy(100000000).toString()} DOGE</b></p>
        {!wallet &&
          <input type="number" placeholder="Pin" value={pin} onChange={this.handlePinChange} />
        }
        <div style={{ textAlign: "center" }}>
          <input type="submit" className="small-button" disabled={processing} value={processing ? 'Processing' : 'Bork!'} />
        </div>
        {error &&
          <p style={{ color: 'red' }}>{error}</p>
        }
        </form>
      </div>
    )
  }
}

export default withAuthContext(CheckoutModal)
