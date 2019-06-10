import React from 'react'
import { withAuthContext, AuthProps } from '../../../contexts/auth-context'
import BigNumber from 'bignumber.js'
import WebService from '../../../web-service'
import '../../../App.scss'
import './checkout-modal.scss'
import { BorkType } from '../../../../types/types'
/* global BigInt */

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

    const borkerLib = await import('borker-rs-browser')
    const { type, content, parent, wallet, decryptWallet } = this.props
    const { fee, tip, totalCost, password } = this.state

    const localWallet = wallet || await decryptWallet(password)
    const utxos = await this.webService.getUtxos(totalCost)

    const referenceId = parent ? await this.webService.getReferenceId(parent.txid, parent.senderAddress) : null

    const data = {
      type,
      content,
      referenceId,
    }
    const inputs = utxos.map(utxo => utxo.raw)
    const recipient = [BorkType.Comment, BorkType.Rebork, BorkType.Like].includes(type) ?
      { address: parent!.senderAddress, value: tip.toNumber() } :
      null

    const rawTxs = localWallet!.newBork(data, inputs, recipient, [], BigInt(fee), borkerLib.Network.Dogecoin)

    await this.webService.signAndBroadcastTx(rawTxs)

    this.props.toggleModal(null)
  }

  render () {
    const { type, txCount, wallet } = this.props
    const { tip, totalCost, fee, password, processing } = this.state

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
        </form>
      </div>
    )
  }
}

export default withAuthContext(CheckoutModal)
