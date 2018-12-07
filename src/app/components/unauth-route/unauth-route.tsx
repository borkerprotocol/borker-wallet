import React from 'react'
import { Route, RouteProps, Redirect } from "react-router-dom"

export interface UnauthRouteProps extends RouteProps {
  address: string
  allowAuthenticated: boolean
  component: React.ComponentType<any>
  login: (address: string) => void
}

class UnauthRoute extends React.Component<UnauthRouteProps, {}> {

  render() {
    const { component: Component, address, allowAuthenticated, ...rest } = this.props

    return address && !allowAuthenticated ? (
      <Redirect to="/posts" />
    ) : (
      <Route {...rest} render={props => <Component {...props} {...rest} />} />
    )
  }
}

export default UnauthRoute
