import React from 'react'
import { Link } from "react-router-dom"
import { RelativePostWithUser } from '../../../types/types'
import PostButtons from '../post-buttons/post-buttons'
import { fromNow, calendar } from '../../util/timestamps'
import '../../App.scss'
import './post.scss'

export interface PostComponentProps {
  isMain: boolean
  showButtons: boolean
  post: RelativePostWithUser
}

class PostComponent extends React.PureComponent<PostComponentProps> {

  render () {
    const { post, isMain, showButtons } = this.props

    const avatar = (
      <Link to={`/profile/${post.address}`}>
        <img src={`data:image/png;base64,${post.user.avatar}`} className="post-avatar" />
      </Link>
    )

    const userName = (
      <Link to={`/profile/${post.user.address}`} className="post-username">
        {post.user.name}
      </Link>
    )

    const userAddress = (
      <Link to={`/profile/${post.user.address}`} className="post-useraddress">
        @{post.user.address.substring(0,11)}
      </Link>
    )

    const PostBody = () => {
      const text = post.isThread ? `/${post.threadIndex + 1} ${post.content}` : post.content
      return (
        <Link to={`/posts/${post.txid}`} className="post-body-link">
          {isMain &&
            <h2>{text}</h2>
          }
          {!isMain &&
            <p>{text}</p>
          }
        </Link>
      )
    }

    return isMain ? (
      <div className="post-border">
        <div className="post-header">
          {avatar}
          <p>
            {userName}<br />
            {userAddress}
          </p>
        </div>
        <div className="post-content-main">
          <div className="post-border">
            <PostBody />
            <p><a href={`https://live.blockcypher.com/doge/tx/${post.txid}/`} target="_blank">{post.txid.substr(0, 30)}</a></p>
            <p style={{ color: 'gray' }}>{calendar(post.timestamp)}</p>
          </div>
          <div className="post-border">
            <p className="post-stats">
              <Link
                to={`/posts/${post.txid}/reposts`}
                className="post-body-link"
              >
                {post.reposts}<span> Reposts</span>
              </Link>
              <Link
                to={`/posts/${post.txid}/likes`}
                className="post-body-link"
              >
                {post.likes}<span> Likes</span>
              </Link>
            </p>
          </div>
        </div>
        {showButtons &&
          <div className="post-footer">
            <PostButtons post={post} showCount={false}/>
          </div>
        }
      </div>
    ) : (
      <div>
        <div className="post-header">
          {avatar}
          <p>
            {userName}<span> &#183; </span>
            {userAddress}<span> &#183; </span>
            <span style={{color: 'gray'}}>{fromNow(post.timestamp)}</span>
          </p>
        </div>
        <div className="post-content-small">
          <PostBody />
        </div>
        {showButtons &&
          <div className="post-footer-small">
            <PostButtons post={post} showCount/>
          </div>
        }
      </div>
    )
  }
}

export default PostComponent
