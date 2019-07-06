import React from 'react'
import { JsWallet } from 'borker-rs-browser'
import { withAppContext, AppProps } from '../../../contexts/app-context'
import '../../../App.scss'
import './encrypt-modal.scss'

export interface EncryptModalProps extends AppProps {
  newWallet: JsWallet
}

export interface EncryptModalState {
  pin: string
}

class EncryptModal extends React.Component<EncryptModalProps, EncryptModalState> {

  constructor (props: EncryptModalProps) {
    super(props)
    this.state = {
      pin: '',
    }
  }

  saveWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.login(this.props.newWallet, this.state.pin)
  }

  handlePinChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ pin: e.target.value })
  }

  render () {
    const { pin } = this.state

    return (
      <form onSubmit={this.saveWallet} className="encrypt-form">
        <p>Encrypt Wallet (optional)</p>
        <p>You will be required to enter your pin with each new session. If you forget your pin, you can still recover your wallet using your recovery phrase.</p>
        <input type="number" placeholder="Optional Pin" value={pin} onChange={this.handlePinChange} />
        <input type="submit" className="small-button" value="Save" />
      </form>
    )
  }
}

export default withAppContext(EncryptModal)
