import React, { useState, useEffect } from 'react'
import { useAuthActions, useAppActions } from '../../globalState'
import * as Storage from 'idb-keyval'
import '../../App.scss'
import './settings.scss'

export interface BorkerConfig {
  externalip: string
}

export default function SettingsPage() {
  const [submitEnabled, setSubmitEnabled] = useState<boolean>(false)
  const [ip, setIp] = useState('')

  const { setShowFab, setTitle } = useAuthActions()
  const { logout } = useAppActions()

  useEffect(() => {
    let fetching = true
    setShowFab(false)
    setTitle('Settings')
    Storage.get<BorkerConfig>('borkerconfig').then(fetchedConfig => {
      if (fetching && fetchedConfig) {
        setIp(fetchedConfig.externalip)
      }
    })
    return () => {
      fetching = false
    }
  })

  const handleIpChange = (e: React.BaseSyntheticEvent) => {
    if (!submitEnabled) {
      setSubmitEnabled(true)
    }
    setIp(e.target.value)
  }

  const saveConfig = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    Storage.set('borkerconfig', { externalip: ip })
  }

  return (
    <div className="page-content">
      <form onSubmit={saveConfig} className="profile-edit-form">
        <label>Borker IP Address</label>
        <input type="text" value={ip} maxLength={40} onChange={handleIpChange} />
        {/* <input type="submit" value="Save" disabled={!submitEnabled} /> */}
      </form>
      <button onClick={saveConfig} disabled={!submitEnabled}>
        Submit
      </button>
      <br />
      <button onClick={logout}>Logout</button>
    </div>
  )
}
