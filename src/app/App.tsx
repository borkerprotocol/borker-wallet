import React from 'react'
import Modal from './components/modals/modal'
import Router from './pages/router'
import { GlobalProvider } from './globalState/store'

import './App.scss'

const App: React.FC<{}> = () => (
  <GlobalProvider>
    <Router />
    <Modal />
  </GlobalProvider>
)

export default App
