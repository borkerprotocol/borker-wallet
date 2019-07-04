import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, BorkType } from '../../../types/types'
import WebService from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import InfiniteScroll from 'react-infinite-scroller'
import './user-list.scss'

export enum FollowsType {
  following = 'following',
  followers = 'followers',
}

export interface UserListParams {
  ref: string
}

export interface UserListProps
  extends AuthProps,
    RouteComponentProps<UserListParams> {
  filter: BorkType.Rebork | BorkType.Like | BorkType.Flag | FollowsType
}

export interface UserListState {
  loading: boolean
  title: string
  users: User[]
  more: boolean
}

class UserListPage extends React.Component<UserListProps, UserListState> {
  public webService: WebService

  constructor (props: UserListProps) {
    super(props)
    const filter = props.filter
    let title = `${filter.charAt(0).toUpperCase()}${filter.slice(1)}`
    if (filter === BorkType.Like || filter === BorkType.Rebork || filter === BorkType.Flag) {
      title = `${title}s`
    }
    this.state = {
      loading: true,
      title,
      users: [],
      more: false,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    await this.getUsers(1)
    this.props.setTitle(this.state.title)
    this.props.setShowFab(false)
  }

  getUsers = async (page: number) => {
    const filter = this.props.filter
    let users = []

    if (filter === FollowsType.followers || filter === FollowsType.following) {
      users = await this.webService.getUsersByUser(
        this.props.match.params.ref,
        filter,
        page)
    } else {
      users = await this.webService.getUsersByTx(
        this.props.match.params.ref,
        filter,
        page)
    }

    this.setState({
      users: this.state.users.concat(users),
      loading: false,
    })
  }

  render () {
    const { users, more, loading } = this.state

    if (loading) { return null }

    return !users.length ? (
      <p style={{ margin: 14 }}>No {this.state.title}</p>
    ) : (
      <InfiniteScroll
        pageStart={1}
        loadMore={this.getUsers}
        hasMore={more}
        useWindow={false}
      >
        <ul className="user-list">
          {users.map(user => {
            return (
              <li key={user.address}>
                <div className="user-item">
                  <div className="user-item-follow">
                    <FollowButton user={user} />
                  </div>
                  <Link
                    to={`/profile/${user.address}`}
                    style={{ textDecoration: 'none' }}
                  >
                    <img
                      src={user.avatarLink || defaultAvatar}
                      className="user-item-avatar"
                      alt="avatar"
                    />
                    <span style={{ fontWeight: 'bold', color: 'black' }}>
                      {user.name}
                    </span>
                    <br />
                    <span style={{ color: 'gray' }}>
                      @{user.address.substring(0, 9)}
                    </span>
                    <br />
                    <p style={{ marginLeft: 64, color: 'black' }}>{user.bio}</p>
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      </InfiniteScroll>
    )
  }
}

export default withAuthContext(UserListPage)
