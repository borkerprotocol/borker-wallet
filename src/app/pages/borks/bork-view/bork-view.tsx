import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, BorkType } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import { RouteComponentProps } from 'react-router'
import WebService from '../../../web-service'
import BorkComponent from '../../../components/bork/bork'
import '../../../App.scss'
import './bork-view.scss'

export interface BorkViewParams {
  txid: string
}

export interface BorkViewProps extends AuthProps, RouteComponentProps<BorkViewParams> {}

export interface BorkViewState {
  bork: Bork | null
  extensions: Bork[]
  comments: Bork[]
}

class BorkViewPage extends React.Component<BorkViewProps, BorkViewState> {
  public webService: WebService

  constructor (props: BorkViewProps) {
    super(props)
    this.state = {
      bork: null,
      extensions: [],
      comments: [],
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Bork')
    this.props.setShowFab(false)

    const [bork, extensions, comments] = await Promise.all([
      this.webService.getBork(this.props.match.params.txid),
      this.webService.getBorks({
        parentTxid: this.props.match.params.txid,
        types: [BorkType.Extension],
        order: { position: 'ASC' },
      }),
      this.webService.getBorks({
        parentTxid: this.props.match.params.txid,
        types: [BorkType.Comment],
      }),
    ])

    this.setState({
      bork,
      extensions,
      comments,
    })
  }

  async componentWillReceiveProps (nextProps: BorkViewProps) {
    const oldTxid = this.props.match.params.txid
    const newTxid = nextProps.match.params.txid

    if (oldTxid !== newTxid) {
      const [bork, extensions, comments] = await Promise.all([
        this.webService.getBork(newTxid),
        this.webService.getBorks({
          parentTxid: newTxid,
          types: [BorkType.Extension],
          order: { position: 'ASC' },
        }),
        this.webService.getBorks({
          parentTxid: newTxid,
          types: [BorkType.Comment],
        }),
      ])

      this.setState({
        bork,
        extensions,
        comments,
      })
    }
  }

  render () {
    const { bork, extensions, comments } = this.state

    return !bork ? (
      <div>
        <p>Bork not found.</p>
      </div>
    ) : (
      <div>
        <BorkList borks={bork.parent ? [bork.parent] : []} />
        <BorkComponent bork={bork} showButtons />
        <BorkList borks={extensions} />
        <BorkList borks={comments} />
      </div>
    )
  }
}

export default withAuthContext(BorkViewPage)
