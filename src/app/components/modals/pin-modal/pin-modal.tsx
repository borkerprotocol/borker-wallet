import React from 'react'
import '../../../App.scss'
import './pin-modal.scss'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'

export interface PinModalProps extends AuthProps {
  callback: (...args: any[]) => any
}

export interface PinModalState {
  pin: string
  error: string
  processing: boolean
}

class PinModal extends React.Component<PinModalProps, PinModalState> {
  constructor (props: PinModalProps) {
    super(props)
    this.state = {
      pin: '',
      error: '',
      processing: false,
    }
  }

  handlePinChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ pin: e.target.value, error: '' })
  }

  submit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()

    try {
      const wallet = await this.props.decryptWallet(this.state.pin)
      await this.props.login(wallet, this.state.pin)
      this.props.toggleModal(null)
      this.props.callback()
    } catch (e) {
      this.setState({ error: e.message })
    }
  }

  render () {
    const { pin, error } = this.state

    return (
      <form onSubmit={this.submit} className="pin-form">
        <p>First, please enter your pin to decrypt your wallet.</p>
        <input
          type="tel"
          placeholder="Wallet pin"
          value={pin}
          onChange={this.handlePinChange}
        />
        <input type="submit" className="small-button" value="Submit" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    )
  }
}

export default withAuthContext(PinModal)
