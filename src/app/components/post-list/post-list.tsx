import React from 'react'
import { Link } from "react-router-dom"
import { PostWithUser } from '../../../types/types'
import './post-list.css'

export interface PostListProps {
  posts: PostWithUser[]
}

export interface PostListState {
  posts: PostWithUser[]
}

class PostList extends React.Component<PostListProps, PostListState> {

  constructor(props: PostListProps) {
    super(props)
    this.state = {
      posts: props.posts
    }
  }

  render() {
    return (
      <ul className="post-list">
        {this.state.posts.map(b => {
          return (
            <li key={b.txid}>
              <Link to={`/profile/${b.address}`}>
                <img src={`data:image/png;base64,${b.user.avatar}`} className="avatar"/>
              </Link>
              <p>
                <b style={{color: 'orange'}}>{b.user.name}</b>
                <span> &#183; </span>
                <Link
                  to={`/profile/${b.address}`}
                  className="link"
                >
                  @{b.address.substring(0,11)}
                </Link>
                <span> &#183; </span>
                <span style={{color: 'gray'}}>{b.timestamp}</span>
              </p>
              <p>{b.content}</p>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default PostList
