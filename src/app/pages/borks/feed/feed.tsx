import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, BorkType } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import WebService from '../../../web-service'
import '../../../App.scss'
import './feed.scss'
import Loader from '../../../components/loader/loader'

export interface FeedProps extends AuthProps {}

export interface FeedState {
  loading: boolean
  borks: Bork[]
  more: boolean
}

class FeedPage extends React.Component<FeedProps, FeedState> {
  public webService: WebService

  constructor (props: FeedProps) {
    super(props)
    this.state = {
      loading: true,
      borks: [],
      more: false,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Feed')
    this.props.setShowFab(true)
    await this.getBorks(1)
  }

  getBorks = async (page: number) => {
    const borks = await this.webService.getBorks({
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
      borks: this.state.borks.concat(borks),
      loading: false,
      more: borks.length >= 20,
    })
  }

  render () {
    const { borks, loading, more } = this.state

    if (loading) { return null }

    return !borks.length ? (
      <div style={{ padding: "20px" }}>
        <p>This is your news feed.</p>
        <p>Borks and likes of people you follow will show up here.</p>
        <p>You can discover new people to follow in the <i>Explore</i> tab.</p>
      </div>
    ) : (
      <InfiniteScroll
        pageStart={1}
        loadMore={this.getBorks}
        hasMore={more}
        useWindow={false}
        loader={<Loader key={0} />}
      >
        <BorkList borks={borks} />
      </InfiniteScroll>
    )
  }
}

export default withAuthContext(FeedPage)
