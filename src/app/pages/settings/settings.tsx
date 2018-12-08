import React from 'react'
import '../../App.scss'

export interface SettingsProps {
  logout: () => void
}

export interface SettingsState {}

class SettingsPage extends React.Component<SettingsProps, SettingsState> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="page-content">
        <button onClick={this.props.logout}>Logout</button>
      </div>
    )
  }
}

export default SettingsPage
