import React from 'react'
import { Link } from "react-router-dom"
import { RelativePostWithUser, Post } from '../../../types/types'
import { fromNow } from '../../util/timestamps'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments as commentsOutline } from '@fortawesome/free-regular-svg-icons'
import { faComments as commentsSolid } from '@fortawesome/free-solid-svg-icons'
import { faHeart as heartOutline } from '@fortawesome/free-regular-svg-icons'
import { faHeart as heartSolid } from '@fortawesome/free-solid-svg-icons'
import { faRetweet } from '@fortawesome/free-solid-svg-icons'
import '../../App.scss'
import './post.scss'

export interface PostComponentProps {
  post: RelativePostWithUser
}

class PostComponent extends React.Component<PostComponentProps, {}> {

  constructor (props: PostComponentProps) {
    super(props)
    this.state = {
      posts: props.post,
    }
  }

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
    const { post } = this.props
    return (
      <div>
        <Link to={`/profile/${post.address}`}>
          <img src={`data:image/png;base64,${post.user.avatar}`} className="post-avatar" />
        </Link>
        <div className="post-content">
          <p>
            <Link to={`/profile/${post.address}`} className="post-username">
              {post.user.name}
            </Link>
              <span> &#183; </span>
            <Link to={`/profile/${post.address}`} className="post-useraddress">
              @{post.address.substring(0,11)}
            </Link>
            <span> &#183; </span>
            <span style={{color: 'gray'}}>{fromNow(post.timestamp)}</span>
          </p>
          <Link to={`/posts/${post.txid}`} className="post-body">
            <p>{post.isThread ? `/${post.threadIndex + 1} ${post.content}` : post.content}</p>
          </Link>
          <table>
            <tbody>
              <tr>
                <td>
                  <a onClick={() => this.reply(post)}>
                    <FontAwesomeIcon
                      icon={post.iReply ? commentsSolid : commentsOutline}
                      style={post.iReply ? {color: 'blue'} : {} }
                    /> {post.replies}
                  </a>
                </td>
                <td>
                  <a onClick={() => this.repost(post)}>
                    <FontAwesomeIcon
                      icon={faRetweet}
                      style={post.iRepost ? {color: 'green'} : {} }
                    /> {post.reposts}
                  </a>
                </td>
                <td>
                  <a onClick={() => this.like(post)}>
                    <FontAwesomeIcon
                      icon={post.iLike ? heartSolid : heartOutline}
                      style={post.iLike ? {color: 'red'} : {} }
                    /> {post.likes}
                  </a>
                </td>
              </tr>      
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default PostComponent
