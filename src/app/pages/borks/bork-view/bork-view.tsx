import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, BorkType } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import { RouteComponentProps } from 'react-router'
import WebService from '../../../web-service'
import BorkComponent from '../../../components/bork/bork'
import InfiniteScroll from 'react-infinite-scroller'
import '../../../App.scss'
import './bork-view.scss'
import Loader from '../../../components/loader/loader'

export interface BorkViewParams {
  txid: string
}

export interface BorkViewProps extends AuthProps, RouteComponentProps<BorkViewParams> {}

export interface BorkViewState {
  loading: boolean
  bork: Bork | null
  comments: Bork[]
  more: boolean
}

class BorkViewPage extends React.Component<BorkViewProps, BorkViewState> {
  public webService: WebService

  constructor (props: BorkViewProps) {
    super(props)
    this.state = {
      loading: true,
      bork: null,
      comments: [],
      more: false,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Bork')
    this.props.setShowFab(false)
    await this.getBorks(1)
  }

  async componentWillReceiveProps (nextProps: BorkViewProps) {
    const oldTxid = this.props.match.params.txid
    const newTxid = nextProps.match.params.txid

    if (oldTxid !== newTxid) {
      await this.getBorks(1, newTxid)
    }
  }

  getBorks = async (page: number, txid = this.props.match.params.txid) => {
    if (!this.state.bork || this.state.bork.txid !== txid) {
      this.setState({
        bork: await this.webService.getBork(txid),
        comments: [],
      })
    }

    let comments = await this.webService.getBorks({
      parentTxid: txid,
      types: [BorkType.Comment],
      page,
      perPage: 20,
    })

    this.setState({
      comments: this.state.comments.concat(comments),
      loading: false,
      more: comments.length >= 20,
    })
  }

  render () {
    const { bork, comments, loading, more } = this.state

    if (loading) {
      return (
        <Loader key={0} />
      )
    }

    return !bork ? (
      <div>
        <p>Bork not found.</p>
      </div>
    ) : (
      <div>
        <BorkList borks={bork.parent ? [bork.parent] : []} />
        <BorkComponent bork={bork} showButtons />
        <InfiniteScroll
          pageStart={1}
          loadMore={this.getBorks}
          hasMore={more}
          useWindow={false}
          loader={<Loader key={0} />}
        >
          <BorkList borks={comments} />
        </InfiniteScroll>
      </div>
    )
  }
}

export default withAuthContext(BorkViewPage)
