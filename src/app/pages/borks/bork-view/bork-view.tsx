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

export interface BorkViewParams {
  txid: string
}

export interface BorkViewProps extends AuthProps, RouteComponentProps<BorkViewParams> {}

export interface BorkViewState {
  loading: boolean
  bork: Bork | null
  extensions: Bork[]
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
      extensions: [],
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
      await this.setState({
        bork: await this.webService.getBork(txid),
        extensions: [],
        comments: [],
      })
    }

    let extensions: Bork[] = []
    if (this.state.bork!.extensionsCount > this.state.extensions.length) {
      extensions = await this.webService.getBorks({
        parentTxid: txid,
        types: [BorkType.Extension],
        order: { position: 'ASC' },
        page,
        perPage: 20,
      })
    }

    let comments: Bork[] = []
    if (extensions.length < 20) {
      comments = await this.webService.getBorks({
        parentTxid: txid,
        types: [BorkType.Comment],
        page,
        perPage: 20,
      })
    }

    this.setState({
      extensions: this.state.extensions.concat(extensions),
      comments: this.state.comments.concat(comments),
      loading: false,
      more: extensions.length >= 20 || comments.length >= 20 ? true : false,
    })
  }

  render () {
    const { bork, extensions, comments, loading, more } = this.state

    if (loading) { return null }

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
        >
          <BorkList borks={extensions} />
          <BorkList borks={comments} />
        </InfiniteScroll>
      </div>
    )
  }
}

export default withAuthContext(BorkViewPage)
