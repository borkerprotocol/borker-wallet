import React from 'react'
import { RelativePostWithUser, Post } from '../../../types/types'
import PostComponent from '../post/post'
import '../../App.scss'
import './post-list.scss'

export interface PostListProps {
  posts: RelativePostWithUser[]
}

class PostList extends React.PureComponent<PostListProps> {

  render () {
    const { posts } = this.props

    return (
      <ul className="post-list">
        {posts.map(p => {
          return (
            <li key={p.txid}>
              <PostComponent post={p} isMain={false}/>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default PostList
