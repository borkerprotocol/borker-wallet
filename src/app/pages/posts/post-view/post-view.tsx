import React from 'react'
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

export interface PostViewProps extends RouteComponentProps<PostViewParams> {
  address: string
  setTitle: (title: string) => void
}

export interface PostViewState {
  post: RelativePostWithUser | null
  thread: RelativePostWithUser[]
}

class PostViewPage extends React.Component<PostViewProps, PostViewState> {

  constructor (props: PostViewProps) {
    super(props)
    this.state = {
      post: null,
      thread: [],
    }
  }

  async componentDidMount () {
    this.props.setTitle('Post')
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
        <PostComponent post={post} />
        <PostList posts={thread} />
      </div>
    )
  }
}

export default PostViewPage
