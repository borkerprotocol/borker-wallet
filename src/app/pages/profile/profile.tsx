import React from 'react'
import { RouteComponentProps, Link } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { User, Post, ProfileUpdate } from '../../../types/types'
import './profile.scss'
import '../../App.scss'
import 'react-tabs/style/react-tabs.scss'
import { getUser, getPosts, getLikes, getProfileUpdates } from '../../util/mocks'
import PostList from '../../components/post-list/post-list'

export interface ProfileParams {
  address: string
}

export interface ProfileProps extends RouteComponentProps<ProfileParams> {}

export interface ProfileState {
  user?: User
  posts: Post[]
  likes: Post[]
  profileUpdates: ProfileUpdate[]
}

class ProfilePage extends React.Component<ProfileProps, ProfileState> {

  constructor(props) {
    super(props)
    this.state = {
      posts: [],
      likes: [],
      profileUpdates: []
    }
  }

  async componentDidMount() {
    const address = this.props.match.params.address
    this.setState({
      user: await this._getUser(address),
      posts: await this._getPosts(address),
      likes: await this._getLikes(address),
      profileUpdates: await this._getProfileUpdates(address)
    })
  }

  async componentWillReceiveProps(nextProps: ProfileProps) {
    const address = nextProps.match.params.address
    if (address !== this.props.match.params.address) {
      this.setState({
        user: await this._getUser(address),
        posts: await this._getPosts(address),
        likes: await this._getLikes(address),
        profileUpdates: await this._getProfileUpdates(address)
      })
    }
  }

  async _getUser(address: string): Promise<User> {
    return getUser(address)
  }

  async _getPosts(address: string): Promise<Post[]> {
    return getPosts(address)
  }

  async _getLikes(address: string): Promise<Post[]> {
    return getLikes(address)
  }

  async _getProfileUpdates(address: string): Promise<ProfileUpdate[]> {
    return getProfileUpdates(address)
  }

  render() {
    const { user, posts, likes, profileUpdates } = this.state
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
                <Tab>Posts & Reposts</Tab>
                <Tab>Likes</Tab>
                <Tab>Profile Updates</Tab>
              </TabList>

              <TabPanel>
                {posts.length > 0 &&
                  <PostList posts={posts.map(b => {
                    return {...b, user}
                  })} />
                }
                {!posts.length &&
                  <p>Your Posts and Reposts will appear here.</p>
                }
              </TabPanel>

              <TabPanel>
                {likes.length > 0 &&
                  <PostList posts={likes.map(b => {
                    return {...b, user}
                  })} />
                }
                {!likes.length &&
                  <p>Posts you LIKE will appear here.</p>
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
