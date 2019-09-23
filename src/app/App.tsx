import React from 'react'
import * as Storage from 'idb-keyval'
import AuthRoutes from './pages/auth-routes'
import UnauthRotes from './pages/unauth-routes'
import { AppContext } from './contexts/app-context'
import './App.scss'
import { JsWallet, JsChildWallet } from 'borker-rs-browser'
import * as CryptoJS from 'crypto-js'
import * as config from '../borkerconfig.json'

export interface AppState {
  isLoading: boolean
  address: string
  wallet: JsWallet | null
}

class App extends React.Component<{}, AppState> {

  state = {
    isLoading: true,
    address: '',
    wallet: null,
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

  login = async (wallet: JsWallet, pin = '') => {
    const borkerLib = await import('borker-rs-browser')

    const child = this.getChild(wallet)
    const address = child.address(borkerLib.Network.Dogecoin)

    await Storage.set('address', address)

    await this.encryptWallet(wallet, pin)

    this.setState({
      address,
      wallet,
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

  decryptWallet = async (pin: string): Promise<JsWallet> => {
    const borkerLib = await import('borker-rs-browser')
    const encrypted = await Storage.get<string>('wallet')
    try {
      const wallet = borkerLib.JsWallet.fromBuffer(CryptoJS.AES.decrypt(encrypted, pin).toString(CryptoJS.enc.Utf8))
      return wallet
    } catch (e) {
      throw new Error('invalid pin')
    }
  }

  getChild = (wallet: JsWallet): JsChildWallet => {
    return wallet.childAt([-44, -3, -0, 0, 0])
  }

  render () {
    const { isLoading, address, wallet } = this.state
    const { login, logout, encryptWallet, decryptWallet, getChild } = this

    return isLoading ? (
      <p>loading...</p>
    ) : (
      <AppContext.Provider value={{ address, wallet, login, logout, encryptWallet, decryptWallet, getChild }}>
        {address ? <AuthRoutes /> : <UnauthRotes />}
      </AppContext.Provider>
    )

  }
}

export default App
