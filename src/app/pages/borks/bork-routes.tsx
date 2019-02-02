import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { BorkType } from '../../../types/types'
import FeedPage from './feed/feed'
import BorkViewPage from './bork-view/bork-view'
import BorkNewPage from './bork-new/bork-new'
import UserListPage from '../user-list/user-list'
import '../../App.scss'

class BorksRoutes extends React.Component<{}, {}> {

  render () {

    return (
      <Switch>
        <Route
          exact
          path="/borks/feed"
          component={FeedPage}
        />
        <Route
          exact
          path="/borks/new"
          component={BorkNewPage}
        />
        <Route
          exact
          path="/borks/:txid"
          component={BorkViewPage}
        />
        <Route
          exact
          path="/borks/:txid/comment"
          component={BorkNewPage} />}
        />
        <Route
          exact
          path="/borks/:ref/reborks"
          render={props => <UserListPage {...props} filter={BorkType.rebork} />}
        />
        <Route
          exact
          path="/borks/:ref/likes"
          render={props => <UserListPage {...props} filter={BorkType.like} />}
        />
        <Redirect to="/borks/feed" />
      </Switch>
    )
  }
}

export default BorksRoutes
