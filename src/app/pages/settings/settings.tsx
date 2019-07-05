import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import WebService from '../../web-service'
import * as Storage from 'idb-keyval'
import '../../App.scss'
import './settings.scss'


export interface SettingsProps extends AuthProps {}

export interface SettingsState {
  submitEnabled: boolean
  borkerip: string
}

class SettingsPage extends React.Component<SettingsProps, SettingsState> {
  public webService: WebService

  constructor (props: SettingsProps) {
    super(props)
    this.state = {
      submitEnabled: false,
      borkerip: '',
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Settings')

    const borkerip = await Storage.get<string>('borkerip')

    if (borkerip) { this.setState({ borkerip }) }
  }

  handleIpChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      submitEnabled: true,
      borkerip: e.target.value,
    })
  }

  saveConfig = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    this.setState({
      submitEnabled: false,
    })
    await Storage.set('bokerip', this.state.borkerip)
    if (!this.state.borkerip) { return }
    try {
      await this.props.getBalance()
      alert('Success! Happy Borking')
    } catch (err) {
      alert('invalid borker IP')
      await Storage.set('borkerip', { borkerip: '' })
    }
  }

  render () {
    const { submitEnabled, borkerip } = this.state

    return (
      <div className="page-content">
        <form onSubmit={this.saveConfig} className="profile-edit-form">
          <label>Borker IP Address</label>
          <input type="text" value={borkerip} maxLength={40} onChange={this.handleIpChange} />
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
