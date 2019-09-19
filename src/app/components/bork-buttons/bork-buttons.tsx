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
import TipModal from '../modals/tip-modal/tip-modal'
import '../../App.scss'
import './bork-buttons.scss'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { Parent } from '../../pages/auth-routes'

export interface BorkButtonsProps extends AuthProps {
  bork: Bork
  showCount: boolean
}

class BorkButtons extends React.PureComponent<BorkButtonsProps> {

  rebork = () => {
    const modal = (
      <TipModal
        type={BorkType.Rebork}
        content={''}
        parent={{
          txid: this.props.bork.txid,
          senderAddress: this.props.bork.sender.address,
        }}
      />
    )
    this.props.toggleModal(modal)
  }

  like = () => {
    const modal = (
      <TipModal
        type={BorkType.Like}
        content={''}
        parent={{
          txid: this.props.bork.txid,
          senderAddress: this.props.bork.sender.address,
        }}
      />
    )
    this.props.toggleModal(modal)
  }

  flag = async () => {
    await this.props.signAndBroadcast(
      BorkType.Flag,
      undefined,
      undefined,
      {
        txid: this.props.bork.txid,
        senderAddress: this.props.bork.sender.address,
      },
    )
  }

  delete = async (parent: Parent) => {
    await this.props.signAndBroadcast(
      BorkType.Delete,
      undefined,
      undefined,
      parent,
    )
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
              <a onClick={bork.iRebork ? () => this.delete({
                  txid: this.props.bork.iRebork!,
                  senderAddress: this.props.address,
                }) : this.rebork}>
                <FontAwesomeIcon
                  icon={faRetweet}
                  style={bork.iRebork ? {color: 'green'} : {} }
                /> {showCount && (bork.reborksCount || 0)}
              </a>
            </td>
            <td>
              <a onClick={bork.iLike ? () => this.delete({
                  txid: this.props.bork.iLike!,
                  senderAddress: this.props.address,
                }) : this.like}>
                <FontAwesomeIcon
                  icon={bork.iLike ? heartSolid : heartOutline}
                  style={bork.iLike ? {color: 'red'} : {} }
                /> {showCount && (bork.likesCount || 0)}
              </a>
            </td>
            <td>
              <a onClick={bork.iFlag ? () => this.delete({
                  txid: this.props.bork.iFlag!,
                  senderAddress: this.props.address,
                }) : this.flag}>
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

export default withAuthContext(BorkButtons)
