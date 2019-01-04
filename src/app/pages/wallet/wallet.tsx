import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import DepositModal from '../../components/modals/deposit-modal/deposit-modal'
// import WithdrawalModal from '../../components/modals/withdrawal-modal/withdrawal-modal'
import { Transaction } from '../../../types/types'
import { getWallet } from '../../util/mocks'
import { formatShort } from '../../util/timestamps'
import BigNumber from 'bignumber.js'
import '../../App.scss'
import './wallet.scss'


export interface WalletProps extends AuthProps {}

export interface WalletState {
  address: string
  balance: BigNumber
  transactions: Transaction[]
}

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor (props: WalletProps) {
    super(props)
    this.state = {
      address: props.address,
      balance: new BigNumber(0),
      transactions: [],
    }
  }

  async componentDidMount () {
    this.props.setShowFab(true)
    this.props.setTitle('Wallet')

    const walletInfo = await getWallet(this.props.address)

    this.setState({
      balance: walletInfo.balance,
      transactions: walletInfo.transactions,
    })
  }

  render () {
    const { balance, transactions } = this.state

    return (
      <div className="page-content">
        <div className="wallet-balance">
          <h1>
            {balance.toFormat()}
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
        <ul className="tx-list">
          {transactions.map(t => {
            return (
              <li key={t.txid}>
                {formatShort(t.timestamp)}
                <div className="tx-amount" style={t.amount.isLessThanOrEqualTo(0) ? {color: 'red'} : {} }>
                  {t.amount.toFormat()}
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
}

export default withAuthContext(WalletPage)
