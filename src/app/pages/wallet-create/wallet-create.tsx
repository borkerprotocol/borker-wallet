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
}

class WalletCreatePage extends React.Component<WalletCreateProps, WalletCreateState> {

  state = {
    wallet: null as unknown as JsWallet,
  }

  async componentDidMount () {
    const borkerLib = await import('borker-rs')
    const wallet = new borkerLib.JsWallet(sampleWords)
    this.setState({ wallet })
  }

  render () {
    const { wallet } = this.state

    if (!wallet) {
      return null
    }

    const modal = (
      <EncryptModal wallet={wallet} />
    )

    const words  = wallet.words()

    return wallet ? (
      <div className="page-content">
        <p>Below is your recovery phrase. Write it down.</p>
        <table className="words-table">
          <tbody>
            <tr>
              <td>{words[0]}</td>
              <td>{words[1]}</td>
              <td>{words[2]}</td>
            </tr>
            <tr>
              <td>{words[3]}</td>
              <td>{words[4]}</td>
              <td>{words[5]}</td>
            </tr>
            <tr>
              <td>{words[6]}</td>
              <td>{words[7]}</td>
              <td>{words[8]}</td>
            </tr>
            <tr>
              <td>{words[9]}</td>
              <td>{words[10]}</td>
              <td>{words[11]}</td>
            </tr>
          </tbody>
        </table>
        <button onClick={() => this.props.toggleModal(modal)}>
          I've Written Down My Recovery Phrase
        </button>
      </div>
    ) : (
      null
    )
  }
}

export default withUnauthContext(WalletCreatePage)
