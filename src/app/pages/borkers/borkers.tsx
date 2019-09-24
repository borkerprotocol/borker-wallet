import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { Link } from 'react-router-dom'
import { User } from '../../../types/types'
import FollowButton from '../../components/follow-button/follow-button'
import { getDefaultAvatar } from '../../../util/functions'
import WebService from '../../web-service'
import Loader from '../../components/loader/loader'
import '../../App.scss'
import '../user-list/user-list.scss'
import './borkers.scss'

export interface BorkersProps extends AuthProps {}

export interface BorkersState {
  borkers: User[]
  more: boolean
  loading: boolean
}

class BorkersPage extends React.Component<BorkersProps, BorkersState> {
  public webService: WebService

  constructor (props: BorkersProps) {
    super(props)
    this.state = {
      borkers: [],
      more: false,
      loading: true,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Borkers')
    this.props.setShowFab(true)
    await this.getUsers(1)
    this.setState({ loading: false })
  }

  getUsers = async (page: number) => {
    const users = await this.webService.getUsers({
      order: { birthBlock: 'ASC' },
      page,
    })
    this.setState({
      borkers: this.state.borkers.concat(users),
      more: users.length >= 20,
    })
  }

  render () {
    const { borkers, more, loading } = this.state

    return loading ? (
      <Loader key={0} />
    ) : (
      <InfiniteScroll
        pageStart={1}
        loadMore={this.getUsers}
        hasMore={more}
        useWindow={false}
        loader={<Loader key={0} />}
      >
        <ul className="user-list">
          {borkers.map(user => {
            return (
              <li key={user.address}>
                <div className="user-item">
                  <div className="user-item-follow">
                    <FollowButton user={user} />
                  </div>
                  <Link to={`/profile/${user.address}`} style={{ textDecoration: 'none' }}>
                    <img src={user.avatarLink || getDefaultAvatar(user.address)} className="list-avatar" alt='avatar' />
                    <span style={{ fontWeight: 'bold', color: 'black' }}>{user.name}</span><br />
                    <span style={{ color: 'gray' }}>@{user.address.substring(0, 9)}</span><br />
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

export default withAuthContext(BorkersPage)

