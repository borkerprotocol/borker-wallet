import React from 'react'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, Tag, BorkType } from '../../../../types/types'
import WebService from '../../../web-service'
import InfiniteScroll from 'react-infinite-scroller'
import { Tabs, TabList, Tab, TabPanel } from 'react-tabs'
import BorkList from '../../../components/bork-list/bork-list'
import Loader from '../../../components/loader/loader'
import './borks.scss'

export interface BorksProps extends AuthProps {}

export interface BorksState {
  feed: Bork[]
  tags: Tag[]
  borks: Bork[]
  moreFeed: boolean
  moreTags: boolean
  moreBorks: boolean
  tabIndex: number
  loading: boolean
}

class BorksPage extends React.Component<BorksProps, BorksState> {
  public webService: WebService
  public scrollParentRef: any

  constructor (props: BorksProps) {
    super(props)
    this.state = {
      feed: [],
      tags: [],
      borks: [],
      moreFeed: false,
      moreTags: false,
      moreBorks: false,
      tabIndex: 0,
      loading: true,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Borks')
    this.props.setShowFab(true)
    this.fetchData(0)
  }

  fetchData = (index: number): void => {
    this.setState({ tabIndex: index })

    let fn: () => Promise<any> = () => { return Promise.resolve() }
    switch (index) {
      case 0:
        if (this.state.feed.length) { return }
        this.setState({ loading: true })
        fn = () => this.getFeed(1)
        break
      case 1:
        if (this.state.tags.length) { return }
        this.setState({ loading: true })
        fn = () => this.getTags(1)
        break
      case 2:
        if (this.state.borks.length) { return }
        this.setState({ loading: true })
        fn = () => this.getBorks(1)
        break
    }

    fn().then(() => {
      this.setState({ loading: false })
    })
  }

  fetchMore = async (page: number) => {
    switch (this.state.tabIndex) {
      case 0:
        this.getFeed(page)
        break
      case 1:
        this.getTags(page)
        break
      case 2:
        this.getBorks(page)
        break
    }
  }

  getFeed = async (page: number) => {
    const feed = await this.webService.getBorks({
      filterFollowing: true,
      types: [
        BorkType.Bork,
        BorkType.Rebork,
        BorkType.Comment,
        BorkType.Like,
      ],
      page,
    }) || []
    this.setState({
      feed: this.state.feed.concat(feed),
      moreFeed: feed.length >= 20,
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
    const { feed, tags, borks, tabIndex, moreFeed, moreTags, moreBorks, loading } = this.state
    const hasMore = tabIndex === 0 ? moreFeed : tabIndex === 1 ? moreTags : moreBorks

    return (
      <div className="page-content">
        <Tabs onSelect={this.fetchData}>
          <TabList>
            <Tab>Feed</Tab>
            <Tab>Hashtags</Tab>
            <Tab>All Borks</Tab>
          </TabList>

          <TabPanel style={{ height: '700px', overflow: 'auto' }}>
            {loading &&
              <Loader key={0} />
            }
            {!loading &&
              <InfiniteScroll
                pageStart={1}
                loadMore={this.fetchMore}
                hasMore={hasMore}
                useWindow={false}
                loader={<Loader key={0} />}
              >
                {!feed.length &&
                  <div style={{ padding: "20px" }}>
                    <p>This is your news feed.</p>
                    <p>Borks and likes of people you follow will show up here.</p>
                  </div>
                }
                {!!feed.length &&
                  <BorkList borks={feed} />
                }
              </InfiniteScroll>
            }
          </TabPanel>

          <TabPanel style={{ height: '700px', overflow: 'auto' }}>
            {loading &&
              <Loader key={0} />
            }
            {!loading &&
              <InfiniteScroll
                pageStart={1}
                loadMore={this.fetchMore}
                hasMore={hasMore}
                useWindow={false}
                loader={<Loader key={0} />}
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
            }
          </TabPanel>

          <TabPanel style={{ height: '700px', overflow: 'auto' }}>
            {loading &&
              <Loader key={0} />
            }
            {!loading &&
              <InfiniteScroll
                pageStart={1}
                loadMore={this.fetchMore}
                hasMore={hasMore}
                useWindow={false}
                loader={<Loader key={0} />}
              >
                <BorkList borks={borks} />
              </InfiniteScroll>
            }
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default withAuthContext(BorksPage)

