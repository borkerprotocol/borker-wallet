import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'
import { User, PostType } from '../../../../types/types'
import BigNumber from 'bignumber.js'
import { getRates } from '../../../util/mocks'
import './profile-edit.scss'
import '../../../App.scss'

export interface ProfileEditProps extends AuthProps {
  user: User
}

export interface ProfileEditState {
  name: string
  bio: string
  txRate: BigNumber
  charRate: BigNumber
}

class ProfileEditPage extends React.Component<ProfileEditProps, ProfileEditState> {

  constructor (props: ProfileEditProps) {
    super(props)
    this.state = {
      name: props.user.name,
      bio: props.user.bio,
      txRate: new BigNumber(0),
      charRate: new BigNumber(0),
    }
  }

  async componentDidMount () {
    this.props.setTitle('Edit Profile')
    this.props.setShowFab(false)

    const { txRate, charRate } = await getRates()
    this.setState({
      txRate,
      charRate,
    })
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
    const { name, bio, txRate, charRate } = this.state

    const nameTxCount = this.props.user.name === name ? 0 : 1
    const nameCharCount = this.props.user.name === name ? 0 : name.length

    const bioTxCount = this.props.user.bio === bio ? 0 : 1
    const bioCharCount = this.props.user.bio === bio ? 0 : bio.length

    const txCount = nameTxCount + bioTxCount
    const charCount = nameCharCount + bioCharCount
    const cost = txRate.times(txCount).plus(charRate.times(charCount))

    const modal = (
      <CheckoutModal type={PostType.profileUpdate} txCount={txCount} charCount={charCount} cost={cost} />
    )

    return (
      <div className="page-content">
        <p>Cost Per Transaction: {txRate.toFormat(8)} DOGE</p>
        <p>Cost Per Added Character: {charRate.toFormat(8)} DOGE</p>

        <form onSubmit={(e) => { e.preventDefault(); this.props.toggleModal(modal) }} className="profile-edit-form">
          <label>Name</label>
          <input type="text" value={name} onChange={this.handleNameChange} />
          <label>Bio</label>
          <textarea value={bio} onChange={this.handleBioChange} />
          <input type="submit" value="Checkout" disabled={!txCount} />
        </form>

        <p>Transaction Count: {txCount}</p>
        <p>Character Count: {charCount}</p>
        <b>Total Cost: {cost.toFormat(8)} DOGE</b>
      </div>
    )
  }
}

export default withAuthContext(ProfileEditPage)
