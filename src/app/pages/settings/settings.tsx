import React from 'react'
import '../../App.css'

export interface SettingsProps {}

export interface SettingsState {}

class SettingsPage extends React.Component<SettingsProps, SettingsState> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="page-content">
        <p>
          Settings Page
        </p>
      </div>
    )
  }
}

export default SettingsPage
