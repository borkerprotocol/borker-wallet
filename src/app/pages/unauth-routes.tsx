import React from 'react'
import { Switch, Redirect, Route } from "react-router-dom"
import HomePage from './home/home'
import WalletCreatePage from './wallet-create/wallet-create'
import WalletRestorePage from './wallet-restore/wallet-restore'

export interface UnauthRoutesProps {
  login: (address: string) => Promise<void>
}

class UnauthRoutes extends React.Component<UnauthRoutesProps, {}> {
  render() {
    const { login } = this.props

    return (
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route
          exact
          path="/create"
          render={props => <WalletCreatePage {...props} login={login} />}
        />
        <Route
          exact
          path="/restore"
          render={props => <WalletRestorePage {...props} login={login} />}
        />
        <Redirect to="/"/>
      </Switch>
    )
  }
}

export default UnauthRoutes
