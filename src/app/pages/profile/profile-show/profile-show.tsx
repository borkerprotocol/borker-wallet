import React from 'react'
import { Link } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, User, BorkType } from '../../../../types/types'
import WebService from '../../../web-service'
import BorkList from '../../../components/bork-list/bork-list'
import FollowButton from '../../../components/follow-button/follow-button'
import BlockButton from '../../../components/block-button/block-button'
import defaultAvatar from '../../../../assets/default-avatar.png'
import 'react-tabs/style/react-tabs.scss'
import './profile-show.scss'
import '../../../App.scss'

export interface ProfileShowProps extends AuthProps {
  user: User
}

export interface ProfileShowState {
  loading: boolean
  borks: Bork[]
  likes: Bork[]
  flags: Bork[]
}

class ProfileShowPage extends React.Component<ProfileShowProps, ProfileShowState> {
  public webService: WebService

  constructor (props: ProfileShowProps) {
    super(props)
    this.state = {
      loading: true,
      borks: [],
      likes: [],
      flags: [],
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
    const [ borks, likes, flags ] = await Promise.all([
      this.webService.getBorks({
        senderAddress,
        types: [BorkType.Bork, BorkType.Rebork, BorkType.Comment],
      }),
      this.webService.getBorks({
        senderAddress,
        types: [BorkType.Like],
      }),
      this.webService.getBorks({
        senderAddress,
        types: [BorkType.Flag],
      }),
    ])

    this.setState({ loading: false, borks, likes, flags })
  }

  render () {
    const { loading, borks, likes, flags } = this.state
    const { user } = this.props

    return (
      <div className="page-content">
        <div className="follow-edit">
          {user.address === this.props.address ? (
            <div>
              <Link to={`/profile/${user.address}/${BorkType.SetName}`}>
                <button>Set Name</button>
              </Link>
              <Link to={`/profile/${user.address}/${BorkType.SetBio}`}>
                <button>Set Bio</button>
              </Link>
              <Link to={`/profile/${user.address}/${BorkType.SetAvatar}`}>
                <button>Set Avatar</button>
              </Link>
            </div>
          ) : (
            <div>
              <FollowButton user={user} />
              <br></br>
              <BlockButton user={user} />
            </div>
          )}
        </div>
        <div className="profile-header">
          <img src={user.avatarLink || defaultAvatar} className="profile-avatar" alt='profile' />
          <h2>
            {user.name}
          </h2>
          <h4>
            <a href={`https://chain.so/address/DOGE/${user.address}`} target="_blank" rel="noopener noreferrer">@{user.address.substr(0, 9)}</a>
            <br></br>
            <b>Birth Block: </b><a href={`https://chain.so/block/DOGE/${user.birthBlock}`} target="_blank" rel="noopener noreferrer">{user.birthBlock}</a>
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
            <Tab>Flags</Tab>
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
                {flags.length > 0 &&
                  <BorkList borks={flags.map(f => {
                    return f.parent
                  })} />
                }
                {!flags.length &&
                  <p>No Flags</p>
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
