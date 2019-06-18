import React from 'react'
import BigNumber from 'bignumber.js'
import './withdrawal-modal.scss'
import WebService from '../../../web-service'
import { JsChildWallet } from 'borker-rs-browser'
/* global BigInt */

export interface WithdrawalModalProps {
  balance: BigNumber
  wallet: JsChildWallet | null
  decryptWallet: (password: string) => Promise<JsChildWallet>
}

export interface WithdrawalModalState {
  address: string
  amount: string
  password: string
  fee: BigNumber
}

class WithdrawalModal extends React.Component<WithdrawalModalProps, WithdrawalModalState> {
  public webService: WebService

  constructor (props: WithdrawalModalProps) {
    super(props)
    this.state = {
      address: '',
      amount: '',
      password: '',
      fee: new BigNumber(100000000),
    }
    this.webService = new WebService()
  }

  handleAddressChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ address: e.target.value })
  }

  handleAmountChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ amount: e.target.value })
  }

  handlePasswordChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ password: e.target.value })
  }

  withdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const borkerLib = await import('borker-rs-browser')
    const { wallet, decryptWallet } = this.props
    const { fee, address, amount, password } = this.state

    const amount_sat = parseFloat(amount) * 100000000
    const localWallet = wallet || await decryptWallet(password)
    const utxos = await this.webService.getUtxos(new BigNumber(amount_sat))
    const inputs = utxos.map(u => u.raw)

    const rawTx = localWallet!.constructSigned(inputs, address, BigInt(amount_sat), BigInt(fee), borkerLib.Network.Dogecoin)

    return this.webService.signAndBroadcastTx([rawTx])

  }

  fillMax = () => {
    this.setState({ amount: this.props.balance.dividedBy(100000000).toFixed(8) })
  }

  render () {
    const { address, amount, password } = this.state
    const { balance, wallet } = this.props

    return (
      <form onSubmit={this.withdraw} className="withdrawal-form">
        <h2>Withdrawal</h2>
        <input type="text" placeholder="Destination Address" value={address} onChange={this.handleAddressChange} />
        <input type="number" placeholder="Amount" value={amount} onChange={this.handleAmountChange} />
        <p>Available: <a className={"clickable"} onClick={this.fillMax}>{balance && balance.isGreaterThan(0) ? balance.dividedBy(100000000).toFormat(8) : new BigNumber(0).toFormat(8)}</a></p>
        {!wallet &&
          <input type="password" placeholder="Password or Pin" value={password} onChange={this.handlePasswordChange} />
        }
        <br />
        <br />
        <br />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default WithdrawalModal
