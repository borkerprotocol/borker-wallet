import React, { useState, useEffect } from 'react'
import * as Storage from 'idb-keyval'
import * as CryptoJS from 'crypto-js'
import { JsWallet, JsChildWallet } from 'borker-rs-browser'

const AppStateContext = React.createContext({} as AppState)
const AppActionsContext = React.createContext({} as AppActions)

type AppProviderProps = { children: React.ReactNode }

export interface AppState {
  address: string
  wallet: JsChildWallet | null
  modalContent: any
}

export interface AppActions {
  login: (wallet: JsWallet, password: string) => Promise<void>
  logout: () => Promise<void>
  decryptWallet: (password: string) => Promise<JsChildWallet>
  toggleModal: (content: JSX.Element | null) => void
}

function AppProvider({ children }: AppProviderProps) {
  const [, /* loading */ setLoading] = useState<boolean>(true) // TODO: Loading not being used currently
  const [address, setAddress] = useState<string>('')
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

  // TODO: we can get rid of this by passing setModalContent directly
  const toggleModal = (modalContent: JSX.Element | null) => {
    setModalContent(modalContent)
  }

  return (
    <AppStateContext.Provider value={{ address, wallet, modalContent }}>
      <AppActionsContext.Provider value={{ login, logout, toggleModal, decryptWallet }}>
        {children}
      </AppActionsContext.Provider>
    </AppStateContext.Provider>
  )
}

function useAppState(): AppState {
  const context = React.useContext(AppStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider')
  }
  return context
}

function useAppActions(): AppActions {
  const context = React.useContext(AppActionsContext)
  if (context === undefined) {
    throw new Error('useAppActions must be used within an AppProvider')
  }
  return context
}

export { AppProvider, useAppState, useAppActions }
