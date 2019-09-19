import React from 'react'
import { User, BorkType } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import './block-button.scss'
import { Parent } from '../../pages/auth-routes'

export interface BlockButtonProps extends AuthProps {
  user: User
}

class BlockButton extends React.PureComponent<BlockButtonProps> {

  block = async () => {
    await this.props.signAndBroadcast(
      BorkType.Block,
      undefined,
      this.props.user.address,
    )
  }

  unblock = async (parent: Parent) => {
    await this.props.signAndBroadcast(
      BorkType.Delete,
      undefined,
      undefined,
      parent,
    )
  }

  render () {

    return this.props.address === this.props.user.address ? (
      null
    ) : this.props.user.iBlock ? (
      <button
        onClick={() => this.unblock({
          txid: this.props.user.iBlock,
          senderAddress: this.props.address,
        })}
        className="unblock-button"
      >
        Blocking
      </button>
    ) : (
      <button
        onClick={this.block}>
        Block
      </button>
    )
  }
}

export default withAuthContext(BlockButton)
