import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { PostType } from '../../../types/types'
import PostList from './post-list/post-list'
import PostViewPage from './post-view/post-view'
import PostNewPage from './post-new/post-new'
import UserListPage from '../user-list/user-list'
import '../../App.scss'

class PostsPage extends React.Component<{}, {}> {

  render () {

    return (
      <Switch>
        <Route
          exact
          path="/posts"
          component={PostList}
        />
        <Route
          exact
          path="/posts/new"
          component={PostNewPage}
        />
        <Route
          exact
          path="/posts/:id"
          component={PostViewPage}
        />
        <Route
          exact
          path="/posts/:id/reposts"
          render={props => <UserListPage {...props} filter={PostType.repost} />}
        />
        <Route
          exact
          path="/posts/:id/likes"
          render={props => <UserListPage {...props} filter={PostType.like} />}
        />
        <Redirect to="/posts" />
      </Switch>
    )
  }
}

export default PostsPage
