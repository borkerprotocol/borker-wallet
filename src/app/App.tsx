import React from 'react'
import * as Storage from 'idb-keyval'
import AuthRoutes from './pages/auth-routes'
import UnauthRotes from './pages/unauth-routes'
import Modal from './components/modals/modal'
import { AppContext } from './contexts/app-context'
import './App.scss'

export interface AppState {
  isLoading: boolean
  address: string
  modalContent: JSX.Element | null
}

class App extends React.Component<{}, AppState> {

  state = {
    isLoading: true,
    address: '',
    modalContent: null,
  }

  async componentDidMount () {
    this.setState({
      address: await Storage.get<string>('address'),
      isLoading: false,
    })
  }

  login = async (address: string) => {
    this.setState({ address, modalContent: null })
  }

  logout = async () => {
    await Storage.clear()
    this.setState({ address: '' })
  }

  toggleModal = (modalContent: JSX.Element | null) => {
    this.setState({ modalContent })
  }

  render () {
    const { isLoading, address, modalContent } = this.state
    const { login, logout, toggleModal } = this

    return isLoading ? (
      <p>loading...</p>
    ) : (
      <AppContext.Provider value={{ address, login, logout, toggleModal }}>
        {address ? <AuthRoutes /> : <UnauthRotes />}
        <Modal content={modalContent}/>
      </AppContext.Provider>
    )

  }
}

export default App
