import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import * as Storage from 'idb-keyval'
import '../../App.scss'
import './settings.scss'

export interface BorkerConfig {
  externalip: string
}

export interface SettingsProps extends AuthProps {}

export interface SettingsState {
  config: BorkerConfig
}

class SettingsPage extends React.Component<SettingsProps, SettingsState> {

  state = {
    config: {
      externalip: '',
    },
  }

  async componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Settings')

    const config = await Storage.get<BorkerConfig>('borkerconfig')

    if (config) { this.setState({ config }) }
  }

  handleIpChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      config: {
        ...this.state.config,
        externalip: e.target.value,
      },
    })
  }

  saveConfig = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    Storage.set('borkerconfig', this.state.config)
  }

  render () {
    const { config } = this.state

    return (
      <div className="page-content">
        <form onSubmit={this.saveConfig} className="profile-edit-form">
          <label>Borker IP Address</label>
          <input type="text" value={config.externalip} maxLength={40} onChange={this.handleIpChange} />
          <input type="submit" value="Save" disabled={!config.externalip} />
        </form>
        <button onClick={this.props.logout}>Logout</button>
      </div>
    )
  }
}

export default withAuthContext(SettingsPage)
