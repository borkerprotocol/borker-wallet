import React from 'react'
import { RouteComponentProps, Link } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { User, Bork, ProfileUpdate } from '../../../types/types'
import './profile.css'
import '../../App.css'
import 'react-tabs/style/react-tabs.css';
import { getUser, getBorks, getLikes, getProfileUpdates } from '../../util/mocks'
import BorkList from '../../components/bork-list/bork-list';

export interface ProfileParams {
  address: string
}

export interface ProfileProps extends RouteComponentProps<ProfileParams> {}

export interface ProfileState {
  user?: User
  borks: Bork[]
  likes: Bork[]
  profileUpdates: ProfileUpdate[]
}

class ProfilePage extends React.Component<ProfileProps, ProfileState> {

  constructor(props) {
    super(props)
    this.state = {
      borks: [],
      likes: [],
      profileUpdates: []
    }
  }

  async componentDidMount() {
    const address = this.props.match.params.address
    this.setState({
      user: await this._getUser(address),
      borks: await this._getBorks(address),
      likes: await this._getLikes(address),
      profileUpdates: await this._getProfileUpdates(address)
    })
  }

  async componentWillReceiveProps(nextProps: ProfileProps) {
    const address = nextProps.match.params.address
    if (address !== this.props.match.params.address) {
      this.setState({
        user: await this._getUser(address),
        borks: await this._getBorks(address),
        likes: await this._getLikes(address),
        profileUpdates: await this._getProfileUpdates(address)
      })
    }
  }

  async _getUser(address: string): Promise<User> {
    return getUser(address)
  }

  async _getBorks(address: string): Promise<Bork[]> {
    return getBorks(address)
  }

  async _getLikes(address: string): Promise<Bork[]> {
    return getLikes(address)
  }

  async _getProfileUpdates(address: string): Promise<ProfileUpdate[]> {
    return getProfileUpdates(address)
  }

  render() {
    const { user, borks, likes, profileUpdates } = this.state
    return (
      <div className="page-content">
        {!user &&
          <div>
            <p>User not found</p>
          </div>
        }
        {user &&
          <div>
            <div className="profile-header">
              <img src={`data:image/png;base64,${user.avatar}`} className="profile-avatar" alt="avatar" />
              <h4>
                {user.name}
                <br></br>
                <a href={`https://blockchain.com/btc/address/${user.address}`} target="_blank">@{user.address.substr(0,11)}</a>
                <br></br>
                <b>Birth Block: </b>{user.birthBlock}
              </h4>
            </div>
            <Tabs>
              <TabList>
                <Tab>Borks & Reborks</Tab>
                <Tab>Likes</Tab>
                <Tab>Profile Updates</Tab>
              </TabList>

              <TabPanel>
                {borks.length > 0 &&
                  <BorkList borks={borks.map(b => {
                    return {...b, user}
                  })} />
                }
                {!borks.length &&
                  <p>Your Borks and Reborks will appear here.</p>
                }
              </TabPanel>

              <TabPanel>
                {likes.length > 0 &&
                  <BorkList borks={likes.map(b => {
                    return {...b, user}
                  })} />
                }
                {!likes.length &&
                  <p>Borks you LIKE will appear here.</p>
                }
              </TabPanel>

              <TabPanel>
                <ul className="profile-update-list">
                  {profileUpdates.map(p => {
                    return (
                      <li key={p.txid}>
                        <p style={{color: 'gray'}}>{p.timestamp}</p>
                        <p>Updated {p.field} to {p.value}</p>
                      </li>
                    )
                  })}     
                </ul>
              </TabPanel>
            </Tabs>
          </div>
        }
      </div>
    )
  }
}

export default ProfilePage
