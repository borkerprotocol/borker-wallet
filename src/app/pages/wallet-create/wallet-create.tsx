import React from 'react'
import EncryptModal from '../../components/modals/encrypt-modal/encrypt-modal'
import { withUnauthContext, UnauthProps } from '../../contexts/unauth-context'
import { JsWallet } from 'borker-rs-browser'
// import { sampleWords } from '../../../util/mocks'
import '../../App.scss'
import './wallet-create.scss'

export interface WalletCreateProps extends UnauthProps { }

export interface WalletCreateState {
  wallet: JsWallet | null
}

class WalletCreatePage extends React.Component<WalletCreateProps, WalletCreateState> {

  state = {
    wallet: null as unknown as JsWallet,
  }

  async componentDidMount () {
    const borkerLib = await import('borker-rs-browser')
    this.setState({
      wallet: new borkerLib.JsWallet(),
    })
  }

  render () {
    const { wallet } = this.state

    if (!wallet) {
      return null
    }

    const modal = (
      <EncryptModal newWallet={wallet} />
    )

    const words = wallet.words()

    return (
      <div className="page-content">
        <p>Below is your recovery phrase. Write it down.</p>
        <table className="words-table">
          <tbody>
            <tr>
              <td>1. {words[0]}</td>
              <td>2. {words[1]}</td>
              <td>3. {words[2]}</td>
            </tr>
            <tr>
              <td>4. {words[3]}</td>
              <td>5. {words[4]}</td>
              <td>6. {words[5]}</td>
            </tr>
            <tr>
              <td>7. {words[6]}</td>
              <td>8. {words[7]}</td>
              <td>9. {words[8]}</td>
            </tr>
            <tr>
              <td>10. {words[9]}</td>
              <td>11. {words[10]}</td>
              <td>12. {words[11]}</td>
            </tr>
          </tbody>
        </table>
        <button className="standard-button" onClick={() => this.props.toggleModal(modal)}>
          Done
        </button>
      </div>
    )
  }
}

export default withUnauthContext(WalletCreatePage)
