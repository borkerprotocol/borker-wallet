import React from 'react'
import '../../App.scss'
import './settings.scss'

export interface SettingsProps {
  logout: () => Promise<void>
  setTitle: (title: string) => void
  setShowFab: (showFab: boolean) => void
}

export interface SettingsState {}

class SettingsPage extends React.Component<SettingsProps, SettingsState> {

  constructor (props: SettingsProps) {
    super(props)
    this.state = {}
  }

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

export default SettingsPage
