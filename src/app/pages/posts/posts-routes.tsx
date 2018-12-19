import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { RelativePostWithUser } from '../../../types/types'
import { getPosts } from '../../util/mocks'
import PostList from '../../components/post-list/post-list'
import PostViewPage from './post-view/post-view'
import PostNewPage from './post-new/post-new'
import '../../App.scss'
import './posts-routes.scss'

export interface PostsProps {
  address: string
  setTitle: (title: string) => void
}

export interface PostsState {
  loading: boolean
  posts: RelativePostWithUser[]
}

class PostsPage extends React.Component<PostsProps, PostsState> {

  constructor (props: PostsProps) {
    super(props)
    this.state = {
      loading: true,
      posts: []
    }
  }

  async componentDidMount () {
    this.props.setTitle('Posts')
    this.setState({
      posts: await getPosts(this.props.address),
      loading: false,
    })
  }

  render() {
    const { loading, posts } = this.state
    return (
      <div>
        {!loading &&
          <Switch>
            <Route
              exact
              path="/posts"
              render={props => <PostList {...props} posts={posts} />}
            />
            <Route
              exact
              path="/posts/new"
              render={props => <PostNewPage {...props} setTitle={this.props.setTitle} />}
            />
            <Route
              exact
              path="/posts/view"
              render={props => <PostViewPage {...props} setTitle={this.props.setTitle} post={posts[0]} />}
            />
            <Redirect to="/posts" />
          </Switch>
        }
      </div>
    )
  }
}

export default PostsPage
