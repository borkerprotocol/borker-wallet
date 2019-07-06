import React from 'react'
import '../../../App.scss'
import './pin-modal.scss'

export interface PinModalProps {
  usePinFn: (pin: string) => void
}

export interface PinModalState {
  pin: string
}

class PinModal extends React.Component<PinModalProps, PinModalState> {

  constructor (props: PinModalProps) {
    super(props)
    this.state = {
      pin: '',
    }
  }

  handlePinChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ pin: e.target.value })
  }

  submitPin = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    this.props.usePinFn(this.state.pin)
  }

  render () {
    const { pin } = this.state

    return (
      <form onSubmit={this.submitPin} className="pin-form">
        <p>Enter your pin. Simply hit "Done" if you do not have a pin.</p>
        <input type="pin" placeholder="Pin" value={pin} onChange={this.handlePinChange} />
        <input type="submit" className="small-button" value="Done" />
      </form>
    )
  }
}

export default PinModal
