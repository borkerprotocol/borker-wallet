import React from 'react'
import { Link } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, User, BorkType } from '../../../../types/types'
import WebService from '../../../web-service'
import BorkList from '../../../components/bork-list/bork-list'
import FollowButton from '../../../components/follow-button/follow-button'
import { calendar } from '../../../../util/timestamps'
import defaultAvatar from '../../../../assets/default-avatar.png'
import dogecoin from '../../../../assets/dogecoin.png'
import 'react-tabs/style/react-tabs.scss'
import './profile-show.scss'
import '../../../App.scss'
import BigNumber from 'bignumber.js';

export interface ProfileShowProps extends AuthProps {
  user: User
}

export interface ProfileShowState {
  loading: boolean
  borks: Bork[]
  likes: Bork[]
  profileUpdates: Bork[]
}

class ProfileShowPage extends React.Component<ProfileShowProps, ProfileShowState> {
  public webService: WebService

  constructor (props: ProfileShowProps) {
    super(props)
    this.state = {
      loading: true,
      borks: [],
      likes: [],
      profileUpdates: [],
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Profile')
    this.props.setShowFab(true)

    this.getUserData(this.props.user.address)
  }

  async componentWillReceiveProps (nextProps: ProfileShowProps) {
    const oldAddress = this.props.user.address
    const newAddress = nextProps.user.address

    if (oldAddress !== newAddress) {
      this.setState({ loading: true })
      this.getUserData(newAddress)
    }
  }

  getUserData = async (senderAddress: string) => {
    const [ borks, likes, profileUpdates ] = await Promise.all([
      this.webService.getBorks({
        senderAddress,
        types: [BorkType.bork, BorkType.rebork, BorkType.comment],
      }),
      this.webService.getBorks({
        senderAddress,
        types: [BorkType.like],
      }),
      this.webService.getProfileUpdates(senderAddress),
    ])

    this.setState({ loading: false, borks, likes, profileUpdates })
  }

  render () {
    const { loading, borks, likes, profileUpdates } = this.state
    const { user } = this.props

    return (
      <div className="page-content">
        <div className="top-header">
          <img style={{ maxWidth: '20px' }} src={dogecoin} /> {new BigNumber(user.earnings).toFormat(8)}
          <div style={{ float: 'right' }}>
            {user.address === this.props.address ? (
              <div>
                <Link to={`/profile/${user.address}/edit`}>
                  <button>Edit Profile</button>
                </Link>
              </div>
            ) : (
              <FollowButton user={user} />
            )}
          </div>
        </div>
        <div className="profile-header">
          <img src={user.avatarLink || defaultAvatar} className="profile-avatar" />
          <h2>
            {user.name}
          </h2>
          <h4>
            <a href={`https://chain.so/address/DOGE/${user.address}`} target="_blank">@{user.address.substr(0, 9)}</a>
            <br></br>
            <b>Birth Block: </b><a href={`https://chain.so/block/DOGE/${user.birthBlock}`} target="_blank">{user.birthBlock}</a>
          </h4>
        </div>
        <p className="profile-bio">{user.bio}</p>
        <p className="user-follow-stats">
          <Link
            to={`/profile/${user.address}/following`}
            className="user-stats-link"
          >
            {user.followingCount || 0}<span> Following</span>
          </Link>
          <Link
            to={`/profile/${user.address}/followers`}
            className="user-stats-link"
          >
            {user.followersCount || 0}<span> Followers</span>
          </Link>
        </p>
        <Tabs>
          <TabList>
            <Tab>Borks</Tab>
            <Tab>Likes</Tab>
            <Tab>Profile Updates</Tab>
          </TabList>

          <TabPanel>
            {!loading &&
              <div>
                {borks.length > 0 &&
                  <BorkList borks={borks.map(b => {
                    return { ...b }
                  })} />
                }
                {!borks.length &&
                  <p>No Borks</p>
                }
              </div>
            }
          </TabPanel>

          <TabPanel>
            {!loading &&
              <div>
                {likes.length > 0 &&
                  <BorkList borks={likes.map(l => {
                    return l.parent
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
                          <p style={{ color: 'gray' }}>{calendar(p.createdAt)}</p>

                          <p>
                            Changed <b style={{ textTransform: 'capitalize' }}>{p.type.split('_')[1]}</b> to: "{p.content}"
                          </p>
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
    )
  }
}

export default withAuthContext(ProfileShowPage)
