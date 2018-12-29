import React from 'react'
import EncryptModal from '../../components/modals/encrypt-modal/encrypt-modal'
import { withUnauthContext, UnauthProps } from '../../contexts/unauth-context'
import { JsWallet } from 'borker-rs'
import { sampleWords } from '../../util/mocks'
import '../../App.scss'
import './wallet-create.scss'

export interface WalletCreateProps extends UnauthProps {}

export interface WalletCreateState {
  wallet: JsWallet | null
  mnemonic: string,
}

class WalletCreatePage extends React.Component<WalletCreateProps, WalletCreateState> {

  constructor (props: WalletCreateProps) {
    super(props)
    this.state = {
      wallet: null,
      mnemonic: '',
    }
  }

  async componentDidMount () {
    const borkerLib = await import('borker-rs')
    const wallet = new borkerLib.JsWallet(sampleWords)
    this.setState({ wallet, mnemonic: wallet.words().join(' ') })
  }

  render () {
    const { wallet, mnemonic } = this.state

    const modal = (
      <EncryptModal wallet={wallet as JsWallet} />
    )

    return (
      <div className="page-content">
        <code>{mnemonic}</code>
        <button onClick={() => this.props.toggleModal(modal)}>
          I've Written Down My Mnemonic Phrase
        </button>
      </div>
    )
  }
}

export default withUnauthContext(WalletCreatePage)
