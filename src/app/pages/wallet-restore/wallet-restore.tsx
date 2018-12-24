import React from 'react'
import EncryptModal from '../../components/encrypt-modal/encrypt-modal'
import { JsWallet } from 'borker-rs'
import { sampleWords } from '../../util/mocks'
import '../../App.scss'
import './wallet-restore.scss'

export interface WalletRestoreProps {
  login: (address: string) => Promise<void>
}

export interface WalletRestoreState {
  mnemonic: string
  wallet: JsWallet | null
  isMnemonicEntered: boolean
  isModalOpen: boolean
}

class WalletRestorePage extends React.Component<WalletRestoreProps, WalletRestoreState> {

  constructor (props: WalletRestoreProps) {
    super(props)
    this.state = {
      mnemonic: '',
      wallet: null,
      isMnemonicEntered: false,
      isModalOpen: false,
    }
    this._handleMnemonicChange = this._handleMnemonicChange.bind(this)
    this._genWallet = this._genWallet.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  _handleMnemonicChange (e: any) {
    this.setState({
      mnemonic: e.target.value,
      isMnemonicEntered: e.target.value.trim().replace(/ +/g, " ").split(' ').length === 12,
    })
  }

  async _genWallet () {
    const borkerLib = await import('borker-rs')
    const wallet = new borkerLib.JsWallet(sampleWords)
    this.setState({ wallet, isModalOpen: true })
  }

  toggleModal () {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  render () {
    const { isModalOpen, isMnemonicEntered, wallet, mnemonic } = this.state

    return (
      <div className="page-content">
        <p>Insert your 12 word mnemonic phrase, separted with spaces as shown below</p>
        <textarea
          placeholder="word1 word2 word3"
          value={mnemonic}
          onChange={this._handleMnemonicChange}
          className="textarea"
        />
        <br></br>
        <button onClick={this._genWallet} disabled={!isMnemonicEntered}>
          Restore
        </button>
        {isModalOpen && wallet &&
          <EncryptModal
            isOpen={isModalOpen}
            toggleModal={this.toggleModal}
            login={this.props.login}
            wallet={wallet}
          />
        }
      </div>
    )
  }
}

export default WalletRestorePage
