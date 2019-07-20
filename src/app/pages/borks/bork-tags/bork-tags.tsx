import React from 'react'
import InfiniteScroll from 'react-infinite-scroller'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import WebService from '../../../web-service'
import '../../../App.scss'
import './bork-tags.scss'
import { RouteComponentProps } from 'react-router'
import Loader from '../../../components/loader/loader'

export interface BorkTagsParams {
  tag: string
}

export interface BorkTagsProps extends AuthProps, RouteComponentProps<BorkTagsParams> {}

export interface BorkTagsState {
  loading: boolean
  borks: Bork[]
  more: boolean
}

class BorkTagsPage extends React.Component<BorkTagsProps, BorkTagsState> {
  public webService: WebService

  constructor (props: BorkTagsProps) {
    super(props)
    this.state = {
      loading: true,
      borks: [],
      more: false,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    const tag = this.props.match.params.tag
    this.props.setTitle(`#${tag.charAt(0).toUpperCase()}${tag.slice(1)}`)
    this.props.setShowFab(true)
    await this.getBorks(1)
  }

  getBorks = async (page: number) => {
    const borks = await this.webService.getBorks({
      tags: [this.props.match.params.tag],
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
        <p>No Borks</p>
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

export default withAuthContext(BorkTagsPage)
