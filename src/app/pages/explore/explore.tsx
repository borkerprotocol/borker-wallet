import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, Bork, Tag, BorkType } from '../../../types/types'
import WebService from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import '../user-list/user-list.scss'
import './explore.scss'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import BorkList from '../../components/bork-list/bork-list'

// export interface UserListProps extends AuthProps {}

export interface ExploreProps extends AuthProps {}

export interface ExploreState {
  users: User[]
  tags: Tag[]
  borks: Bork[]
}

// export interface UserListState {
//   users: User[]
//   tags: any[]
//   borks: Bork[]
// }

class ExplorePage extends React.Component<ExploreProps, ExploreState> {
  public webService: WebService

  constructor (props: ExploreProps) {
    super(props)
    this.state = {
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
      users: await this.webService.getUsers({ birthBlock: 'ASC' }) || [],
    })
  }

  fetchData = (index: number, lastIndex: number, event: Event): void | boolean => {
    if (index === lastIndex) { return false }

    switch (index) {
      case 0:
        if (this.state.users.length) { return }
        this.webService.getUsers({ birthBlock: 'ASC' }).then(users => {
          this.setState({ users })
        })
        break
      case 1:
        if (this.state.tags.length) { return }
        this.webService.getTags().then(tags => {
          this.setState({ tags })
        })
        break
      case 2:
        if (this.state.borks.length) { return }
        this.webService.getBorks({ types: [BorkType.Bork, BorkType.Comment, BorkType.Rebork], order: { createdAt: 'DESC' } }).then(borks => {
          this.setState({ borks })
        })
        break
    }
  }

  render () {
    const { users, tags, borks } = this.state

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
            <ul className="tag-list">
              {tags.map(tag => {
                return (
                  <li key={tag.name}>
                    <h2># {tag.name}</h2>
                    <p><i>{tag.count} Borks</i></p>
                  </li>
                )
              })}
            </ul>
          </TabPanel>

          <TabPanel>
            <BorkList borks={borks} />
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default withAuthContext(ExplorePage)
