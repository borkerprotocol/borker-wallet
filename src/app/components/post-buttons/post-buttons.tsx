import React from 'react'
import { Link } from 'react-router-dom'
import { RelativePostWithUser, PostType } from '../../../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments as commentsOutline } from '@fortawesome/free-regular-svg-icons'
import { faComments as commentsSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartOutline } from '@fortawesome/free-regular-svg-icons'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import CheckoutModal from '../modals/checkout-modal/checkout-modal'
import BigNumber from 'bignumber.js'
import { withAppContext, AppProps } from '../../contexts/app-context'
import '../../App.scss'
import './post-buttons.scss'

export interface PostButtonsProps extends AppProps {
  post: RelativePostWithUser
  showCount: boolean
}

class PostButtons extends React.PureComponent<PostButtonsProps> {

  repost = () => {
    const modal = (
      <CheckoutModal type={PostType.repost} txCount={1} cost={new BigNumber(1)} />
    )
    this.props.toggleModal(modal)
  }

  like = () => {
    const modal = (
      <CheckoutModal type={PostType.like} txCount={1} cost={new BigNumber(1)} />
    )
    this.props.toggleModal(modal)
  }

  render () {
    const { post, showCount } = this.props
    return (
      <table className="buttons-table">
        <tbody>
          <tr>
            <td>
              <Link to={`/posts/${post.txid}/reply`}>
                <FontAwesomeIcon
                  icon={post.iReply ? commentsSolid : commentsOutline}
                  style={post.iReply ? {color: 'blue'} : {} }
                /> {showCount && post.replies}
              </Link>
            </td>
            <td>
              <a onClick={this.repost}>
                <FontAwesomeIcon
                  icon={faRetweet}
                  style={post.iRepost ? {color: 'green'} : {} }
                /> {showCount && post.reposts}
              </a>
            </td>
            <td>
              <a onClick={this.like}>
                <FontAwesomeIcon
                  icon={post.iLike ? heartSolid : heartOutline}
                  style={post.iLike ? {color: 'red'} : {} }
                /> {showCount && post.likes}
              </a>
            </td>
          </tr>      
        </tbody>
      </table>
    )
  }
}

export default withAppContext(PostButtons)
