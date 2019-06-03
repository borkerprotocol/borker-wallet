import React from 'react'
import { User } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import './follow-button.scss'
import { BorkType } from 'borker-rs-browser'

export interface FollowButtonProps extends AuthProps {
  user: User
}

class FollowButton extends React.PureComponent<FollowButtonProps> {

  render () {

    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iFollow ? (
      <button
        onClick={() => this.props.toggleModal(<CheckoutModal data={{ type: BorkType.Unfollow, content: this.props.user.address }} />)}
        className="unfollow-button"
      >
        Following
      </button>
    ) : (
      <button onClick={() => this.props.toggleModal(<CheckoutModal data={{ type: BorkType.Follow, content: this.props.user.address }} />)}>Follow</button>
    )
  }
}

export default withAuthContext(FollowButton)
