import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User } from '../../../types/types'
import WebService from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import '../user-list/user-list.scss'

export enum UserFilter {
  birth = 'birth',
  earnings = 'earnings',
  followers = 'followers',
}

export interface UserListProps extends AuthProps {}

export interface UserListState {
  filter: UserFilter
  users: User[]
}

class UserListPage extends React.Component<UserListProps, UserListState> {
  public webService: WebService

  constructor (props: UserListProps) {
    super(props)
    this.state = {
      filter: UserFilter.followers,
      users: [],
    }
    this.webService = new WebService(props.address)
  }

  async componentDidMount () {
    this.props.setTitle('Sniff Around')
    this.props.setShowFab(false)

    this.setState({
      users: await this.webService.getUsers(this.state.filter),
    })
  }

  render () {
    const { users } = this.state

    return !users.length ? (
      null
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
