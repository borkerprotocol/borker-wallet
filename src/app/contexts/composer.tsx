import * as React from 'react'
import { Omit } from '../../types/types'

export function addContext<T> (Context: React.Context<T>) {
  return function withContext<P extends T> (Component: React.ComponentType<P>) {
    class ContextHOC extends React.PureComponent<
      Omit<P, keyof T>,
      T
    > {
      render () {
        return (
          <Context.Consumer>
            {newProps => <Component {...this.props as any} {...newProps} />}
          </Context.Consumer>
        )
      }
    }
  
    return ContextHOC
  }
}
