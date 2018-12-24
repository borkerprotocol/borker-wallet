import React from 'react'
import * as Storage from 'idb-keyval'
import AuthRoutes from './pages/auth-routes'
import UnauthRotes from './pages/unauth-routes'
import './App.scss'

export interface AppState {
  isLoading: boolean
  address: string
}

class App extends React.Component<{}, AppState> {

  constructor (props: {}) {
    super(props)
    this.state = {
      isLoading: true,
      address: '',
    }
    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  async componentDidMount () {
    const address = await Storage.get<string>('address')
    this.setState({
      isLoading: false,
      address,
    })
  }

  async login (address: string): Promise<void> {
    this.setState({ address })
  }

  async logout (): Promise<void> {
    await Storage.clear()
    this.setState({ address: '' })
  }

  render () {
    const { address, isLoading } = this.state

    return isLoading ? (
      <div><p>loading</p></div>
    ) : address ? (
      <AuthRoutes
        address={address}
        logout={this.logout}
      />
    ) : (
      <UnauthRotes
        login={this.login}
      />
    )
  }
}

export default App
