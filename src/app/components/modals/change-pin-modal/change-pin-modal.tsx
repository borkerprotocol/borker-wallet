import React from 'react'
import '../../../App.scss'
import './change-pin-modal.scss'
import { withAuthContext, AuthProps } from '../../../contexts/auth-context'

export interface ChangePinModalProps extends AuthProps {}

export interface ChangePinModalState {
  oldPin: string
  newPin: string
  error: string
}

class ChangePinModal extends React.Component<ChangePinModalProps, ChangePinModalState> {
  constructor (props: ChangePinModalProps) {
    super(props)
    this.state = {
      oldPin: '',
      newPin: '',
      error: '',
    }
  }

  handleOldPinChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ oldPin: e.target.value, error: '' })
  }

  handleNewPinChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ newPin: e.target.value })
  }

  savePin = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()

    try {
      const wallet = await this.props.decryptWallet(this.state.oldPin)
      await this.props.encryptWallet(wallet, this.state.newPin)
      this.props.toggleModal(null)
    } catch (e) {
      this.setState({ error: e.message })
    }
  }

  render () {
    const { oldPin, newPin, error } = this.state

    return (
      <form onSubmit={this.savePin} className="change-pin-form">
        <input
          type="text"
          placeholder="Old pin (optional)"
          value={oldPin}
          onChange={this.handleOldPinChange}
        />
        <input
          type="tel"
          placeholder="New pin (optional)"
          value={newPin}
          onChange={this.handleNewPinChange}
        />
        <input type="submit" className="small-button" value="Save" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    )
  }
}

export default withAuthContext(ChangePinModal)
