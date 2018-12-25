import React from 'react'
import { RelativePostWithUser } from '../../../../types/types'
import PostList from '../../../components/post-list/post-list'
import { getPosts } from '../../../util/mocks'
import '../../../App.scss'
import './post-list.scss'

export interface PostListProps {
  address: string
  setTitle: (title: string) => void
}

export interface PostListState {
  posts: RelativePostWithUser[]
}

class PostListPage extends React.Component<PostListProps, PostListState> {

  constructor (props: PostListProps) {
    super(props)
    this.state = {
      posts: [],
    }
  }

  async componentDidMount () {
    this.props.setTitle('Posts')
    this.setState({
      posts: await getPosts(this.props.address),
    })
  }

  render () {
    const { posts } = this.state

    return !posts.length ? (
      null
    ) : (
      <PostList posts={posts} />
    )
  }
}

export default PostListPage
