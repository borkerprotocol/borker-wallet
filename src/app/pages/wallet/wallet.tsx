import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import DepositModal from '../../components/modals/deposit-modal/deposit-modal'
// import WithdrawalModal from '../../components/modals/withdrawal-modal/withdrawal-modal'
import BigNumber from 'bignumber.js'
import '../../App.scss'
import './wallet.scss'


export interface WalletProps extends AuthProps {
}

export interface WalletState {
  address: string
  balance: BigNumber
}

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor (props: WalletProps) {
    super(props)
    this.state = {
      address: props.address,
      balance: new BigNumber(0),
    }
  }

  async componentDidMount () {
    this.props.setShowFab(true)
    this.props.setTitle('Wallet')
  }

  render () {
    const { balance } = this.state

    return (
      <div className="page-content">
        <p><b>Balance: </b>{balance.toFormat(8)} DOGE</p>
        <button onClick={() => this.props.toggleModal(<DepositModal />)}>Deposit</button><br />
        <button onClick={() => alert('withdrawals coming soon')}>Withdrawal</button>
      </div>
    )
  }
}

export default withAuthContext(WalletPage)
