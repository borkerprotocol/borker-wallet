import React from 'react'
import '../../../App.scss'
import './checkout-modal.scss'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { BorkType } from '../../../../types/types'
import { Parent } from '../../../pages/auth-routes'

export interface CheckoutModalProps extends AuthProps {
  type: BorkType,
  content?: string
  parent?: Parent
}

export interface CheckoutModalState {
  processing: boolean
  error: string
}

class CheckoutModal extends React.Component<CheckoutModalProps, CheckoutModalState> {

  state = {
    processing: false,
    error: '',
  }

  broadcast = async () => {
    this.setState({
      processing: true,
    })

    try {
      await this.props.signAndBroadcast(
        this.props.type,
        undefined,
        this.props.content,
        this.props.parent,
      )
    } catch (e) {
      this.setState({
        processing: false,
        error: `error broadcasting: ${e.message}`,
      })
    }
  }

  render () {

    return (
      <div className="confirm-modal-content">
        <h1>Please Confirm</h1>
        <h3>Transaction Type: <b>{this.props.type}</b></h3>
        <br />
        <br />
        <br />
        <button
          onClick={this.broadcast}
          className="small-button"
        >
          Broadcast!
        </button>
      </div>
    )
  }
}

export default withAuthContext(CheckoutModal)
