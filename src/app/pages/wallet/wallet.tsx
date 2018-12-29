import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import '../../App.scss'
import './wallet.scss'


export interface WalletProps extends AuthProps {
}

export interface WalletState {
  address: string
  balance: number
}

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor (props: WalletProps) {
    super(props)
    this.state = {
      address: props.address,
      balance: 0,
    }
  }

  async componentDidMount () {
    this.props.setShowFab(true)
    this.props.setTitle('Wallet')
  }

  render () {
    const { address, balance } = this.state

    return (
      <div className="page-content">
        <p><b>Address: </b>{address}</p>
        <p><b>Balance: </b>{balance}</p>
      </div>
    )
  }
}

export default withAuthContext(WalletPage)
