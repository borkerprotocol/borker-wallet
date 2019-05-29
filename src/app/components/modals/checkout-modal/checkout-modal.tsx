import React from 'react'
import { withAuthContext, AuthProps } from '../../../contexts/auth-context'
import BigNumber from 'bignumber.js'
import WebService, { ConstructRequest } from '../../../web-service'
import { JsWallet } from 'borker-rs-browser'
import * as CryptoJS from 'crypto-js'
import * as Storage from 'idb-keyval'
import '../../../App.scss'
import './checkout-modal.scss'

export interface CheckoutModalProps extends AuthProps {
  data: ConstructRequest
}

export interface CheckoutModalState {
  fees: BigNumber
  tip: BigNumber
  totalCost: BigNumber
  password: string
}

class CheckoutModal extends React.Component<CheckoutModalProps, CheckoutModalState> {
  public webService: WebService

  constructor(props: CheckoutModalProps) {
    super(props)
    this.state = {
      fees: new BigNumber(0),
      tip: new BigNumber(0),
      totalCost: new BigNumber(0),
      password: '',
    }
    this.webService = new WebService()
  }

  async componentDidMount() {
    const { txCount, parent } = this.props.data

    const fees = txCount ? new BigNumber(txCount).times(1) : new BigNumber(1)

    const tip = parent ? parent.tip : new BigNumber(0)

    this.setState({
      fees,
      tip,
      totalCost: fees.plus(tip),
    })
  }

  handlePasswordChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ password: e.target.value })
  }

  signAndBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const utxos = await this.webService.getUtxos(this.state.totalCost.toString())

    const encrypted = await Storage.get<string>('wallet')
    const wallet = CryptoJS.AES.decrypt(encrypted, this.state.password)

    const borkerLib = await import('borker-rs-browser')

    // const rawTxs = new borkerLib.construct(this.props.data, utxos)
    const rawTxs = ['']

    this.webService.signAndBroadcastTx(rawTxs)
  }

  render() {
    const { data } = this.props
    const { tip, totalCost, fees, password } = this.state

    return (
      <div className="checkout-modal-content">
        <h1>Order Summary</h1>
        <p>Transaction Type: <b>{data.type}</b></p>
        <p>Total Transactions: {data.txCount || 1}</p>
        <p>Fees: {fees.toString()} DOGE</p>
        {tip.isGreaterThan(0) &&
          <p>Tip: {tip.toString()} DOGE</p>
        }
        <br></br>
        <p>Total Cost: <b>{totalCost.toString()} DOGE</b></p>
        <form onSubmit={this.signAndBroadcast} className="checkout-form">
          <input type="password" placeholder="Password or Pin" value={password} onChange={this.handlePasswordChange} />
          <input type="submit" value="Sign and Broadcast!" />
        </form>
      </div>
    )
  }
}

export default withAuthContext(CheckoutModal)
