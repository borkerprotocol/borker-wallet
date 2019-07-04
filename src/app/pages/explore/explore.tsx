import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, Bork, Tag, BorkType } from '../../../types/types'
import WebService from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import '../user-list/user-list.scss'
import './explore.scss'
import InfiniteScroll from 'react-infinite-scroller'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import BorkList from '../../components/bork-list/bork-list'

export interface ExploreProps extends AuthProps {}

export interface ExploreState {
  users: User[]
  tags: Tag[]
  borks: Bork[]
  more: boolean
}

class ExplorePage extends React.Component<ExploreProps, ExploreState> {
  public webService: WebService

  constructor (props: ExploreProps) {
    super(props)
    this.state = {
      users: [],
      tags: [],
      borks: [],
      more: false,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Explore')
    this.props.setShowFab(false)
    this.fetchData(0, 1)
  }

  fetchData = (index: number, lastIndex: number): void | boolean => {
    if (index === lastIndex) { return false }

    switch (index) {
      case 0:
        if (this.state.users.length) { return }
        this.getUsers(1)
        break
      case 1:
        if (this.state.tags.length) { return }
        this.getTags(1)
        break
      case 2:
        if (this.state.borks.length) { return }
        this.getBorks(1)
        break
    }
  }

  getUsers = async (page: number) => {
    const users = await this.webService.getUsers({
      order: { birthBlock: 'ASC' },
      page,
    })
    this.setState({
      users: this.state.users.concat(users),
      more: users.length >= 20,
    })
  }

  getTags = async (page: number) => {
    const tags = await this.webService.getTags({
      page,
    })
    this.setState({
      tags: this.state.tags.concat(tags),
      more: tags.length >= 20,
    })
  }

  getBorks = async (page: number) => {
    const borks = await this.webService.getBorks({
      types: [BorkType.Bork, BorkType.Comment, BorkType.Rebork],
      order: { createdAt: 'DESC' },
      page,
    })
    this.setState({
      borks: this.state.borks.concat(borks),
      more: borks.length >= 20,
    })
  }

  render () {
    const { users, tags, borks, more } = this.state

    return (
      <div className="page-content">
        <Tabs onSelect={this.fetchData}>
          <TabList>
            <Tab>People</Tab>
            <Tab>Hashtags</Tab>
            <Tab>All Borks</Tab>
          </TabList>

          <TabPanel>
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
            </InfiniteScroll>
          </TabPanel>

          <TabPanel>
            <InfiniteScroll
              pageStart={1}
              loadMore={this.getTags}
              hasMore={more}
              useWindow={false}
            >
              <ul className="tag-list">
                {tags.map(tag => {
                  return (
                    <Link key={tag.name} to={`borks/hashtags/${tag.name.toLowerCase()}`} style={{ textDecoration: 'none' }}>
                      <li>
                        <h2># {tag.name}</h2>
                        <p><i>{tag.count} Borks</i></p>
                      </li>
                    </Link>
                  )
                })}
              </ul>
            </InfiniteScroll>
          </TabPanel>

          <TabPanel>
            <InfiniteScroll
              pageStart={1}
              loadMore={this.getBorks}
              hasMore={more}
              useWindow={false}
            >
              <BorkList borks={borks} />
            </InfiniteScroll>
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default withAuthContext(ExplorePage)
