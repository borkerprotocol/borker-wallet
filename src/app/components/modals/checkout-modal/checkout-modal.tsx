import React from 'react'
import { BorkType, TxData } from '../../../../types/types'
import { withAuthContext, AuthProps } from '../../../contexts/auth-context'
import BigNumber from 'bignumber.js'
import WebService, { ConstructRequest } from '../../../web-service'
import { JsWallet } from 'borker-rs'
import * as CryptoJS from 'crypto-js'
import * as Storage from 'idb-keyval'
import '../../../App.scss'
import './checkout-modal.scss'

export interface CheckoutModalProps extends AuthProps {
  data: ConstructRequest
}

export interface CheckoutModalState {
  txDatas: TxData[]
  fees: BigNumber
  tip: BigNumber
  totalCost: BigNumber
  password: string
}

class CheckoutModal extends React.Component<CheckoutModalProps, CheckoutModalState> {
  public webService: WebService

  constructor (props: CheckoutModalProps) {
    super(props)
    this.state = {
      txDatas: [],
      fees: new BigNumber(0),
      tip: new BigNumber(0),
      totalCost: new BigNumber(0),
      password: '',
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    const txDatas = await this.webService.construct(this.props.data)

    let tip: BigNumber = new BigNumber(0)
    if ([BorkType.comment, BorkType.like, BorkType.rebork].includes(this.props.data.type)) {
      tip = new BigNumber(txDatas[0].outputs[1].value)
    }

    const fees = txDatas.reduce((sum, txData) => {
      return sum.plus(txData.fee)
    }, new BigNumber(0))

    const totalCost = fees.plus(tip)

    this.setState({
      txDatas,
      tip,
      fees,
      totalCost,
    })
  }

  handlePasswordChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ password: e.target.value })
  }

  signAndBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const encrypted = await Storage.get<string>('wallet')
    const wallet = CryptoJS.AES.decrypt(encrypted, this.state.password)

    const rawTxs = await Promise.all(this.state.txDatas.map(txData => {
      console.log(wallet)
      return txData.txHash
    }))

    this.webService.signAndBroadcastTx(rawTxs)
  }

  render () {
    const { data } = this.props
    const { txDatas, tip, totalCost, fees, password } = this.state

    return !txDatas.length ? (
      <p>Loading</p>
    ) : (
      <div className="checkout-modal-content">
        <h1>Order Summary</h1>
        <p>Transaction Type: <b>{data.type}</b></p>
        <p>Total Transactions: {txDatas.length}</p>
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
