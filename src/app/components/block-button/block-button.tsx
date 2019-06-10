import React from 'react'
import { User, BorkType } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import './block-button.scss'
import BigNumber from 'bignumber.js'

export interface BlockButtonProps extends AuthProps {
  user: User
}

class BlockButton extends React.PureComponent<BlockButtonProps> {

  render () {

    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iBlock ? (
      <button
        onClick={() => this.props.toggleModal(<CheckoutModal type={BorkType.Delete} parent={{
          txid: this.props.user.iBlock,
          senderAddress: this.props.address,
          tip: new BigNumber(0),
        }} />)}
        className="unblock-button"
      >
        Blocking
      </button>
    ) : (
      <button
        onClick={() => this.props.toggleModal( <CheckoutModal type={BorkType.Block} content={this.props.user.address} />)}>
        Block
      </button>
    )
  }
}

export default withAuthContext(BlockButton)
