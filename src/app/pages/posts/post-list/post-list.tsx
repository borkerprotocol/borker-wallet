import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { RelativePostWithUser } from '../../../../types/types'
import PostList from '../../../components/post-list/post-list'
import { getPosts } from '../../../util/mocks'
import '../../../App.scss'
import './post-list.scss'
import { getRandomInt } from '../../../web-service';

export interface PostListProps extends AuthProps {}

export interface PostListState {
  posts: RelativePostWithUser[]
}

class PostListPage extends React.Component<PostListProps, PostListState> {

  state = { posts: [] }

  async componentDidMount () {
    this.props.setTitle('Posts')
    this.props.setShowFab(true)

    // await getRandomInt()

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

export default withAuthContext(PostListPage)
