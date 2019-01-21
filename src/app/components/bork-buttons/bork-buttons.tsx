import React from 'react'
import { Link } from 'react-router-dom'
import { Bork, BorkType } from '../../../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments as commentsOutline } from '@fortawesome/free-regular-svg-icons'
import { faComments as commentsSolid } from '@fortawesome/free-solid-svg-icons'
import { faBone } from '@fortawesome/free-solid-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import { withAppContext, AppProps } from '../../contexts/app-context'
import '../../App.scss'
import './bork-buttons.scss'

export interface BorkButtonsProps extends AppProps {
  bork: Bork
  showCount: boolean
}

class BorkButtons extends React.PureComponent<BorkButtonsProps> {

  rebork = () => {
    const modal = (
      <CheckoutModal type={BorkType.rebork} txCount={1} />
    )
    this.props.toggleModal(modal)
  }

  like = () => {
    const modal = (
      <CheckoutModal type={BorkType.like} txCount={1} />
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
                  icon={faBone}
                  style={bork.iLike ? {color: 'orange'} : {} }
                /> {showCount && (bork.likesCount || 0)}
              </a>
            </td>
          </tr>      
        </tbody>
      </table>
    )
  }
}

export default withAppContext(BorkButtons)
