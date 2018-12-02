import React from 'react'
import Modal from 'react-modal';
import { JsWallet } from 'borker-rs'
import * as CryptoJS from "crypto-js"
import '../../App.css'

export interface WalletProps {
  loggedIn: boolean
}

export interface WalletState {
  loggedIn: boolean
  words: string[]
  address: string
  isModalOpen: boolean
  password: string
}

let borkerLib: any
let wallet: JsWallet

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor(props: WalletProps) {
    super(props)
    this.state = {
      loggedIn: props.loggedIn,
      words: [],
      address: '',
      isModalOpen: false,
      password: ''
    }
    this._handlePasswordChange = this._handlePasswordChange.bind(this)
    this._saveWallet = this._saveWallet.bind(this)
    this._genWallet = this._genWallet.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
  }

  async componentDidMount() {
    borkerLib = await import('borker-rs')
    this._genWallet()
  }

  _genWallet() {
    wallet = new borkerLib.JsWallet()
    const words = wallet.words()
    this.setState({ words })
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
          ariaHideApp={false}
          isOpen={this.state.isModalOpen}
        >
          <button onClick={this._toggleModal}>x</button>
          <form onSubmit={this._saveWallet}>
            <input type="text" value={this.state.password} onChange={this._handlePasswordChange} placeholder="Pin"/>
            <input type="submit" value="Save" />
          </form>
        </Modal>
      </div>
    )
  }
}

export default WalletPage
