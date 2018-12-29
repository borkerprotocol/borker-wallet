import React from 'react'
import * as CryptoJS from 'crypto-js'
import { JsWallet } from 'borker-rs'
import * as Storage from 'idb-keyval'
import { withAppContext, AppProps } from '../../../contexts/app-context'
import '../../../App.scss'
import './encrypt-modal.scss'

export interface EncryptModalProps extends AppProps {
  wallet: JsWallet
}

export interface EncryptModalState {
  password: string
}

class EncryptModal extends React.Component<EncryptModalProps, EncryptModalState> {

  constructor (props: EncryptModalProps) {
    super(props)
    this.state = {
      password: '',
    }
    this._handlePasswordChange = this._handlePasswordChange.bind(this)
    this._saveWallet = this._saveWallet.bind(this)
    console.log(this.props)
  }

  async _saveWallet (e: any): Promise<void> {
    e.preventDefault()
    const { wallet } = this.props

    const borkerLib = await import('borker-rs')

    const address = wallet.childAt([-44, -0, -0, 0, 0]).address(borkerLib.Network.Dogecoin)
    const encrypted = CryptoJS.AES.encrypt(new Buffer(wallet.toBuffer()).toString('hex'), this.state.password).toString()

    await Promise.all([
      Storage.set('wallet', encrypted),
      Storage.set('address', address),
    ])

    this.props.login(address)
  }

  _handlePasswordChange (e: any) {
    this.setState({ password: e.target.value })
  }

  render () {
    const { password } = this.state

    return (
      <form onSubmit={this._saveWallet} className="password-form">
        <p>Please enter a password to encrypt your mnemonic phrase on this device.</p>
        <input type="password" value={password} onChange={this._handlePasswordChange} />
        <input type="submit" value="Save" />
      </form>
    )
  }
}

export default withAppContext(EncryptModal)
