import React from 'react'
import { Redirect } from 'react-router'
import Modal from 'react-modal'
import * as CryptoJS from 'crypto-js'
import { JsWallet } from 'borker-rs'
import * as Storage from 'idb-keyval'
import '../../App.scss'
import './encrypt-modal.scss'

export interface EncryptModalProps {
  isOpen: boolean
  wallet: JsWallet
  toggleModal: (e: any) => void
  login: (address: string) => Promise<void>
}

export interface EncryptModalState {
  isOpen: boolean
  password: string
  isSaved: boolean
}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-40%',
    transform: 'translate(-50%, -50%)',
  },
}

class EncryptModal extends React.Component<EncryptModalProps, EncryptModalState> {

  constructor (props: EncryptModalProps) {
    super(props)
    this.state = {
      isOpen: props.isOpen,
      password: '',
      isSaved: false,
    }
    this._handlePasswordChange = this._handlePasswordChange.bind(this)
    this._saveWallet = this._saveWallet.bind(this)
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

    // baseline values
    console.log(wallet.words())
    // recovered values
    const stringBuffer = CryptoJS.AES.decrypt(encrypted, 'password').toString(CryptoJS.enc.Utf8)
    const buffer = new Uint8Array(new Buffer(stringBuffer, 'hex'))
    console.log('words', borkerLib.JsWallet.fromBuffer(buffer).words())

    this.props.login(address)
  }

  _handlePasswordChange (e: any) {
    this.setState({ password: e.target.value })
  }

  render () {
    const { isOpen, toggleModal } = this.props
    const { password, isSaved } = this.state

    if (isSaved) {
      return <Redirect to="/posts" />
    }
    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        style={modalStyles}
      >
        <button onClick={toggleModal}>x</button>
        <form onSubmit={this._saveWallet} className="password-form">
          <p>Please enter a password to encrypt your mnemonic phrase on this device.</p>
          <input type="password" value={password} onChange={this._handlePasswordChange} />
          <input type="submit" value="Save" />
        </form>
      </Modal>
    )
  }
}

export default EncryptModal
