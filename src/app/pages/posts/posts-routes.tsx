import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import PostList from './post-list/post-list'
import PostViewPage from './post-view/post-view'
import PostNewPage from './post-new/post-new'
import '../../App.scss'
import './posts-routes.scss'
import UserListPage from '../user-list/user-list';

export interface PostsProps {
  address: string
  setTitle: (title: string) => void
  setShowFab: (showFab: boolean) => void
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
          render={props => <PostList {...props} setTitle={this.props.setTitle} setShowFab={this.props.setShowFab} address={this.props.address} />}
        />
        <Route
          exact
          path="/posts/new"
          render={props => <PostNewPage {...props} setTitle={this.props.setTitle} setShowFab={this.props.setShowFab} />}
        />
        <Route
          exact
          path="/posts/:id"
          render={props => <PostViewPage {...props} setTitle={this.props.setTitle} setShowFab={this.props.setShowFab} address={this.props.address} />}
        />
        <Route
          exact
          path="/posts/:id/reposts"
          render={props => <UserListPage {...props} setTitle={this.props.setTitle} setShowFab={this.props.setShowFab} title="Reposts" address={this.props.address} />}
        />
        <Route
          exact
          path="/posts/:id/likes"
          render={props => <UserListPage {...props} setTitle={this.props.setTitle} setShowFab={this.props.setShowFab} title="Likes" address={this.props.address} />}
        />
        <Redirect to="/posts" />
      </Switch>
    )
  }
}

export default PostsPage
