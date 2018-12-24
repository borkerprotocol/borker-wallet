import React from 'react'
import { RouteComponentProps } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { User, ProfileUpdate, ProfileFields, RelativePost, RelativePostWithUser } from '../../../types/types'
import { getUser, getRelativePosts, getLikes, getProfileUpdates } from '../../util/mocks'
import PostList from '../../components/post-list/post-list'
import { calendar } from '../../util/timestamps'
import 'react-tabs/style/react-tabs.scss'
import './profile.scss'
import '../../App.scss'

export interface ProfileParams {
  id: string
}

export interface ProfileProps extends RouteComponentProps<ProfileParams> {
  address: string
  setTitle: (title: string) => void
}

export interface ProfileState {
  user?: User
  posts: RelativePost[]
  likes: RelativePostWithUser[]
  profileUpdates: ProfileUpdate[]
}

class ProfilePage extends React.Component<ProfileProps, ProfileState> {

  constructor (props: ProfileProps) {
    super(props)
    this.state = {
      posts: [],
      likes: [],
      profileUpdates: [],
    }
  }

  async componentDidMount () {
    this.props.setTitle('Profile')
    const userAddress = this.props.match.params.id
    this.setState({
      user: await getUser(userAddress),
      posts: await getRelativePosts(userAddress, this.props.address),
      likes: await getLikes(userAddress),
      profileUpdates: await getProfileUpdates(userAddress),
    })
  }

  async componentWillReceiveProps (nextProps: ProfileProps) {
    const userAddress = nextProps.match.params.id
    if (userAddress !== this.props.match.params.id) {
      this.setState({
        user: await getUser(userAddress),
        posts: await getRelativePosts(userAddress, this.props.address),
        likes: await getLikes(userAddress),
        profileUpdates: await getProfileUpdates(userAddress),
      })
    }
  }

  render () {
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
                <a href={`https://blockchain.com/btc/address/${user.address}`} target="_blank">@{user.address.substr(0, 11)}</a>
                <br></br>
                <b>Birth Block: </b>{user.birthBlock}
              </h4>
            </div>
            <Tabs>
              <TabList>
                <Tab>Posts & re:Posts</Tab>
                <Tab>Likes</Tab>
                <Tab>Profile Updates</Tab>
              </TabList>

              <TabPanel>
                {posts.length > 0 &&
                  <PostList posts={posts.map(p => {
                    return { ...p, user }
                  })} />
                }
                {!posts.length &&
                  <p>Your Posts and Reposts will appear here.</p>
                }
              </TabPanel>

              <TabPanel>
                {likes.length > 0 &&
                  <PostList posts={likes.map(p => {
                    return { ...p }
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
                        <p style={{ color: 'gray' }}>{calendar(p.timestamp)}</p>

                        <p>Changed {p.field}{p.field === ProfileFields.name ? ` to ${p.value}` : ''}</p>
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
