import React from 'react'
import { AppProps, withAppContext } from '../../../contexts/app-context'
import QRCode from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'
import '../../../App.scss'
import './deposit-modal.scss'

export interface DepositModalProps extends AppProps {}

export interface DepositModalState {
  isCopied: boolean
}

class DepositModal extends React.Component<DepositModalProps, DepositModalState> {

  constructor (props: DepositModalProps) {
    super(props)
    this.state = {
      isCopied: false,
    }
  }

  copyToClipboard = () => {
    this.setState({ isCopied: true })
    setTimeout(() => this.setState({ isCopied: false }), 1000)
  }

  render () {
    const { isCopied } = this.state
    const { address } = this.props

    return (
      <div className="deposit-modal">
        <p><b>Dogecoin Address</b></p>
        <p className="deposit-modal-address">{address}</p>
        <QRCode value={address} /><br />
        <CopyToClipboard text={address}>
          <button onClick={this.copyToClipboard}>Copy</button>
        </CopyToClipboard>
        {isCopied &&
          <p style={{ color: 'green' }}>Copied to Clipboard!</p>
        }
      </div>
    )
  }
}

export default withAppContext(DepositModal)
