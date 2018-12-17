import React from 'react'
import EncryptModal from '../../components/encrypt-modal/encrypt-modal'
import { JsWallet } from 'borker-rs'
import '../../App.scss'
import './wallet-create.scss'

export interface WalletCreateProps {
  login: (address: string) => Promise<any>
}

export interface WalletCreateState {
  mnemonic: string[]
  isModalOpen: boolean
}

let borkerLib: any
let wallet: JsWallet

class WalletCreatePage extends React.Component<WalletCreateProps, WalletCreateState> {

  constructor(props: WalletCreateProps) {
    super(props)
    this.state = {
      mnemonic: [],
      isModalOpen: false
    }
    this._genWallet = this._genWallet.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
  }

  async componentDidMount() {
    borkerLib = await import('borker-rs')
    this._genWallet()
  }

  _genWallet() {
    wallet = new borkerLib.JsWallet()
    this.setState({ mnemonic: wallet.words() })
  }

  _toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  render() {
    const mnemonic = this.state.mnemonic.join(' ')

    return (
      <div className="page-content">
        <code>{mnemonic}</code>
        <button onClick={this._toggleModal}>
          I've Written Down My Mnemonic Phrase
        </button>
        {this.state.isModalOpen &&
          <EncryptModal
            login={this.props.login}
            mnemonic={mnemonic}
          />
        }
      </div>
    )
  }
}

export default WalletCreatePage
