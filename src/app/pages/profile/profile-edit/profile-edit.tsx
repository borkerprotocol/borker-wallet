import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'
import { User, BorkType } from '../../../../types/types'
import './profile-edit.scss'
import '../../../App.scss'

export interface ProfileEditProps extends AuthProps {
  user: User
}

export interface ProfileEditState {
  name: string
  bio: string
}

class ProfileEditPage extends React.Component<ProfileEditProps, ProfileEditState> {

  constructor (props: ProfileEditProps) {
    super(props)
    this.state = {
      name: props.user.name,
      bio: props.user.bio,
    }
  }

  async componentDidMount () {
    this.props.setTitle('Edit Profile')
    this.props.setShowFab(false)
  }

  handleNameChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      name: e.target.value,
    })
  }

  handleBioChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      bio: e.target.value,
    })
  }

  broadcast = () => {
    alert ('broadcasts coming soon!')
  }

  render () {
    const { name, bio } = this.state

    const nameTxCount = this.props.user.name === name ? 0 : 1
    const bioTxCount = this.props.user.bio === bio ? 0 : 1

    const txCount = nameTxCount + bioTxCount

    const modal = (
      <CheckoutModal type={BorkType.profileUpdate} txCount={txCount} />
    )

    return (
      <div className="page-content">
        <form onSubmit={(e) => { e.preventDefault(); this.props.toggleModal(modal) }} className="profile-edit-form">
          <label>Name</label>
          <input type="text" value={name} maxLength={77} onChange={this.handleNameChange} />
          <label>Bio</label>
          <input type="text" value={bio} maxLength={77} onChange={this.handleBioChange} />
          <input type="submit" value="Checkout" disabled={!txCount} />
        </form>
      </div>
    )
  }
}

export default withAuthContext(ProfileEditPage)
