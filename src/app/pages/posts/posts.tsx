import React from 'react'
import { PostWithUser } from '../../../types/types'
import { getPostsWithUser } from '../../util/mocks'
import PostList from '../../components/post-list/post-list';

export interface PostsProps {}

export interface PostsState {
  posts: PostWithUser[]
}

class PostsPage extends React.Component<PostsProps, PostsState> {

  constructor(props: PostsProps) {
    super(props)
    this.state = {
      posts: []
    }
  }

  async componentDidMount() {
    const posts = await this._getPosts()
    this.setState({ posts })
  }

  async _getPosts(): Promise<PostWithUser[]> {
    return getPostsWithUser()
  }

  render() {
    return (
      <div>
        {this.state.posts.length &&
          <PostList posts={this.state.posts} />
        }
      </div>
    )
  }
}

export default PostsPage
