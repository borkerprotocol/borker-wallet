import React from 'react'
import '../../App.css'
import './wallet.css'
import { Link, RouteComponentProps } from 'react-router-dom';

export interface WalletParams {
  address: string
}

export interface WalletProps extends RouteComponentProps<WalletParams> {}

export interface WalletState {
  address: string
  balance: number
}

class WalletPage extends React.Component<WalletProps, WalletState> {

  constructor(props: WalletProps) {
    super(props)
    this.state = {
      address: props.match.params.address || '',
      balance: 0
    }
  }

  render() {
    return (
      <div className="page-content">
        {!this.state.address &&
          <div>
            <button>
              <Link to="wallet/create">Create New Wallet</Link>
            </button>
            <br></br>
            <button>
              <Link to="wallet/restore">Restore Existing Wallet</Link>
            </button>
          </div>
        }
        {this.state.address &&
          <div>
            <p><b>Address: </b>{this.state.address}</p>
            <p><b>Balance: </b>{this.state.balance}</p>
          </div>
        }
      </div>
    )
  }
}

export default WalletPage
