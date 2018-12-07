import React from 'react'
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom"
import PostsPage from './posts/posts'
import ProfilePage from './profile/profile'
import WalletPage from './wallet/wallet'
import WalletCreatePage from './wallet-create/wallet-create'
import WalletRestorePage from './wallet-restore/wallet-restore'
import SettingsPage from './settings/settings'
import AuthRoute from '../components/auth-route/auth-route'
import UnauthRoute from '../components/unauth-route/unauth-route'
import HomePage from './home/home'

export interface RoutesProps {
  address: string
  login: (address: string) => Promise<void>
  logout: () => Promise<void>
}

export const authenticatedRoutes = [
  {
    path: "/posts",
    component: PostsPage
  },
  {
    path: "/wallet",
    component: WalletPage
  },
  {
    path: "/settings",
    component: SettingsPage
  },
  {
    path: "/profile/:address",
    component: ProfilePage
  },
]

export const unauthenticatedRoutes = [
  {
    path: "/",
    component: HomePage,
    allowAuthenticated: false
  },
  {
    path: "/create",
    component: WalletCreatePage,
    allowAuthenticated: false
  },
  {
    path: "/restore",
    component: WalletRestorePage,
    allowAuthenticated: false
  }
]

class Routes extends React.Component<RoutesProps, {}> {
  render() {
    const { address, logout, login } = this.props
    return (
      <Router>
        <Switch>
          {authenticatedRoutes.map(({ path, component }) => {
            return <AuthRoute
              key={path}
              exact
              path={path}
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
      </Router>
    )
  }
}

export default Routes
