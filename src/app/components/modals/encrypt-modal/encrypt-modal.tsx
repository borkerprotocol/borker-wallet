import React from 'react'
import { JsWallet } from 'borker-rs-browser'
import { withAppContext, AppProps } from '../../../contexts/app-context'
import '../../../App.scss'
import './encrypt-modal.scss'

export interface EncryptModalProps extends AppProps {
  newWallet: JsWallet
}

export interface EncryptModalState {
  password: string
}

class EncryptModal extends React.Component<EncryptModalProps, EncryptModalState> {

  constructor (props: EncryptModalProps) {
    super(props)
    this.state = {
      password: '',
    }
  }

  saveWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    this.props.login(this.props.newWallet, this.state.password)
  }

  handlePasswordChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ password: e.target.value })
  }

  render () {
    const { password } = this.state

    return (
      <form onSubmit={this.saveWallet} className="password-form">
        <p>Encrypt wallet on device. (recommended)</p>
        <input type="password" placeholder="Password or Pin" value={password} onChange={this.handlePasswordChange} />
        <input type="submit" value="Encrypt Wallet" />
      </form>
    )
  }
}

export default withAppContext(EncryptModal)
