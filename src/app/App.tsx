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
    const borkerip = await Storage.get('borkerip')
    if (!borkerip) {
      await Storage.set('borkerip', config.borkerip)
    }
    this.setState({
      address: await Storage.get<string>('address'),
      isLoading: false,
    })
  }

  login = async (wallet: JsWallet) => {
    const borkerLib = await import('borker-rs-browser')

    const child = wallet.childAt([-44, -3, -0, 0, 0])
    const address = child.address(borkerLib.Network.Dogecoin)

    await Storage.set('address', address)

    await this.encryptWallet(wallet, '')

    this.setState({
      address,
      wallet: child,
    })
  }

  logout = async () => {
    await Storage.clear()
    this.setState({ address: '', wallet: null })
  }

  encryptWallet = async (wallet: JsWallet, pin: string): Promise<void> => {
    const encrypted = CryptoJS.AES.encrypt(wallet.toBuffer(), pin).toString()
    await Storage.set('wallet', encrypted)
  }

  decryptWallet = async (pin: string): Promise<{ wallet: JsWallet, childWallet: JsChildWallet }> => {
    const borkerLib = await import('borker-rs-browser')
    const encrypted = await Storage.get<string>('wallet')
    let wallet: JsWallet
    try {
      wallet = borkerLib.JsWallet.fromBuffer(CryptoJS.AES.decrypt(encrypted, pin).toString(CryptoJS.enc.Utf8))
    } catch (e) {
      throw new Error('invalid pin')
    }
    const childWallet = wallet.childAt([-44, -3, -0, 0, 0])
    this.setState({
      wallet: childWallet,
    })
    return { wallet, childWallet }
  }

  toggleModal = (modalContent: JSX.Element | null) => {
    this.setState({ modalContent })
  }

  render () {
    const { isLoading, address, wallet, modalContent } = this.state
    const { login, logout, toggleModal, encryptWallet, decryptWallet } = this

    return isLoading ? (
      <p>loading...</p>
    ) : (
      <AppContext.Provider value={{ address, wallet, login, logout, toggleModal, encryptWallet, decryptWallet }}>
        {address ? <AuthRoutes /> : <UnauthRotes />}
        <Modal content={modalContent}/>
      </AppContext.Provider>
    )

  }
}

export default App
