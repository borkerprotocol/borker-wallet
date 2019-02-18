import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import DepositModal from '../../components/modals/deposit-modal/deposit-modal'
// import WithdrawalModal from '../../components/modals/withdrawal-modal/withdrawal-modal'
import '../../App.scss'
import './wallet.scss'


export interface WalletProps extends AuthProps {}

class WalletPage extends React.PureComponent<WalletProps> {

  async componentDidMount () {
    this.props.setShowFab(true)
    this.props.setTitle('Wallet')
  }

  render () {
    const { balance } = this.props

    return (
      <div className="page-content">
        <div className="wallet-balance">
          <h1>
            {balance.toFormat(8)}
          </h1>
        </div>
        <table className="wallet-buttons">
          <tbody>
            <tr>
              <td><button onClick={() => this.props.toggleModal(<DepositModal />)}>Deposit</button></td>
              <td><button onClick={() => alert('withdrawals coming soon')}>Withdrawal</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }
}

export default withAuthContext(WalletPage)