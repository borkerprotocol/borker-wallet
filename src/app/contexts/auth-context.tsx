import * as React from 'react'
import { Omit } from '../../types/types'
import { withAppContext, AppContext } from './app-context'

// auth context
export interface AuthContext {
  setTitle: (title: string) => void
  setShowFab: (showFab: boolean) => void
}
export const AuthContext = React.createContext({} as AuthContext)

// auth props
export type AuthProps = AuthContext & AppContext

// auth HOC
export function withAuthContext<P extends AuthProps> (Component: React.ComponentType<P>) {
  const AppComp = withAppContext(Component)
  return class AuthHOC extends React.PureComponent<
    Omit<P, keyof AuthProps>,
    AuthProps
  > {
    render () {
      return (
        <AuthContext.Consumer>
          {newProps => <AppComp {...this.props as any} {...newProps} />}
        </AuthContext.Consumer>
      )
    }
  }
}