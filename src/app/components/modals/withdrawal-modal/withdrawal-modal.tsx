import React from 'react'
import BigNumber from 'bignumber.js'
import './withdrawal-modal.scss'
import WebService from '../../../web-service'
import PinModal from '../pin-modal/pin-modal'
import { withAuthContext, AuthProps } from '../../../contexts/auth-context'
import * as Storage from 'idb-keyval'
import ConfirmModal from '../confirm-modal/confirm-modal'

export interface WithdrawalModalProps extends AuthProps { }

export interface WithdrawalModalState {
  address: string
  amount: string
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

  withdraw = async (e: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault()
    }

    this.setState({
      processing: true,
    })

    if (!this.props.wallet) {
      try {
        const wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.withdraw} />)
        return
      }
    }

    const borkerLib = await import('borker-rs-browser')
    const { fee, address, amount } = this.state
    const totalCost = new BigNumber(amount)

    try {
      const ret_utxos = await this.webService.getUtxos(totalCost)
      const utxos = ret_utxos.filter(u => !(window.sessionStorage.getItem('usedUTXOs') || '').includes(`${u.txid}-${u.position}`))

      const amount_sat = totalCost.times(100000000).minus(fee)

      let inputs = utxos.map(utxo => utxo.raw)
      if (inputs.length === 0) {
        const last = window.sessionStorage.getItem('lastTransaction')
        inputs = last ? [last.split(':')[1]] : []
      }

      const childWallet = this.props.getChild(this.props.wallet!)
      const rawTx = childWallet.constructSigned(inputs, address, amount_sat.toNumber(), fee.toNumber(), borkerLib.Network.Dogecoin)

      // broadcast
      let res = await this.webService.broadcastTx([rawTx])
      window.sessionStorage.setItem('usedUTXOs', ret_utxos.map(u => `${u.txid}-${u.position}`) + ',' + (window.sessionStorage.getItem('lastTransaction') || '').split(':')[0])
      window.sessionStorage.setItem('lastTransaction', `${res[0]}-0:${rawTx}`)
      // show confirm modal maybe
      const hideConfirmation = await Storage.get('hideConfirmation')
      this.props.toggleModal(hideConfirmation ? null : <ConfirmModal />)
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
    const { address, amount, processing, error } = this.state
    const { balance } = this.props

    return (
      <form onSubmit={this.withdraw} className="withdrawal-form">
        <h2>Withdrawal</h2>
        <input type="text" placeholder="Destination Address" value={address} onChange={this.handleAddressChange} />
        <input type="number" min="0" placeholder="Amount" value={amount} onChange={this.handleAmountChange} />
        <p>Available: <a className={"clickable"} onClick={this.fillMax}>{balance && balance.isGreaterThan(0) ? balance.dividedBy(100000000).toFormat(8) : new BigNumber(0).toFormat(8)}</a></p>
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

export default withAuthContext(WithdrawalModal)
