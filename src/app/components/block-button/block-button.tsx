import React from 'react'
import { User, BorkType } from '../../../types/types'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import './block-button.scss'
import { Parent } from '../../pages/auth-routes'
import { JsWallet } from 'borker-rs-browser'
import PinModal from '../modals/pin-modal/pin-modal'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'

export interface BlockButtonProps extends AuthProps {
  user: User
}

class BlockButton extends React.PureComponent<BlockButtonProps> {

  block = async () => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.block} />)
        return
      }
    }

    const modal = (
      <CheckoutModal
        type={BorkType.Block}
        content={this.props.user.address}
      />
    )
    this.props.toggleModal(modal)
  }

  unblock = async (parent: Parent) => {
    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={() => this.unblock(parent)} />)
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
