import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, Bork, Tag, BorkType } from '../../../types/types'
import WebService from '../../web-service'
import FollowButton from '../../components/follow-button/follow-button'
import '../user-list/user-list.scss'
import './explore.scss'
import InfiniteScroll from 'react-infinite-scroller'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import BorkList from '../../components/bork-list/bork-list'
import { getDefaultAvatar } from '../../../util/functions'

export interface ExploreProps extends AuthProps {}

export interface ExploreState {
  users: User[]
  tags: Tag[]
  borks: Bork[]
  moreUsers: boolean
  moreTags: boolean
  moreBorks: boolean
  tagIndex: number
}

class ExplorePage extends React.Component<ExploreProps, ExploreState> {
  public webService: WebService
  public scrollParentRef: any

  constructor (props: ExploreProps) {
    super(props)
    this.state = {
      users: [],
      tags: [],
      borks: [],
      moreUsers: false,
      moreTags: false,
      moreBorks: false,
      tagIndex: 0,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Explore')
    this.props.setShowFab(false)
    this.getUsers(1)
  }

  fetchData = (index: number): void => {
    this.setState({ tagIndex: index })

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

  fetchMore = async (page: number) => {
    switch (this.state.tagIndex) {
      case 0:
        this.getUsers(page)
        break
      case 1:
        this.getTags(page)
        break
      case 2:
        this.getBorks(page)
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
      moreUsers: users.length >= 20,
    })
  }

  getTags = async (page: number) => {
    const tags = await this.webService.getTags({
      page,
    })
    this.setState({
      tags: this.state.tags.concat(tags),
      moreTags: tags.length >= 20,
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
      moreBorks: borks.length >= 20,
    })
  }

  render () {
    const { users, tags, borks, tagIndex, moreUsers, moreTags, moreBorks } = this.state
    const hasMore = tagIndex === 0 ? moreUsers : tagIndex === 1 ? moreTags : moreBorks

    return (
      <InfiniteScroll
        pageStart={1}
        loadMore={this.fetchMore}
        hasMore={hasMore}
        useWindow={false}
      >
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
            </TabPanel>

            <TabPanel>
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
            </TabPanel>

            <TabPanel>
              <BorkList borks={borks} />
            </TabPanel>
          </Tabs>
        </div>
      </InfiniteScroll>
    )
  }
}

export default withAuthContext(ExplorePage)
