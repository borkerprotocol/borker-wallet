import React from 'react'
import { RelativePostWithUser } from '../../../types/types'
import { getPosts } from '../../util/mocks'
import PostList from '../../components/post-list/post-list'
import './posts.scss'

export interface PostsProps {
  address: string
  setTitle: (title: string) => void
}

export interface PostsState {
  posts: RelativePostWithUser[]
}

class PostsPage extends React.Component<PostsProps, PostsState> {

  constructor(props: PostsProps) {
    super(props)
    this.state = {
      posts: []
    }
  }

  async componentDidMount() {
    this.props.setTitle('Posts')
    this.setState({ posts: await getPosts(this.props.address) })
  }

  render() {
    return (
      <div>
        {this.state.posts.length &&
          <PostList posts={this.state.posts} />
        }
        <button className="fab">+</button>
      </div>
    )
  }
}

export default PostsPage
