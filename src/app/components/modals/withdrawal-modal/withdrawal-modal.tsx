import React from 'react'
import BigNumber from 'bignumber.js'
import './withdrawal-modal.scss'
import WebService from '../../../web-service'

export interface WithdrawalModalProps {
  balance: BigNumber
}

export interface WithdrawalModalState {
  address: string
  amount: string
}

class WithdrawalModal extends React.Component<WithdrawalModalProps, WithdrawalModalState> {
  public webService: WebService

  constructor (props: WithdrawalModalProps) {
    super(props)
    this.state = {
      address: '',
      amount: '',
    }
    this.webService = new WebService()
  }

  handleAddressChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ address: e.target.value })
  }

  handleAmountChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ amount: e.target.value })
  }

  withdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const utxos = await this.webService.getUtxos(this.state.amount)
    console.log('utxos', utxos)
  }

  fillMax = () => {
    this.setState({ amount: this.props.balance.dividedBy(100000000).toFixed(8) })
  }

  render () {
    const { address, amount } = this.state
    const { balance } = this.props

    return (
      <form onSubmit={this.withdraw} className="withdrawal-form">
        <h2>Withdrawal</h2>
        <input type="text" placeholder="Address" value={address} onChange={this.handleAddressChange} />
        <input type="number" placeholder="Amount" value={amount} onChange={this.handleAmountChange} />
        <p>Available: <a className={"clickable"} onClick={this.fillMax}>{balance.dividedBy(100000000).toFormat(8)}</a></p>
        <input type="submit" value="Construct Tx" />
      </form>
    )
  }
}

export default WithdrawalModal
