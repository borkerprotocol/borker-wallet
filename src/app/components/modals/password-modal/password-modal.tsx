import React from 'react'
import '../../../App.scss'
import './password-modal.scss'

export interface PasswordModalProps {
  usePasswordFn: (password: string) => void
}

export interface PasswordModalState {
  password: string
}

class PasswordModal extends React.Component<PasswordModalProps, PasswordModalState> {

  constructor (props: PasswordModalProps) {
    super(props)
    this.state = {
      password: '',
    }
  }

  handlePasswordChange = (e: React.BaseSyntheticEvent) => {
    this.setState({ password: e.target.value })
  }

  submitPassword = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    this.props.usePasswordFn(this.state.password)
  }

  render () {
    const { password } = this.state

    return (
      <form onSubmit={this.submitPassword} className="password-form">
        <p>Please enter your password. Hit "Done" if you do not have a password.</p>
        <input type="password" placeholder="Password or Pin" value={password} onChange={this.handlePasswordChange} />
        <input type="submit" className="small-button" value="Done" />
      </form>
    )
  }
}

export default PasswordModal
