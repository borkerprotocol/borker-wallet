import React, { useState, useEffect } from 'react'
// TODO: change these imports tos reference an index file
import BigNumber from 'bignumber.js'
import WebService from '../web-service'

export interface AuthState {
  title: string
  balance: BigNumber
  showFab: boolean
  sidebarOpen: boolean
  sidebarDocked: boolean
}

export interface AuthActions {
  toggleSidebar: (e: any) => void
  getBalance: () => void
  setSidebarOpen: (b: boolean) => void
  setTitle: (t: string) => void
  setShowFab: (b: boolean) => void
}

const mql = window.matchMedia(`(min-width: 800px)`)

const AuthStateContext = React.createContext({} as AuthState)
const AuthActionsContext = React.createContext({} as AuthActions)

type AuthProviderProps = { children: React.ReactNode }

function AuthProvider({ children }: AuthProviderProps) {
  const webService = new WebService()

  const [title, setTitle] = useState('')
  const [balance, setBalance] = useState(new BigNumber(0))
  const [showFab, setShowFab] = useState(false)
  const [sidebarDocked, setSidebarDocked] = useState(mql.matches)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    mql.addListener(mediaQueryChanged)
    return () => mql.removeListener(mediaQueryChanged)
  }, [])

  const mediaQueryChanged = () => {
    setSidebarDocked(mql.matches)
    setSidebarOpen(false)
  }

  const toggleSidebar = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    setSidebarOpen(!sidebarOpen)
  }

  const getBalance = async () => {
    setBalance(await webService.getBalance())
  }
  return (
    <AuthStateContext.Provider value={{ sidebarDocked, sidebarOpen, showFab, title, balance }}>
      <AuthActionsContext.Provider
        value={{ toggleSidebar, getBalance, setSidebarOpen, setTitle, setShowFab }}
      >
        {children}
      </AuthActionsContext.Provider>
    </AuthStateContext.Provider>
  )
}

function useAuthState(): AuthState {
  const context = React.useContext(AuthStateContext)
  if (context === undefined) {
    throw new Error('useAppState must be used within an AppProvider')
  }
  return context
}

function useAuthActions(): AuthActions {
  const context = React.useContext(AuthActionsContext)
  if (context === undefined) {
    throw new Error('useAppActions must be used within an AppProvider')
  }
  return context
}

export { AuthProvider, useAuthState, useAuthActions }
