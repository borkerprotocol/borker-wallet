import React from 'react'
import { RouteComponentProps } from "react-router-dom"
import { User } from '../../../types/types'
import './profile.css'
import '../../App.css'
import { getUser } from '../../util/mocks'

export interface ProfileParams {
  address: string
}

export interface ProfileProps extends RouteComponentProps<ProfileParams> {}

export interface ProfileState {
  user?: User
}

class ProfilePage extends React.Component<ProfileProps, ProfileState> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    this.setState({ user: await this._getUser() })
  }

  async _getUser(): Promise<User> {
    console.log(this.props.match.params.address)
    return getUser(this.props.match.params.address)
  }

  async viewOnChain(txid) {

  }

  render() {
    const { user } = this.state
    if (!user) {
      return <p>Loading ...</p>
    }
    return (
      <div className="page-content">
        <div className="profile-header">
          <img src={`data:image/png;base64,${user.avatar}`} className="avatar" alt="avatar" />
          <h4><a href={`https://blockchain.com/btc/address/${user.address}`} target="_blank">{user.address}</a></h4>
          <h4>" {user.name} "</h4>
        </div>
        <ul className="profile-info">
          <li><b>Birth Block:</b> {user.birthBlock}</li>
          <li>
            <b>Profile Updates:</b>
            <ul>
            {user.profileTxids.map(txid => {
              return (
                <li key={txid}>
                  <a href={`https://blockchain.com/btc/tx/${txid}`} target="_blank">{txid.substr(0, 30)}...</a>
                </li>
              )
              })}     
            </ul>
          </li>
        </ul>
      </div>
    )
  }
}

export default ProfilePage
