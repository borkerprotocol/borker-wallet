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
import './post-list.scss'

export interface PostListProps {
  posts: RelativePostWithUser[]
}

export interface PostListState {
  posts: RelativePostWithUser[]
}

class PostList extends React.Component<PostListProps, PostListState> {

  constructor (props: PostListProps) {
    super(props)
    this.state = {
      posts: props.posts,
    }
  }

  reply (post: Post) {
    alert('replies coming soon')
  }

  repost (post: Post) {
    alert('reposts coming soon')
  }

  like (post: Post) {
    alert('likes coming soon')
  }

  render () {
    return (
      <ul className="post-list">
        {this.state.posts.map(p => {
          return (
            <li key={p.txid}>
              <Link to={`/profile/${p.address}`}>
                <img src={`data:image/png;base64,${p.user.avatar}`} />
              </Link>
              <div className="post-body">
                <p>
                  <b style={{color: 'orange'}}>{p.user.name}</b>
                  <span> &#183; </span>
                  <Link
                    to={`/profile/${p.address}`}
                    className="link"
                  >
                    @{p.address.substring(0,11)}
                  </Link>
                  <span> &#183; </span>
                  <span style={{color: 'gray'}}>{fromNow(p.timestamp)}</span>
                </p>
                <Link
                  to={`/posts/view`}
                >
                  <p>{p.content}</p>
                </Link>
                <table>
                  <tbody>
                    <tr>
                      <td>
                        <a onClick={() => this.reply(p)}>
                          <FontAwesomeIcon
                            icon={p.iReply ? commentsSolid : commentsOutline}
                            style={p.iReply ? {color: 'blue'} : {} }
                          /> {p.replies}
                        </a>
                      </td>
                      <td>
                        <a onClick={() => this.repost(p)}>
                          <FontAwesomeIcon
                            icon={faRetweet}
                            style={p.iRepost ? {color: 'green'} : {} }
                          /> {p.reposts}
                        </a>
                      </td>
                      <td>
                        <a onClick={() => this.like(p)}>
                          <FontAwesomeIcon
                            icon={p.iLike ? heartSolid : heartOutline}
                            style={p.iLike ? {color: 'red'} : {} }
                          /> {p.likes}
                        </a>
                      </td>
                    </tr>      
                  </tbody>
                </table>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default PostList
