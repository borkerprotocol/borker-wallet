import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { User, BorkType } from '../../../../types/types'
import { RouteComponentProps } from 'react-router'
import './profile-edit.scss'
import '../../../App.scss'
import { JsWallet } from 'borker-rs-browser'
import PinModal from '../../../components/modals/pin-modal/pin-modal'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'

export interface ProfileEditParams {
  type: BorkType.SetName | BorkType.SetBio | BorkType.SetAvatar
}

export interface ProfileEditProps extends AuthProps, RouteComponentProps<ProfileEditParams> {
  user: User
}

export interface ProfileEditState {
  previousValue: string
  value: string
}

class ProfileEditPage extends React.Component<ProfileEditProps, ProfileEditState> {

  constructor (props: ProfileEditProps) {
    super(props)

    this.state = {
      previousValue: props.match.params.type === BorkType.SetName ? props.user.name :
        props.match.params.type === BorkType.SetBio ? props.user.bio :
        props.match.params.type === BorkType.SetAvatar ? props.user.avatarLink : '',
      value: '',
    }
  }

  async componentDidMount () {
    this.props.setTitle(`Edit ${this.props.match.params.type.split('_')[1].replace(/^\w/, c => c.toUpperCase())}`)
    this.props.setShowFab(false)
    this.setState({
      value: this.state.previousValue || '',
    })
  }

  handleValueChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      value: e.target.value,
    })
  }

  broadcast = async (e: React.BaseSyntheticEvent) => {
    if (e) {
      e.preventDefault()
    }

    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.props.toggleModal(<PinModal callback={this.broadcast} />)
        return
      }
    }

    const modal = (
      <CheckoutModal
        type={this.props.match.params.type}
        content={this.state.value}
      />
    )
    this.props.toggleModal(modal)
  }

  render () {
    const { previousValue, value } = this.state

    return (
      <div className="page-content">
        <form onSubmit={this.broadcast} className="profile-edit-form">
          <label>Value</label>
          <input type="text" value={value} maxLength={77} onChange={this.handleValueChange} />
          <input type="submit" className="small-button" value="Broadcast!" disabled={previousValue === value} />
        </form>
      </div>
    )
  }
}

export default withAuthContext(ProfileEditPage)
