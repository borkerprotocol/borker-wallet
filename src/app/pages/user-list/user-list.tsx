import React from 'react'
import { User, PostType } from '../../../types/types'
import { getUsers } from '../../util/mocks'
import './user-list.scss'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';

export interface UserListParams {
  id: string
}

export interface UserListProps extends RouteComponentProps<UserListParams> {
  address: string
  title: string
  setTitle: (title: string) => void
  setShowFab: (showFab: boolean) => void
}

export interface UserListState {
  users: User[]
}

class UserListPage extends React.Component<UserListProps, UserListState> {

  constructor (props: UserListProps) {
    super(props)
    this.state = {
      users: [],
    }
  }

  async componentDidMount () {
    this.props.setTitle(this.props.title)
    this.props.setShowFab(false)
    const filter = this.props.title === 'Reposted By' ? PostType.repost : PostType.like
    this.setState({
      users: await getUsers(this.props.match.params.id, filter),
    })
  }

  async follow (user: User): Promise<void> {
    alert('follows coming soon')
  }

  render () {
    const { users } = this.state
    const isRepost = this.props.title === 'Reposted By'

    return !users.length ? (
      <p style={{ margin: 14 }}>No {isRepost ? 'Reposts' : 'Likes'}</p>
    ) : (
      <ul className="user-list">
        {users.map(user => {
          return (
            <li key={user.address}>
              <div className="user-item">
                <button className="user-item-follow" onClick={() => this.follow(user)}>Follow</button>
                <Link to={`/profile/${user.address}`} style={{ textDecoration: 'none' }}>
                  <img src={`data:image/png;base64,${user.avatar}`} className="user-item-avatar" />
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

export default UserListPage
