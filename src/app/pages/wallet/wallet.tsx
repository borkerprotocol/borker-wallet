import React from 'react'
import '../../App.scss'
import './wallet.scss'

export interface WalletProps {
  address: string
}

export interface WalletState {
  address: string
  balance: number
}

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor(props: WalletProps) {
    super(props)
    this.state = {
      address: props.address,
      balance: 0
    }
  }

  async componentDidMount() {
    // await getWallet(address)
  }

  render() {
    const { address, balance } = this.state

    return (
      <div className="page-content">
        <p><b>Address: </b>{address}</p>
        <p><b>Balance: </b>{balance}</p>
      </div>
    )
  }
}

export default WalletPage
