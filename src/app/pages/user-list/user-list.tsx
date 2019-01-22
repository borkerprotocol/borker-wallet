import React from 'react'
import { RouteComponentProps } from 'react-router'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import CheckoutModal from '../../components/modals/checkout-modal/checkout-modal'
import { User, BorkType } from '../../../types/types'
import { avatar1 } from '../../util/avatars'
import WebService from '../../web-service'
import './user-list.scss'

export interface UserListParams {
  txid: string
}

export interface UserListProps extends AuthProps, RouteComponentProps<UserListParams> {
  filter: BorkType.rebork | BorkType.like
}

export interface UserListState {
  users: User[]
}

class UserListPage extends React.Component<UserListProps, UserListState> {
  public webService: WebService

  constructor (props: UserListProps) {
    super(props)
    this.state = {
      users: [],
    }
    this.webService = new WebService(props.address)
  }

  async componentDidMount () {
    const title = this.props.filter === BorkType.rebork ? 'Reborked By' : 'Liked By'
    this.props.setTitle(title)
    this.props.setShowFab(false)
    this.setState({
      users: await this.webService.getUsers({
        txid: this.props.match.params.txid,
        types: [this.props.filter],
      }),
    })
  }

  render () {
    const { users } = this.state
    const isRebork = this.props.filter === BorkType.rebork

    const modal = (
      <CheckoutModal type={BorkType.follow} txCount={1} />
    )

    return !users.length ? (
      <p style={{ margin: 14 }}>No {isRebork ? 're:Borks' : 'Likes'}</p>
    ) : (
      <ul className="user-list">
        {users.map(user => {
          return (
            <li key={user.address}>
              <div className="user-item">
                <button className="user-item-follow" onClick={() => this.props.toggleModal(modal)}>Follow</button>
                <Link to={`/profile/${user.address}`} style={{ textDecoration: 'none' }}>
                  <img src={user.avatar || `data:image/png;base64,${avatar1}`} className="user-item-avatar" />
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
