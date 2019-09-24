import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import DepositModal from '../../components/modals/deposit-modal/deposit-modal'
import WithdrawalModal from '../../components/modals/withdrawal-modal/withdrawal-modal'
import '../../App.scss'
import './wallet.scss'
import BigNumber from 'bignumber.js'
import { JsWallet } from 'borker-rs-browser'
import PinModal from '../../components/modals/pin-modal/pin-modal'

export interface WalletProps extends AuthProps { }

class WalletPage extends React.PureComponent<WalletProps> {

  async componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Wallet')
    this.props.getBalance()
  }

  withdraw = async () => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.withdraw} />)
        return
      }
    }

    this.props.toggleModal(<WithdrawalModal />)
  }

  render () {
    const { balance } = this.props

    return (
      <div className="page-content">
        <div className="wallet-balance">
          <h1>
            {balance && balance.isGreaterThan(0) ? balance.dividedBy(100000000).toFormat(8) : new BigNumber(0).toFormat(8)}
          </h1>
        </div>
        <table className="wallet-buttons">
          <tbody>
            <tr>
              <td><button onClick={() => this.props.toggleModal(<DepositModal />)}>Deposit</button></td>
              <td><button onClick={this.withdraw}>Withdraw</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default withAuthContext(WalletPage)