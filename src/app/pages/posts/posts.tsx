import React from 'react'
import { Link } from "react-router-dom"
import { Post } from '../../../types/types'
import { getPosts } from '../../util/mocks'
import './posts.css'

export interface PostsProps {}

export interface PostsState {
  posts: Post[]
}

class PostsPage extends React.Component<PostsProps, PostsState> {

  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  async componentDidMount() {
    this.setState({ posts: await this._getPosts() })
  }

  async _getPosts(): Promise<Post[]> {
    return getPosts()
  }

  render() {
    return (
      <ul>
        {this.state.posts.map(post => {
          return (
            <li key={post.txid}>
              <p>
                {post.user.name}
                <span> &#183; </span>
                <Link
                  to={`/profile/${post.user.address}`}
                  className="link"
                >
                  @{post.user.address.substring(0,11)}
                </Link>
                <span> &#183; </span>
                {post.timestamp}
              </p>
              <p>
                {post.content}
              </p>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default PostsPage
