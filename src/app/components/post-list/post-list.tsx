import React from 'react'
import { RelativePostWithUser, Post } from '../../../types/types'
import PostComponent from '../post/post'
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

  render () {
    const { posts } = this.state

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
