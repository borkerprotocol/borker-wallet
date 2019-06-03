import React from 'react'
import { User } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import './block-button.scss'
import { BorkType } from 'borker-rs-browser'

export interface BlockButtonProps extends AuthProps {
  user: User
}

class BlockButton extends React.PureComponent<BlockButtonProps> {

  render () {

    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iBlock ? (
      <button
        onClick={() => this.props.toggleModal(<CheckoutModal data={{ type: BorkType.Unblock, content: this.props.user.address }} />)}
        className="unblock-button"
      >
        Blocking
      </button>
    ) : (
      <button onClick={() => this.props.toggleModal(<CheckoutModal data={{ type: BorkType.Unblock, content: this.props.user.address }} />)}>Block</button>
    )
  }
}

export default withAuthContext(BlockButton)
