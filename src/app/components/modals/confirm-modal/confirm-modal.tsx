import React from 'react'
import '../../../App.scss'
import './confirm-modal.scss'
import * as Storage from 'idb-keyval'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'

export interface ConfirmModalProps extends AuthProps { }

export interface ConfirmModalState {
  hideConfirmation: boolean
}

class ConfirmModal extends React.Component<ConfirmModalProps, ConfirmModalState> {

  state = {
    hideConfirmation: false,
  }

  handleSelect = (e: React.BaseSyntheticEvent) => {
    console.log(e.target.checked)
    this.setState({
      hideConfirmation: e.target.checked,
    })
  }

  close = async () => {
    if (this.state.hideConfirmation) {
      await Storage.set('hideConfirmation', true)
    }
    this.props.toggleModal(null)
  }

  render () {
    const { hideConfirmation } = this.state

    return (
      <div className="confirm-modal-content">
        <h1>Success!</h1>
        <h3>Please note, your action will only appear in Borker once it gets mined into a block. This can sometimes take a few minutes.</h3>
        <input type="checkbox" id="" checked={hideConfirmation} onChange={this.handleSelect} />
        <label>Don't show me this again</label>
        <br />
        <br />
        <br />
        <button
          onClick={this.close}
          className="small-button"
        >
          OK!
        </button>
      </div>
    )
  }
}

export default withAuthContext(ConfirmModal)
