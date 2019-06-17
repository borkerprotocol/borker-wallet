import React from 'react'
import { Switch, Redirect, Route } from 'react-router-dom'
import HomePage from './home/home'
import WalletCreatePage from './wallet-create/wallet-create'
import WalletRestorePage from './wallet-restore/wallet-restore'

export default function UnauthRoutes() {
  return (
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/create" component={WalletCreatePage} />
      <Route exact path="/restore" component={WalletRestorePage} />
      <Redirect to="/" />
    </Switch>
  )
}
