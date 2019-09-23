import * as React from 'react'
import { withAppContext, AppContext } from './app-context'
import BigNumber from 'bignumber.js'
import { Parent } from '../pages/auth-routes'
import { BorkType } from '../../types/types'

// auth context
export interface AuthContext {
  signAndBroadcast: (
    type: BorkType,
    txCount?: number,
    content?: string,
    parent?: Parent,
    tip?: BigNumber,
  ) => Promise<void>
  setTitle: (title: string) => void
  setShowFab: (showFab: boolean) => void
  getBalance: () => Promise<void>
  toggleModal: (content: JSX.Element | null) => void
  balance: BigNumber
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