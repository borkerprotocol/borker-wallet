import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, BorkType } from '../../../types/types'
import WebService, { UserRefType } from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import './user-list.scss'

export enum FollowsType {
  following = 'following',
  followers = 'followers',
}

export interface UserListParams {
  ref: string
}

export interface UserListProps extends AuthProps, RouteComponentProps<UserListParams> {
  filter: BorkType.rebork | BorkType.like | FollowsType
}

export interface UserListState {
  title: string
  users: User[]
}

class UserListPage extends React.Component<UserListProps, UserListState> {
  public webService: WebService

  constructor (props: UserListProps) {
    super(props)
    this.state = {
      title: '',
      users: [],
    }
    this.webService = new WebService(props.address)
  }

  async componentDidMount () {
    let title = ''
    let refType = UserRefType.tx

    switch (this.props.filter) {
      case BorkType.rebork:
        title = 'Reborks'
        refType = UserRefType.tx
        break
      case BorkType.like:
        title = 'Likes'
        refType = UserRefType.tx
        break
      case FollowsType.following:
        title = 'Following'
        refType = UserRefType.user
        break
      case FollowsType.followers:
        title = 'Followers'
        refType = UserRefType.user
        break
    }

    this.props.setTitle(title)
    this.props.setShowFab(false)

    this.setState({
      title,
      users: await this.webService.getUsers(this.props.match.params.ref, refType, this.props.filter),
    })
  }

  render () {
    const { users } = this.state

    return !users.length ? (
      <p style={{ margin: 14 }}>No {this.state.title}</p>
    ) : (
      <ul className="user-list">
        {users.map(user => {
          return (
            <li key={user.address}>
              <div className="user-item">
                <div className="user-item-follow">
                  <FollowButton user={user} />
                </div>
                <Link to={`/profile/${user.address}`} style={{ textDecoration: 'none' }}>
                  <img src={user.avatar || defaultAvatar} className="user-item-avatar" />
                  <span style={{ fontWeight: 'bold', color: 'black' }}>{user.name}</span><br />
                  <span style={{ color: 'gray' }}>@{user.address.substring(0,11)}</span><br />
                  <p style={{ marginLeft: 64, color: 'black' }}>{user.bio}</p>
                </Link>
              </div>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default withAuthContext(UserListPage)
