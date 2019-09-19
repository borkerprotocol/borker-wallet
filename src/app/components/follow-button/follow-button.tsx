import React from 'react'
import { User, BorkType } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import './follow-button.scss'

export interface FollowButtonProps extends AuthProps {
  user: User
}

class FollowButton extends React.PureComponent<FollowButtonProps> {

  render () {
    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iFollow ? (
      <button
        onClick={() => this.props.signAndBroadcast(
          BorkType.Delete,
          undefined,
          undefined,
          {
            txid: this.props.user.iFollow,
            senderAddress: this.props.address,
          },
        )}
        className="unfollow-button"
      >
        Following
      </button>
    ) : (
      <button onClick={() => this.props.signAndBroadcast(
        BorkType.Follow,
        undefined,
        this.props.user.address,
      )}>
        Follow
      </button>
    )
  }
}

export default withAuthContext(FollowButton)
