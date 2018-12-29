import React from 'react'
import { JsWallet } from 'borker-rs'
import { UnauthProps, withUnauthContext } from '../../contexts/unauth-context'
import EncryptModal from '../../components/modals/encrypt-modal/encrypt-modal'
import { sampleWords } from '../../util/mocks'
import '../../App.scss'
import './wallet-restore.scss'

export interface WalletRestoreProps extends UnauthProps {
  login: (address: string) => Promise<void>
  toggleModal: (content: JSX.Element | null) => void
}

export interface WalletRestoreState {
  mnemonic: string
  wallet: JsWallet | null
  isMnemonicEntered: boolean
}

class WalletRestorePage extends React.Component<WalletRestoreProps, WalletRestoreState> {

  constructor (props: WalletRestoreProps) {
    super(props)
    this.state = {
      mnemonic: '',
      wallet: null,
      isMnemonicEntered: false,
    }
    this._handleMnemonicChange = this._handleMnemonicChange.bind(this)
    this._genWallet = this._genWallet.bind(this)
  }

  _handleMnemonicChange (e: any) {
    this.setState({
      mnemonic: e.target.value,
      isMnemonicEntered: e.target.value.trim().replace(/ +/g, " ").split(' ').length === 12,
    })
  }

  async _genWallet () {
    if (!this.state.wallet) {
      const borkerLib = await import('borker-rs')
      const wallet = new borkerLib.JsWallet(sampleWords)
      await this.setState({ wallet })
    }

    const modal = (
      <EncryptModal wallet={this.state.wallet as JsWallet} />
    )

    this.props.toggleModal(modal)
  }

  render () {
    const { isMnemonicEntered, mnemonic } = this.state

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
      </div>
    )
  }
}

export default withUnauthContext(WalletRestorePage)
