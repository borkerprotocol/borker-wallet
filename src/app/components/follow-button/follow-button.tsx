import React from 'react'
import { User, BorkType } from '../../../types/types'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import BigNumber from 'bignumber.js'

import { useAppState, useAppActions } from '../../globalState'
import './follow-button.scss'

export interface FollowButtonProps {
  user: User
}

export default function FollowButton(props: FollowButtonProps) {
  const { user } = props
  const { address } = useAppState()
  const { toggleModal } = useAppActions()

  return address === user.address ? null : user.iFollow ? (
    <button
      onClick={() =>
        toggleModal(
          <CheckoutModal
            type={BorkType.Delete}
            parent={{
              txid: user.iFollow,
              senderAddress: address,
              tip: new BigNumber(0),
            }}
          />,
        )
      }
      className="unfollow-button"
    >
      Following
    </button>
  ) : (
    <button
      onClick={() => toggleModal(<CheckoutModal type={BorkType.Follow} content={user.address} />)}
    >
      Follow
    </button>
  )
}
