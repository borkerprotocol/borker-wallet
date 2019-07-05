import React from 'react'
import * as Storage from 'idb-keyval'
import AuthRoutes from './pages/auth-routes'
import UnauthRotes from './pages/unauth-routes'
import Modal from './components/modals/modal'
import { AppContext } from './contexts/app-context'
import './App.scss'
import { JsWallet, JsChildWallet } from 'borker-rs-browser'
import * as CryptoJS from 'crypto-js'
import * as config from '../borkerconfig.json'

export interface AppState {
  isLoading: boolean
  address: string
  wallet: JsChildWallet | null
  modalContent: JSX.Element | null
}

class App extends React.Component<{}, AppState> {

  state = {
    isLoading: true,
    address: '',
    wallet: null,
    modalContent: null,
  }

  async componentDidMount () {
    await Storage.set('borkerip', config.borkerip)
    this.setState({
      address: await Storage.get<string>('address'),
      isLoading: false,
    })
  }

  login = async (wallet: JsWallet, password: string) => {
    const borkerLib = await import('borker-rs-browser')

    const child = wallet.childAt([-44, -3, -0, 0, 0])
    const address = child.address(borkerLib.Network.Dogecoin)
    const encrypted = CryptoJS.AES.encrypt(wallet.toBuffer(), password).toString()

    await Promise.all([
      Storage.set('wallet', encrypted),
      Storage.set('address', address),
    ])

    this.setState({
      address,
      wallet: child,
      modalContent: null,
    })
  }

  logout = async () => {
    await Storage.clear()
    this.setState({ address: '', wallet: null })
  }

  decryptWallet = async (password: string): Promise<JsChildWallet> => {
    const borkerLib = await import('borker-rs-browser')
    const encrypted = await Storage.get<string>('wallet')
    const wallet = borkerLib.JsWallet.fromBuffer(CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8))
    const child = wallet.childAt([-44, -3, -0, 0, 0])
    this.setState({
      wallet: child,
    })
    return child
  }

  toggleModal = (modalContent: JSX.Element | null) => {
    this.setState({ modalContent })
  }

  render () {
    const { isLoading, address, wallet, modalContent } = this.state
    const { login, logout, toggleModal, decryptWallet } = this

    return isLoading ? (
      <p>loading...</p>
    ) : (
      <AppContext.Provider value={{ address, wallet, login, logout, toggleModal, decryptWallet }}>
        {address ? <AuthRoutes /> : <UnauthRotes />}
        <Modal content={modalContent}/>
      </AppContext.Provider>
    )

  }
}

export default App
