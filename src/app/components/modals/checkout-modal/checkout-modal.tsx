import React from 'react'
import { PostType } from '../../../../types/types'
import BigNumber from 'bignumber.js'
import '../../../App.scss'
import './checkout-modal.scss'

export interface CheckoutModalProps {
  txCount: number
  charCount?: number
  cost: BigNumber
  type: PostType
}

class CheckoutModal extends React.PureComponent<CheckoutModalProps, {}> {

  broadcast = async () => {
    alert ('broadcasts coming soon!')
  }

  render () {
    const { txCount, charCount, cost, type } = this.props

    return (
      <div className="checkout-modal-content">
        <h1>Order Summary</h1>
        <p>Transaction Type: <b>{type}</b></p>
        <p>Total Transactions: {txCount}</p>
        {charCount ? <p>Characters: {charCount}</p> : null}<br />
        <p>Total Cost: <b>{cost.toFormat(8)} DOGE</b></p>
        <button onClick={this.broadcast}>Broadcast!</button>
      </div>
    )
  }
}

export default CheckoutModal
