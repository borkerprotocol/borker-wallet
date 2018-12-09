import React from 'react'
import { BrowserRouter, Switch } from "react-router-dom"
import AuthRoute from '../components/auth-route/auth-route'
import UnauthRoute from '../components/unauth-route/unauth-route'
import { authenticatedRoutes, unauthenticatedRoutes } from '../util/route-list'

export interface RoutesProps {
  address: string
  login: (address: string) => Promise<void>
  logout: () => Promise<void>
}

class Routes extends React.Component<RoutesProps, {}> {
  render() {
    const { address, logout, login } = this.props
    return (
      <BrowserRouter>
        <Switch>
          {authenticatedRoutes.map(({ path, title, component }) => {
            return <AuthRoute
              key={path}
              exact
              path={path}
              title={title}
              component={component}
              address={address}
              logout={logout}
            />
          })}
          {unauthenticatedRoutes.map(({ path, component, allowAuthenticated }) => {
            return <UnauthRoute
              key={path}
              exact
              path={path}
              component={component}
              address={address}
              allowAuthenticated={allowAuthenticated}
              login={login}
            />
          })}
        </Switch>
      </BrowserRouter>
    )
  }
}

export default Routes
