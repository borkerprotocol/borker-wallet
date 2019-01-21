import React from 'react'
import { BorkType } from '../../../../types/types'
import BigNumber from 'bignumber.js'
import WebService from '../../../web-service'
import '../../../App.scss'
import './checkout-modal.scss'

export interface CheckoutModalProps {
  txCount: number
  type: BorkType
}

export interface CheckoutModalState {
  txFee: BigNumber
}

class CheckoutModal extends React.Component<CheckoutModalProps, CheckoutModalState> {
  public webService: WebService

  constructor (props: CheckoutModalProps) {
    super(props)
    this.state = { txFee: new BigNumber(0) }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.setState({
      txFee: await this.webService.getTxFee(),
    })
  }

  broadcast = async () => {
    alert ('broadcasts coming soon!')
  }

  render () {
    const { txCount, type } = this.props
    const { txFee } = this.state
    const cost = txFee.times(txCount).integerValue(BigNumber.ROUND_CEIL).toString()
    const newType = type === BorkType.setName ||
                    type === BorkType.setBio ||
                    type === BorkType.setAvatar ?
                    'Profile Update' : type

    return (
      <div className="checkout-modal-content">
        <h1>Order Summary</h1>
        <p>Transaction Type: <b>{newType}</b></p>
        <p>Total Transactions: {txCount}</p>
        <p>Total Cost: <b>{cost} DOGE</b></p>
        <button onClick={this.broadcast}>Broadcast!</button>
      </div>
    )
  }
}

export default CheckoutModal
