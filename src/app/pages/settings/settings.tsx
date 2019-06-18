import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import WebService from '../../web-service'
import * as Storage from 'idb-keyval'
import '../../App.scss'
import './settings.scss'

export interface BorkerConfig {
  externalip: string
}

export interface SettingsProps extends AuthProps {}

export interface SettingsState {
  submitEnabled: boolean
  config: BorkerConfig
}

class SettingsPage extends React.Component<SettingsProps, SettingsState> {
  public webService: WebService

  constructor (props: SettingsProps) {
    super(props)
    this.state = {
      submitEnabled: false,
      config: {
        externalip: '',
      },
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Settings')

    const config = await Storage.get<BorkerConfig>('borkerconfig')

    if (config) { this.setState({ config }) }
  }

  handleIpChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      submitEnabled: true,
      config: {
        ...this.state.config,
        externalip: e.target.value,
      },
    })
  }

  saveConfig = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    this.setState({
      submitEnabled: false,
    })
    await Storage.set('borkerconfig', this.state.config)
    if (!this.state.config.externalip) { return }
    try {
      await this.props.getBalance()
      alert('Success! Happy Borking')
    } catch (err) {
      alert('invalid borker IP')
      await Storage.set('borkerconfig', { ...this.state.config, externalip: '' })
    }
  }

  render () {
    const { submitEnabled, config } = this.state

    return (
      <div className="page-content">
        <form onSubmit={this.saveConfig} className="profile-edit-form">
          <label>Borker IP Address</label>
          <input type="text" value={config.externalip} maxLength={40} onChange={this.handleIpChange} />
          <input type="submit" value="Save" disabled={!submitEnabled} />
        </form>
        <br />
        <br />
        <button onClick={this.props.logout}>Logout</button>
      </div>
    )
  }
}

export default withAuthContext(SettingsPage)
