import React from 'react'
import { Link } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, User, BorkType } from '../../../../types/types'
import InfiniteScroll from 'react-infinite-scroller'
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
  more: boolean
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
      more: false,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Profile')
    this.props.setShowFab(true)

    this.fetchData(0, 1, this.props.user.address)
  }

  async componentWillReceiveProps (nextProps: ProfileShowProps) {
    const oldAddress = this.props.user.address
    const newAddress = nextProps.user.address

    if (oldAddress !== newAddress) {
      this.fetchData(0, 1, newAddress)
    }
  }

  fetchData = (index: number, lastIndex: number, senderAddress: string): void | boolean => {
    if (index === lastIndex) { return false }

    switch (index) {
      case 0:
        if (this.state.borks.length) { return }
        this.setState({
          loading: true,
        })
        this.getBorks(1, senderAddress)
        break
      case 1:
        if (this.state.likes.length) { return }
        this.setState({
          loading: true,
        })
        this.getLikes(1, senderAddress)
        break
      case 2:
        if (this.state.flags.length) { return }
this.setState({
          loading: true,
        })
        this.getFlags(1, senderAddress)
        break
    }
  }

  getBorks = async (page: number, senderAddress: string) => {
    const borks = await this.webService.getBorks({
      senderAddress,
      types: [BorkType.Bork, BorkType.Rebork, BorkType.Comment],
      order: { createdAt: 'DESC' },
      page,
    }) || []
    this.setState({
      borks: this.state.borks.concat(borks),
      more: borks.length >= 20,
      loading: false,
    })
  }

  getLikes = async (page: number, senderAddress: string) => {
    const likes = await this.webService.getBorks({
      senderAddress,
      types: [BorkType.Like],
      order: { createdAt: 'DESC' },
      page,
    }) || []
    this.setState({
      likes: this.state.likes.concat(likes),
      more: likes.length >= 20,
      loading: false,
    })
  }

  getFlags = async (page: number, senderAddress: string) => {
    const flags = await this.webService.getBorks({
      senderAddress,
      types: [BorkType.Flag],
      order: { createdAt: 'DESC' },
      page,
    }) || []
    this.setState({
      flags: this.state.flags.concat(flags),
      more: flags.length >= 20,
      loading: false,
    })
  }

  render () {
    const { loading, borks, likes, flags, more } = this.state
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
        <Tabs onSelect={(index, lastIndex) => this.fetchData(index, lastIndex, user.address)}>
          <TabList>
            <Tab>Borks</Tab>
            <Tab>Likes</Tab>
            <Tab>Flags</Tab>
          </TabList>

          <TabPanel>
            <InfiniteScroll
              pageStart={1}
              loadMore={(page) => this.getBorks(page, user.address)}
              hasMore={more}
              useWindow={false}
            >
              {borks.length >= 20 &&
                <BorkList borks={borks.map(b => {
                  return { ...b }
                })} />
              }
              {!borks.length && !loading &&
                <p>No Borks</p>
              }
            </InfiniteScroll>
          </TabPanel>

          <TabPanel>
            <InfiniteScroll
              pageStart={1}
              loadMore={(page) => this.getLikes(page, user.address)}
              hasMore={more}
              useWindow={false}
            >
              {likes.length >= 20 &&
                <BorkList borks={likes.map(l => {
                  return l.parent
                })} />
              }
              {!likes.length && !loading &&
                <p>No Likes</p>
              }
            </InfiniteScroll>
          </TabPanel>

          <TabPanel>
            <InfiniteScroll
              pageStart={1}
              loadMore={(page) => this.getFlags(page, user.address)}
              hasMore={more}
              useWindow={false}
            >
              {flags.length >= 20 &&
                <BorkList borks={flags.map(f => {
                  return f.parent
                })} />
              }
              {!flags.length && !loading &&
                <p>No Flags</p>
              }
            </InfiniteScroll>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default withAuthContext(ProfileShowPage)
