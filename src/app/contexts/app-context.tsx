import * as React from 'react'
import { JsWallet, JsChildWallet } from 'borker-rs-browser'

// app context
export interface AppContext {
  address: string
  wallet: JsWallet | null
  login: (wallet: JsWallet) => Promise<void>
  logout: () => Promise<void>
  encryptWallet: (wallet: JsWallet, pin: string) => Promise<void>
  decryptWallet: (pin: string) => Promise<JsWallet>
  getChild: (wallet: JsWallet) => JsChildWallet
}
export const AppContext = React.createContext({} as AppContext)

// app props
export interface AppProps extends AppContext { }

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