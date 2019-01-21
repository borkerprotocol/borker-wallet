import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import { BorkType } from '../../../types/types'
import BorkList from './bork-list/bork-list'
import BorkViewPage from './bork-view/bork-view'
import BorkNewPage from './bork-new/bork-new'
import UserListPage from '../user-list/user-list'
import '../../App.scss'

class BorksPage extends React.Component<{}, {}> {

  render () {

    return (
      <Switch>
        <Route
          exact
          path="/borks"
          component={BorkList}
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
          path="/borks/:txid/reborks"
          render={props => <UserListPage {...props} filter={BorkType.rebork} />}
        />
        <Route
          exact
          path="/borks/:txid/likes"
          render={props => <UserListPage {...props} filter={BorkType.like} />}
        />
        <Redirect to="/borks" />
      </Switch>
    )
  }
}

export default BorksPage
