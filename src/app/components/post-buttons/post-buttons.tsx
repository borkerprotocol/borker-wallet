import React from 'react'
import { RelativePostWithUser, Post } from '../../../types/types'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments as commentsOutline } from '@fortawesome/free-regular-svg-icons'
import { faComments as commentsSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartOutline } from '@fortawesome/free-regular-svg-icons'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import '../../App.scss'
import './post-buttons.scss'

export interface PostButtonsProps {
  post: RelativePostWithUser
  showCount: boolean
}

class PostButtons extends React.PureComponent<PostButtonsProps> {

  async reply (post: Post): Promise<void> {
    alert('replies coming soon')
  }

  async repost (post: Post): Promise<void> {
    alert('reposts coming soon')
  }

  async like (post: Post): Promise<void> {
    alert('likes coming soon')
  }

  render () {
    const { post, showCount } = this.props
    return (
      <table>
        <tbody>
          <tr>
            <td>
              <a onClick={() => this.reply(post)}>
                <FontAwesomeIcon
                  icon={post.iReply ? commentsSolid : commentsOutline}
                  style={post.iReply ? {color: 'blue'} : {} }
                /> {showCount && post.replies}
              </a>
            </td>
            <td>
              <a onClick={() => this.repost(post)}>
                <FontAwesomeIcon
                  icon={faRetweet}
                  style={post.iRepost ? {color: 'green'} : {} }
                /> {showCount && post.reposts}
              </a>
            </td>
            <td>
              <a onClick={() => this.like(post)}>
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

export default PostButtons
