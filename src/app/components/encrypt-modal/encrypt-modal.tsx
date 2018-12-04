import React from 'react'
import Modal from 'react-modal'
import * as CryptoJS from "crypto-js"
import * as Storage from 'idb-keyval'
import '../../App.css'
import './encrypt-modal.css'
import { User } from '../../../types/types'
import { Redirect } from 'react-router';

export interface EncryptModalProps {
  mnemonic: string
}

export interface EncryptModalState {
  isOpen: boolean
  mnemonic: string
  password: string
  address: string
  toWallet: boolean
}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-40%',
    transform: 'translate(-50%, -50%)'
  }
}

class EncryptModal extends React.Component<EncryptModalProps, EncryptModalState> {

  constructor(props: EncryptModalProps) {
    super(props)
    this.state = {
      isOpen: true,
      mnemonic: props.mnemonic,
      password: '',
      address: '',
      toWallet: false
    }
    this._handlePasswordChange = this._handlePasswordChange.bind(this)
    this._saveWallet = this._saveWallet.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
  }

  async _saveWallet(e) {
    e.preventDefault()
    const encryptedData = CryptoJS.AES.encrypt(this.state.mnemonic, this.state.password)
    const address = '1N3jFnsB8ga85LKyDNxBB6sWLLkqea4zqh'
    const user: User = {
      address
    }
    await Promise.all([
      Storage.set('mnemonic', encryptedData.toString()),
      Storage.set('user', user)
    ])
    this.setState({ address, toWallet: true })
  }

  _handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  _toggleModal() {
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    if (this.state.toWallet === true) {
      return <Redirect to={`/wallet/${this.state.address}`} />
    }
    return (
      <Modal
        ariaHideApp={false}
        isOpen={this.state.isOpen}
        style={modalStyles}
      >
        <button onClick={this._toggleModal}>x</button>
        <form onSubmit={this._saveWallet} className="password-form">
          <p>Please enter a password to encrypt your mnemonic phrase on this device.</p>
          <input type="password" value={this.state.password} onChange={this._handlePasswordChange} />
          <input type="submit" value="Save" />
        </form>
      </Modal>
    )
  }
}

export default EncryptModal
