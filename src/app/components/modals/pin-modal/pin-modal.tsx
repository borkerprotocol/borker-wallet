import React from 'react'
import '../../../App.scss'
import './pin-modal.scss'

export interface PinModalProps {
  usePinFn: (pin: string) => Promise<void>
}

export interface PinModalState {
  pin: string
  error: string
}

class PinModal extends React.Component<PinModalProps, PinModalState> {
  constructor(props: PinModalProps) {
    super(props)
    this.state = {
      pin: '',
      error: '',
    }
  }

  handlePinChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ pin: e.target.value, error: '' })
  }

  submitPin = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    this.props
      .usePinFn(this.state.pin)
      .catch(err => this.setState({ error: err.message }))
  }

  render() {
    const { pin, error } = this.state

    return (
      <form onSubmit={this.submitPin} className="pin-form">
        <p>Enter your pin if you have one.</p>
        <input
          type="number"
          placeholder="Pin"
          value={pin}
          onChange={this.handlePinChange}
        />
        <input type="submit" className="small-button" value="Submit" />
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
    )
  }
}

export default PinModal
