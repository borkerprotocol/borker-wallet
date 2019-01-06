import React from 'react'
import { BorkType } from '../../../../types/types'
import { getTxFee } from '../../../util/mocks'
import BigNumber from 'bignumber.js'
import '../../../App.scss'
import './checkout-modal.scss'

export interface CheckoutModalProps {
  txCount: number
  type: BorkType
}

export interface CheckoutModalState {
  txFee: BigNumber
}

class CheckoutModal extends React.Component<CheckoutModalProps, {}> {

  state = { txFee: new BigNumber(0) }

  async componentDidMount () {
    this.setState({ txFee: await getTxFee() })
  }

  broadcast = async () => {
    alert ('broadcasts coming soon!')
  }

  render () {
    const { txCount, type } = this.props
    const { txFee } = this.state
    const cost = txFee.times(txCount).integerValue(BigNumber.ROUND_CEIL).toString()

    return (
      <div className="checkout-modal-content">
        <h1>Order Summary</h1>
        <p>Transaction Type: <b>{type}</b></p>
        <p>Total Transactions: {txCount}</p>
        <p>Total Cost: <b>{cost} DOGE</b></p>
        <button onClick={this.broadcast}>Broadcast!</button>
      </div>
    )
  }
}

export default CheckoutModal
