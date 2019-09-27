import React from 'react'
import { User, BorkType } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import './follow-button.scss'
import { JsWallet } from 'borker-rs-browser'
import PinModal from '../modals/pin-modal/pin-modal'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import { Parent } from '../../pages/auth-routes'

export interface FollowButtonProps extends AuthProps {
  user: User
}

class FollowButton extends React.PureComponent<FollowButtonProps> {

  follow = async () => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.follow} />)
        return
      }
    }

    const modal = (
      <CheckoutModal
        type={BorkType.Follow}
        content={this.props.user.address}
      />
    )
    this.props.toggleModal(modal)
  }

  unfollow = async (parent: Parent) => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={() => this.unfollow(parent)} />)
        return
      }
    }

    const modal = (
      <CheckoutModal
        type={BorkType.Delete}
        parent={parent}
      />
    )
    this.props.toggleModal(modal)
  }

  render () {
    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iFollow ? (
      <button
        onClick={() => this.unfollow(
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
      <button onClick={this.follow}>
        Follow
      </button>
    )
  }
}

export default withAuthContext(FollowButton)
