import React, { useState, useEffect } from 'react'
import * as Storage from 'idb-keyval'
import AuthRoutes from './pages/auth-routes'
import UnauthRotes from './pages/unauth-routes'
import Modal from './components/modals/modal'
import { AppContext } from './contexts/app-context'
import './App.scss'
import { JsWallet, JsChildWallet } from 'borker-rs-browser'
import * as CryptoJS from 'crypto-js'

export interface AppState {
  isLoading: boolean
  address: string
  wallet: JsChildWallet | null
  modalContent: JSX.Element | null
}

const App: React.FC<{}> = () => {
  const [loading, setLoading] = useState(true)
  const [address, setAddress] = useState('')
  const [wallet, setWallet] = useState<JsChildWallet | null>(null)
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null)

  useEffect(() => {
    Storage.get<string>('address').then(address => {
      setAddress(address)
      setLoading(false)
    })
  }, [])

  const login = async (wallet: JsWallet, password: string) => {
    const borkerLib = await import('borker-rs-browser')

    const child = wallet.childAt([-44, -3, -0, 0, 0])
    const address = child.address(borkerLib.Network.Dogecoin)
    const encrypted = CryptoJS.AES.encrypt(wallet.toBuffer(), password).toString()

    await Promise.all([Storage.set('wallet', encrypted), Storage.set('address', address)])

    setAddress(address)
    setWallet(child)
    setModalContent(null)
  }

  const logout = async () => {
    await Storage.clear()
    setAddress('')
    setWallet(null)
  }

  const decryptWallet = async (password: string): Promise<JsChildWallet> => {
    const borkerLib = await import('borker-rs-browser')
    const encrypted = await Storage.get<string>('wallet')
    const wallet = borkerLib.JsWallet.fromBuffer(
      CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8),
    )
    const child = wallet.childAt([-44, -3, -0, 0, 0])
    setWallet(child)
    return child
  }

  const toggleModal = (modalContent: JSX.Element | null) => {
    setModalContent(modalContent)
  }

  return loading ? (
    <p>Loading...</p>
  ) : (
    <AppContext.Provider value={{ address, wallet, login, logout, toggleModal, decryptWallet }}>
      {address ? <AuthRoutes /> : <UnauthRotes />}
      <Modal content={modalContent} />
    </AppContext.Provider>
  )
}

export default App
