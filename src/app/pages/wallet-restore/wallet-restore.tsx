import React from 'react'
import EncryptModal from '../../components/encrypt-modal/encrypt-modal'
import '../../App.scss'
import './wallet-restore.scss'

export interface WalletRestoreProps {
  login: (address: string) => Promise<void>
}

export interface WalletRestoreState {
  mnemonic: string
  isMnemonicEntered: boolean
  isModalOpen: boolean
}

class WalletRestorePage extends React.Component<WalletRestoreProps, WalletRestoreState> {

  constructor(props: WalletRestoreProps) {
    super(props)
    this.state = {
      mnemonic: '',
      isMnemonicEntered: false,
      isModalOpen: false
    }
    this._handleMnemonicChange = this._handleMnemonicChange.bind(this)
    this._toggleModal = this._toggleModal.bind(this)
  }

  _handleMnemonicChange(e) {
    this.setState({
      mnemonic: e.target.value,
      isMnemonicEntered: (e.target.value as string).trim().replace(/ +/g, " ").split(' ').length === 12
    })
  }

  _toggleModal() {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  render() {
    const { isModalOpen, isMnemonicEntered, mnemonic } = this.state

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
        <button onClick={this._toggleModal} disabled={!isMnemonicEntered}>
          Restore
        </button>
        {isModalOpen &&
          <EncryptModal
            login={this.props.login}
            mnemonic={mnemonic}
          />
        }
      </div>
    )
  }
}

export default WalletRestorePage
