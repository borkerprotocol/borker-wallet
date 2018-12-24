import React from 'react'
import EncryptModal from '../../components/encrypt-modal/encrypt-modal'
import { JsWallet } from 'borker-rs'
import { sampleWords } from '../../util/mocks'
import '../../App.scss'
import './wallet-create.scss'

export interface WalletCreateProps {
  login: (address: string) => Promise<void>
}

export interface WalletCreateState {
  wallet: JsWallet | null
  mnemonic: string,
  isModalOpen: boolean
}

class WalletCreatePage extends React.Component<WalletCreateProps, WalletCreateState> {

  constructor (props: WalletCreateProps) {
    super(props)
    this.state = {
      wallet: null,
      mnemonic: '',
      isModalOpen: false,
    }
    this.toggleModal = this.toggleModal.bind(this)
  }

  async componentDidMount () {
    const borkerLib = await import('borker-rs')
    const wallet = new borkerLib.JsWallet(sampleWords)
    this.setState({ wallet, mnemonic: wallet.words().join(' ') })
  }

  toggleModal () {
    this.setState({ isModalOpen: !this.state.isModalOpen })
  }

  render () {
    const { isModalOpen, wallet, mnemonic } = this.state

    return (
      <div className="page-content">
        <code>{mnemonic}</code>
        <button onClick={this.toggleModal}>
          I've Written Down My Mnemonic Phrase
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

export default WalletCreatePage
