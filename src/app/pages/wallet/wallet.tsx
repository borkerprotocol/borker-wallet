import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import DepositModal from '../../components/modals/deposit-modal/deposit-modal'
import WithdrawalModal from '../../components/modals/withdrawal-modal/withdrawal-modal'
import '../../App.scss'
import './wallet.scss'
import BigNumber from 'bignumber.js'

export interface WalletProps extends AuthProps { }

class WalletPage extends React.PureComponent<WalletProps> {

  async componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Wallet')
    this.props.getBalance()
  }

  render () {
    const { balance, wallet, decryptWallet } = this.props

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
              <td><button onClick={() => this.props.toggleModal(<WithdrawalModal balance={balance} />)}>Withdraw</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default withAuthContext(WalletPage)