import * as React from 'react'
import { Omit } from '../../types/types'

// app context
export interface AppContext {
  address: string
  login: (address: string) => Promise<void>
  logout: () => Promise<void>
  toggleModal: (content: JSX.Element | null) => void
}
export const AppContext = React.createContext({} as AppContext)

// app props
export interface AppProps extends AppContext {}

// app HOC
export function withAppContext<P extends AppProps> (Component: React.ComponentType<P>) {
  class AppHOC extends React.PureComponent<
    Omit<P, keyof AppProps>,
    AppProps
  > {
    render () {
      return (
        <AppContext.Consumer>
          {newProps => <Component {...this.props as any} {...newProps} />}
        </AppContext.Consumer>
      )
    }
  }

  return AppHOC
}