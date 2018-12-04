import React from 'react'
import Modal from 'react-modal';
import { JsWallet } from 'borker-rs'
import * as CryptoJS from "crypto-js"
import '../../App.css'
import './wallet.css'

export interface WalletProps {
  loggedIn: boolean
  address: string
}

export interface WalletState {
  loggedIn: boolean
  words: string[]
  address: string
  isModalOpen: boolean
  password: string
}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
}

let borkerLib: any
let wallet: JsWallet

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor(props: WalletProps) {
    super(props)
    this.state = {
      loggedIn: props.loggedIn,
      words: [],
      address: props.address || '',
      isModalOpen: false,
      password: ''
    }
    this._handlePasswordChange = this._handlePasswordChange.bind(this)
    this._saveWallet = this._saveWallet.bind(this)
    this._genWallet = this._genWallet.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
  }

  async componentDidMount() {
    if (!this.state.loggedIn) {
      borkerLib = await import('borker-rs')
      this._genWallet()
    }
  }

  _genWallet() {
    wallet = new borkerLib.JsWallet()
    this.setState({ words: wallet.words() })
  }

  _saveWallet(e) {
    e.preventDefault()
    CryptoJS.AES.encrypt(this.state.words.join(' '), this.state.password)
    this.setState({
      loggedIn: true,
      words: [],
      password: ''
    })
    this._toggleModal()
  }

  _handlePasswordChange(e) {
    this.setState({ password: e.target.value })
  }

  _toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  render() {
    return (
      <div className="page-content">
        {!this.state.loggedIn &&
          <div>
            <p>
              {this.state.words.join(' ')}
            </p>
            <button onClick={this._toggleModal}>
              Use
            </button>
            <button onClick={this._genWallet}>
              Generate New
            </button>
          </div>
        }
        <Modal
          isOpen={this.state.isModalOpen}
          style={modalStyles}
        >
          <button onClick={this._toggleModal}>x</button>
          <form onSubmit={this._saveWallet} className="password-form">
            <p>Please enter a password to encrypt you private key on this device.</p>
            <input type="password" value={this.state.password} onChange={this._handlePasswordChange} />
            <input type="submit" value="Save" />
          </form>
        </Modal>
      </div>
    )
  }
}

export default WalletPage
