import React from 'react'
import { Link } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { ProfileUpdate, ProfileFields, RelativePostWithUser, User } from '../../../../types/types'
import { getPosts, getLikes, getProfileUpdates } from '../../../util/mocks'
import PostList from '../../../components/post-list/post-list'
import { calendar } from '../../../util/timestamps'
import 'react-tabs/style/react-tabs.scss'
import './profile-show.scss'
import '../../../App.scss'

export interface ProfileShowProps extends AuthProps {
  user: User
}

export interface ProfileShowState {
  loading: boolean
  posts: RelativePostWithUser[]
  likes: RelativePostWithUser[]
  profileUpdates: ProfileUpdate[]
}

class ProfileShowPage extends React.Component<ProfileShowProps, ProfileShowState> {

  constructor (props: ProfileShowProps) {
    super(props)
    this.state = {
      loading: true,
      posts: [],
      likes: [],
      profileUpdates: [],
    }
  }

  async componentDidMount () {
    this.props.setTitle('Profile')
    this.props.setShowFab(true)

    await this.getData(this.props.user.address)
  }

  async componentWillReceiveProps (nextProps: ProfileShowProps) {
    const oldAddress = this.props.user.address
    const newAddress = nextProps.user.address

    if (oldAddress !== newAddress) {
      this.setState({ loading: true })
      await this.getData(newAddress)
    }
  }

  getData = async (address: string) => {
    const [ posts, likes, profileUpdates ] = await Promise.all([
      getPosts(this.props.address, address),
      getLikes(address),
      getProfileUpdates(address),
    ])

    this.setState({ loading: false, posts, likes, profileUpdates })
  }

  render () {
    const { loading, posts, likes, profileUpdates } = this.state
    const { user } = this.props

    return (
      <div className="page-content">
        <div>
          {user.address === this.props.address &&
            <div className="edit-profile-link">
              <Link to={`/profile/${user.address}/edit`}>Edit Profile</Link>
            </div>
          }
          <div className="profile-header">
            <img src={`data:image/png;base64,${user.avatar}`} className="profile-avatar" alt="avatar" />
            <h4>
              {user.name}
              <br></br>
              <a href={`https://live.blockcypher.com/doge/address/${user.address}/`} target="_blank">@{user.address.substr(0, 11)}</a>
              <br></br>
              <b>Birth Block: </b>{user.birthBlock}
            </h4>
          </div>
          <p className="profile-bio">{user.bio}</p>
          <Tabs>
            <TabList>
              <Tab>Posts & re:Posts</Tab>
              <Tab>Likes</Tab>
              <Tab>Profile Updates</Tab>
            </TabList>

            <TabPanel>
              {!loading &&
                <div>
                  {posts.length > 0 &&
                    <PostList posts={posts.map(p => {
                      return { ...p }
                    })} />
                  }
                  {!posts.length &&
                    <p>No Posts</p>
                  }
                </div>
              }
            </TabPanel>

            <TabPanel>
              {!loading &&
                <div>
                  {likes.length > 0 &&
                    <PostList posts={likes.map(p => {
                      return { ...p }
                    })} />
                  }
                  {!likes.length &&
                    <p>No Likes</p>
                  }
                </div>
              }

            </TabPanel>

            <TabPanel>
              {!loading &&
                <div>
                  {profileUpdates.length > 0 &&
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
                  }
                  {!profileUpdates.length &&
                    <p>No Profile Updates</p>
                  }
                </div>
              }
            </TabPanel>
          </Tabs>
        </div>
    </div>
    )
  }
}

export default withAuthContext(ProfileShowPage)
