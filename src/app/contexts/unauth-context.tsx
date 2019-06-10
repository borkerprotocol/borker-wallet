import * as React from 'react'
import { withAppContext, AppContext } from './app-context'

// unauth context
export interface UnauthContext { }
export const UnauthContext = React.createContext({} as UnauthContext)

// unauth props
export type UnauthProps = UnauthContext & AppContext

// unauth HOC
export function withUnauthContext<P extends UnauthProps>(Component: React.ComponentType<P>) {
  const AppComp = withAppContext(Component)
  return class UnauthHOC extends React.PureComponent<
    Omit<P, keyof UnauthProps>,
    UnauthProps
    > {
    render() {
      return (
        <UnauthContext.Consumer>
          {newProps => <AppComp {...this.props as any} {...newProps} />}
        </UnauthContext.Consumer>
      )
    }
  }
}