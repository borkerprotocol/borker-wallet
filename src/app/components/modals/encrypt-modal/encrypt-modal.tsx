import React, { useState } from 'react'
import { JsWallet } from 'borker-rs-browser'
import { withAppContext, AppProps } from '../../../contexts/app-context'
import '../../../App.scss'
import './encrypt-modal.scss'
import { useAppActions } from '../../../globalState'

export interface EncryptModalProps {
  newWallet: JsWallet
}

export interface EncryptModalState {
  password: string
}

function EncryptModal(props: EncryptModalProps) {
  const [password, setPassword] = useState<string>('')
  const { login } = useAppActions()

  const saveWallet = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    login(props.newWallet, password)
  }

  const handlePasswordChange = (e: React.BaseSyntheticEvent) => {
    setPassword(e.target.value)
  }

  return (
    <form onSubmit={saveWallet} className="password-form">
      <p>Encrypt wallet on device. (recommended)</p>
      <input
        type="password"
        placeholder="Password or Pin"
        value={password}
        onChange={handlePasswordChange}
      />
      <input type="submit" value="Encrypt Wallet" />
    </form>
  )
}

export default EncryptModal
