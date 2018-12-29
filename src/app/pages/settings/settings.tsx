import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import '../../App.scss'
import './settings.scss'

export interface SettingsProps extends AuthProps {}

class SettingsPage extends React.PureComponent<SettingsProps> {

  componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Settings')
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
