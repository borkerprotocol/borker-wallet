import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import '../../App.scss'
import './settings.scss'
import { getNetworkInfo } from '../../web-service'

export interface SettingsProps extends AuthProps {}

export interface SettingsState {
  networkStats: any
}

class SettingsPage extends React.PureComponent<SettingsProps> {

  async componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Settings')

    // const res = await getNetworkInfo()
    // console.log(res)
  }

  render () {
    return (
      <div className="page-content">
        <button onClick={this.props.logout}>Logout</button>
      </div>
    )
  }
}

export default withAuthContext(SettingsPage)
