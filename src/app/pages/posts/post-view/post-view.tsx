import React from 'react'
import { RelativePostWithUser } from '../../../../types/types'
import PostList from '../../../components/post-list/post-list'
import '../../../App.scss'
import './post-view.scss'

export interface PostViewProps {
  post: RelativePostWithUser
  setTitle: (title: string) => void
}

export interface PostViewState {
  thread: RelativePostWithUser[]
}

class PostViewPage extends React.Component<PostViewProps, PostViewState> {

  constructor (props: PostViewProps) {
    super(props)
    this.state = {
      thread: [],
    }
  }

  async componentDidMount () {
    this.props.setTitle('Post View')
  }

  render () {
    return (
      <div>
        <PostList posts={[this.props.post]} />
      </div>
    )
  }
}

export default PostViewPage
