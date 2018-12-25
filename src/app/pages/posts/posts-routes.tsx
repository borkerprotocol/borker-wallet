import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { RelativePostWithUser, Post } from '../../../types/types'
import { getPosts } from '../../util/mocks'
import PostList from './post-list/post-list'
import PostViewPage from './post-view/post-view'
import PostNewPage from './post-new/post-new'
import '../../App.scss'
import './posts-routes.scss'

export interface PostsProps {
  address: string
  setTitle: (title: string) => void
}

class PostsPage extends React.Component<PostsProps, {}> {

  constructor (props: PostsProps) {
    super(props)
    this.state = {
      loading: true,
    }
  }

  render () {
    return (
      <Switch>
        <Route
          exact
          path="/posts"
          render={props => <PostList {...props} setTitle={this.props.setTitle} address={this.props.address} />}
        />
        <Route
          exact
          path="/posts/new"
          render={props => <PostNewPage {...props} setTitle={this.props.setTitle} />}
        />
        <Route
          exact
          path="/posts/:id"
          render={props => <PostViewPage {...props} setTitle={this.props.setTitle} address={this.props.address} />}
        />
        <Redirect to="/posts" />
      </Switch>
    )
  }
}

export default PostsPage
