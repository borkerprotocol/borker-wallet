import React from 'react'

export interface SettingsProps {}

export interface SettingsState {}

const styles = {
  content: {
    padding: "16px"
  }
}

class Settings extends React.Component<SettingsProps, SettingsState> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div style={styles.content}>
        <p>
          Settings Page
        </p>
      </div>
    )
  }
}

export default Settings
