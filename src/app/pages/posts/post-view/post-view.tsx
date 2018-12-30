import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { RelativePostWithUser } from '../../../../types/types'
import PostList from '../../../components/post-list/post-list'
import { RouteComponentProps } from 'react-router'
import { getPosts } from '../../../util/mocks'
import PostComponent from '../../../components/post/post'
import '../../../App.scss'
import './post-view.scss'

export interface PostViewParams {
  id: string
}

export interface PostViewProps extends AuthProps, RouteComponentProps<PostViewParams> {}

export interface PostViewState {
  post: RelativePostWithUser | null
  thread: RelativePostWithUser[]
}

class PostViewPage extends React.Component<PostViewProps, PostViewState> {

  state = {
    post: null,
    thread: [],
  }

  async componentDidMount () {
    this.props.setTitle('Post')
    this.props.setShowFab(false)

    const txid = this.props.match.params.id
    const posts = await getPosts(this.props.address, undefined, txid)
    const post = posts.shift() as RelativePostWithUser
    
    this.setState({
      post,
      thread: posts,
    })
  }

  render () {
    const { post, thread } = this.state

    return !post ? (
      <div>
        <p>Post not found.</p>
      </div>
    ) : (
      <div>
        <PostComponent post={post} isMain showButtons/>
        <PostList posts={thread} />
      </div>
    )
  }
}

export default withAuthContext(PostViewPage)
