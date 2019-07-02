import React from 'react'
import { User, BorkType } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import './follow-button.scss'
import BigNumber from 'bignumber.js'

export interface FollowButtonProps extends AuthProps {
  user: User
}

class FollowButton extends React.PureComponent<FollowButtonProps> {

  render () {
    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iFollow ? (
      <button
        onClick={() => this.props.toggleModal(<CheckoutModal type={BorkType.Delete} parent={{
          txid: this.props.user.iFollow,
          senderAddress: this.props.address,
          tip: new BigNumber(0),
        }} />)}
        className="unfollow-button"
      >
        Following
      </button>
    ) : (
      <button onClick={() => this.props.toggleModal(<CheckoutModal type={BorkType.Follow} content={this.props.user.address} />)}>
        Follow
      </button>
    )
  }
}

export default withAuthContext(FollowButton)
