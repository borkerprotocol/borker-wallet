import React from 'react'
import BigNumber from 'bignumber.js'
import './withdrawal-modal.scss'

export interface WithdrawalModalProps {
  balance: BigNumber
}

export interface WithdrawalModalState {
  address: string
  amount: string
}

class WithdrawalModal extends React.Component<WithdrawalModalProps, WithdrawalModalState> {

  state = {
    address: '',
    amount: '',
  }

  handleAddressChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ address: e.target.value })
  }

  handleAmountChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ amount: e.target.value })
  }

  fillMax = () => {
    this.setState({ amount: this.props.balance.toFormat(8) })
  }

  render () {
    const { address, amount } = this.state
    const { balance } = this.props

    return (
      <form onSubmit={e => { e.preventDefault(); alert('withdrawals coming soon') }} className="withdrawal-form">
        <h2>Withdrawal</h2>
        <input type="text" placeholder="Address" value={address} onChange={this.handleAddressChange} />
        <input type="number" placeholder="Amount" value={amount} onChange={this.handleAmountChange} />
        <p>Available: <a className={"clickable"} onClick={this.fillMax}>{balance.toFormat(8)}</a></p>
        <input type="submit" value="Construct Tx" />
      </form>
    )
  }
}

export default WithdrawalModal
