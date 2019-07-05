import React from 'react'
import BigNumber from 'bignumber.js'
import './withdrawal-modal.scss'
import WebService from '../../../web-service'
import { AppProps, withAppContext } from '../../../contexts/app-context'

export interface WithdrawalModalProps extends AppProps {
  balance: BigNumber
}

export interface WithdrawalModalState {
  address: string
  amount: string
  password: string
  fee: BigNumber
  processing: boolean
  error: string
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
      processing: false,
      error: '',
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

    this.setState({
      processing: true,
    })

    try {
      const borkerLib = await import('borker-rs-browser')
      const { wallet, decryptWallet } = this.props
      const { fee, address, amount, password } = this.state
      const totalCost = new BigNumber(amount)

      // decrypt wallet and set in memory if not already
      const localWallet = wallet || await decryptWallet(password)
      const ret_utxos = await this.webService.getUtxos(totalCost)
      const utxos = ret_utxos.filter(u => !(window.sessionStorage.getItem('usedUTXOs') || '').includes(`${u.txid}-${u.position}`))

      const amount_sat = totalCost.times(100000000).minus(fee)

      let inputs = utxos.map(utxo => utxo.raw)
      if (inputs.length === 0) {
        const last = window.sessionStorage.getItem('lastTransaction')
        inputs = last ? [last.split(':')[1]] : []
      }

      const rawTx = localWallet!.constructSigned(inputs, address, amount_sat.toNumber(), fee.toNumber(), borkerLib.Network.Dogecoin)

      // broadcast
      let res = await this.webService.signAndBroadcastTx([rawTx])
      window.sessionStorage.setItem('usedUTXOs', ret_utxos.map(u => `${u.txid}-${u.position}`) + ',' + (window.sessionStorage.getItem('lastTransaction') || '').split(':')[0])
      window.sessionStorage.setItem('lastTransaction', `${res[0]}-0:${rawTx}`)
      // close modal
      this.props.toggleModal(null)
    } catch (err) {
      this.setState({
        error: `Error processing withdrawal: "${err.message}"`,
      })
    }
  }

  fillMax = () => {
    this.setState({ amount: this.props.balance.dividedBy(100000000).toFixed(8) })
  }

  render () {
    const { address, amount, password, processing, error } = this.state
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
        <input type="submit" disabled={processing} value={processing ? 'Processing' : 'Submit'} />
        {error &&
            <p style={{ color: 'red' }}>{error}</p>
          }
      </form>
    )
  }
}

export default withAppContext(WithdrawalModal)
