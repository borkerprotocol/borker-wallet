import React from 'react'
import { Switch, Redirect, Route } from "react-router-dom"
import HomePage from './home/home'
import WalletCreatePage from './wallet-create/wallet-create'
import WalletRestorePage from './wallet-restore/wallet-restore'
import { UnauthContext } from '../contexts/unauth-context'

class UnauthRoutes extends React.Component<{}, {}> {

  render () {
    return (
      <UnauthContext.Provider value={{}}>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route
            exact
            path="/create"
            component={WalletCreatePage}
          />
          <Route
            exact
            path="/restore"
            component={WalletRestorePage}
          />
          <Redirect to="/"/>
        </Switch>
      </UnauthContext.Provider>
    )
  }
}

export default UnauthRoutes
