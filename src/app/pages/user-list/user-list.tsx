import React from 'react'
import { User, PostType } from '../../../types/types'
import { getUsers } from '../../util/mocks'
import './user-list.scss'
import { RouteComponentProps } from 'react-router';

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
    const filter = this.props.title === 'reposts' ? PostType.repost : PostType.like
    this.setState({
      users: await getUsers(this.props.match.params.id, filter),
    })
  }

  render () {
    const { users } = this.state

    return !users.length ? (
      <p>No {this.props.title}</p>
    ) : (
      <ul className="user-list">
        {users.map(u => {
          return (
            <li key={u.address}>
              <p>{u.name}</p>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default UserListPage
