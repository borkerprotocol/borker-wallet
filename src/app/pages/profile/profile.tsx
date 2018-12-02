import React from 'react'
import { RouteComponentProps } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { User, Bork, ProfileUpdate } from '../../../types/types'
import './profile.css'
import '../../App.css'
import 'react-tabs/style/react-tabs.css';
import { getUser, getBorks, getProfileUpdates } from '../../util/mocks'

export interface ProfileParams {
  address: string
}

export interface ProfileProps extends RouteComponentProps<ProfileParams> {}

export interface ProfileState {
  user?: User
  borks: Bork[]
  profileUpdates: ProfileUpdate[]
}

class ProfilePage extends React.Component<ProfileProps, ProfileState> {

  constructor(props) {
    super(props)
    this.state = {
      borks: [],
      profileUpdates: []
    }
  }

  async componentDidMount() {
    this.setState({
      user: await this._getUser(),
      borks: await this._getBorks(),
      profileUpdates: await this._getProfileUpdates()
    })
  }

  async _getUser(): Promise<User> {
    return getUser(this.props.match.params.address)
  }

  async _getBorks(): Promise<Bork[]> {
    return getBorks(this.props.match.params.address)
  }

  async _getProfileUpdates(): Promise<ProfileUpdate[]> {
    return getProfileUpdates(this.props.match.params.address)
  }

  render() {
    const { user, borks, profileUpdates } = this.state
    if (!user) {
      return <p>Loading ...</p>
    }
    return (
      <div className="page-content">
        <div className="profile-header">
          <img src={`data:image/png;base64,${user.avatar}`} className="avatar" alt="avatar" />
          <h4>
            {user.name}
          </h4>
        </div>
        <p>
          <b>Address: </b><a href={`https://blockchain.com/btc/address/${user.address}`} target="_blank">@{user.address.substr(0,11)}</a>
          <br></br>
          <b>Birth Block: </b>{user.birthBlock}
        </p>
        <Tabs>
          <TabList>
            <Tab>Borks</Tab>
            <Tab>Profile Updates</Tab>
          </TabList>

          <TabPanel>
            <ul>
              {borks.map(b => {
                return (
                  <li key={b.txid}>
                    <p>{b.timestamp}</p>
                    <p>{b.content}</p>
                  </li>
                )
              })}     
            </ul>
          </TabPanel>

          <TabPanel>
            <ul>
              {profileUpdates.map(p => {
                return (
                  <li key={p.txid}>
                    <p>{p.timestamp}</p>
                    <p><b>Updated Field: </b>{p.field}</p>
                    <p><b>New Value: </b>{p.value}</p>
                  </li>
                )
              })}     
            </ul>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default ProfilePage
