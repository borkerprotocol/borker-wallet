import React from 'react'
import { AppProvider, AuthProvider } from './index'

function ProviderComposer({ contexts, children }) {
  return contexts.reduceRight(
    (kids, parent) =>
      React.cloneElement(parent, {
        children: kids,
      }),
    children,
  )
}

function GlobalProvider({ children }) {
  return (
    // <ProviderComposer contexts={[<CheckoutProvider />, <LoginProvider />, <AlertProvider />]}>
    <ProviderComposer contexts={[<AppProvider />, <AuthProvider />]}>{children}</ProviderComposer>
  )
}

export { GlobalProvider }
