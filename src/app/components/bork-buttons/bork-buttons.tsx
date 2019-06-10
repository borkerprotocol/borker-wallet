import React from 'react'
import { Link } from 'react-router-dom'
import { Bork, BorkType } from '../../../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments as commentsOutline } from '@fortawesome/free-regular-svg-icons'
import { faComments as commentsSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartOutline } from '@fortawesome/free-regular-svg-icons'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import { faSkullCrossbones } from '@fortawesome/free-solid-svg-icons'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import { withAppContext, AppProps } from '../../contexts/app-context'
import BigNumber from 'bignumber.js'
import '../../App.scss'
import './bork-buttons.scss'

export interface BorkButtonsProps extends AppProps {
  bork: Bork
  showCount: boolean
}

class BorkButtons extends React.PureComponent<BorkButtonsProps> {

  rebork = () => {
    const modal = (
      <CheckoutModal
        type={this.props.bork.iRebork ? BorkType.Delete : BorkType.Rebork}
        content={this.props.bork.iRebork ? this.props.bork.txid : undefined}
        parent={{
          txid: this.props.bork.txid,
          senderAddress: this.props.bork.sender.address,
          tip: new BigNumber(1000000000),
        }}
      />
    )
    this.props.toggleModal(modal)
  }

  like = () => {
    const already = !!this.props.bork.iLike
    const modal = (
      <CheckoutModal
        type={already ? BorkType.Delete : BorkType.Like}
        parent={already ? {
          txid: this.props.bork.iLike,
          senderAddress: this.props.address,
          tip: new BigNumber(0),
        } : {
          txid: this.props.bork.txid,
          senderAddress: this.props.bork.sender.address,
          tip: new BigNumber(200000000),
        }}
      />
    )
    this.props.toggleModal(modal)
  }

  flag = () => {
    const modal = (
      <CheckoutModal
        type={this.props.bork.iFlag ? BorkType.Delete : BorkType.Flag}
        content={this.props.bork.iFlag}
      />
    )
    this.props.toggleModal(modal)
  }

  render () {
    const { bork, showCount } = this.props
    return (
      <table className="buttons-table">
        <tbody>
          <tr>
            <td>
              <Link to={`/borks/${bork.txid}/comment`}>
                <FontAwesomeIcon
                  icon={bork.iComment ? commentsSolid : commentsOutline}
                  style={bork.iComment ? {color: 'blue'} : {} }
                /> {showCount && (bork.commentsCount || 0)}
              </Link>
            </td>
            <td>
              <a onClick={this.rebork}>
                <FontAwesomeIcon
                  icon={faRetweet}
                  style={bork.iRebork ? {color: 'green'} : {} }
                /> {showCount && (bork.reborksCount || 0)}
              </a>
            </td>
            <td>
              <a onClick={this.like}>
                <FontAwesomeIcon
                  icon={bork.iLike ? heartSolid : heartOutline}
                  style={bork.iLike ? {color: 'red'} : {} }
                /> {showCount && (bork.likesCount || 0)}
              </a>
            </td>
            <td>
              <a onClick={this.flag}>
                <FontAwesomeIcon
                  icon={faSkullCrossbones}
                  style={bork.iFlag ? {color: 'black'} : {} }
                /> {showCount && (bork.flagsCount || 0)}
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
}

export default withAppContext(BorkButtons)
