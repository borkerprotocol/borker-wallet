import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, OrderBy, Bork } from '../../../types/types'
import WebService from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import '../user-list/user-list.scss'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'

export interface UserListProps extends AuthProps {}

export interface UserListState {
  order: OrderBy<User>
  users: User[]
  tags: any[]
  borks: Bork[]
}

class ExplorePage extends React.Component<UserListProps, UserListState> {
  public webService: WebService

  constructor (props: UserListProps) {
    super(props)
    this.state = {
      order: { birthBlock: 'ASC' },
      users: [],
      tags: [],
      borks: [],
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Explore')
    this.props.setShowFab(false)

    this.setState({
      users: await this.webService.getUsers(this.state.order) || [],
    })
  }

  fetchData = (index: number, lastIndex: number, event: Event): void | boolean => {
    if (index === lastIndex) { return false }

    switch (index) {
      case 0:
        if (this.state.users.length) { return }
        this.webService.getUsers({ birthBlock: 'DESC' }).then(users => {
          this.setState({ users })
        })
        break
      case 1:
        if (this.state.tags.length) { return }
        console.log('get tags')
        break
      case 2:
        if (this.state.borks.length) { return }
        this.webService.getBorks({ tags: ['free'] }).then(borks => {
          this.setState({ borks })
        })
        break
    }
  }

  render () {
    const { users } = this.state

    return (
      <div className="page-content">
        <Tabs onSelect={this.fetchData}>
          <TabList>
            <Tab>People</Tab>
            <Tab>Hashtags</Tab>
            <Tab>All Borks</Tab>
          </TabList>

          <TabPanel>
            <ul className="user-list">
              {users.map(user => {
                return (
                  <li key={user.address}>
                    <div className="user-item">
                      <div className="user-item-follow">
                        <FollowButton user={user} />
                      </div>
                      <Link to={`/profile/${user.address}`} style={{ textDecoration: 'none' }}>
                        <img src={user.avatarLink || defaultAvatar} className="user-item-avatar" alt='avatar' />
                        <span style={{ fontWeight: 'bold', color: 'black' }}>{user.name}</span><br />
                        <span style={{ color: 'gray' }}>@{user.address.substring(0, 9)}</span><br />
                        <p style={{ marginLeft: 64, color: 'black' }}>{user.bio}</p>
                      </Link>
                    </div>
                  </li>
                )
              })}
            </ul>
          </TabPanel>

          <TabPanel>

          </TabPanel>
          <TabPanel></TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default withAuthContext(ExplorePage)
