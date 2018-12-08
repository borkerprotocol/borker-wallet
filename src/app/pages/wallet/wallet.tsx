import React from 'react'
import '../../App.scss'
import './wallet.scss'

export interface WalletProps {
  address: string
  balance: number
}

export interface WalletState {
  address: string
  balance: number
}

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor(props: WalletProps) {
    super(props)
    this.state = { ...props }
  }

  render() {
    const { address, balance } = this.state

    return (
      <div className="page-content">
        <p><b>Address: </b>{this.state.address}</p>
        <p><b>Balance: </b>{this.state.balance}</p>
      </div>
    )
  }
}

export default WalletPage
