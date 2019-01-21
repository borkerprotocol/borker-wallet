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
  extensions: Bork[]
  comments: Bork[]
}

class BorkViewPage extends React.Component<BorkViewProps, BorkViewState> {
  public webService: WebService

  constructor (props: BorkViewProps) {
    super(props)
    this.state ={
      extensions: [],
      comments: [],
    }
    this.webService = new WebService(props.address)
  }

  async componentDidMount () {
    this.props.setTitle('Bork')
    this.props.setShowFab(false)
    console.log(this.props.match.params.txid)

    const [extensions, comments] = await Promise.all([
      this.webService.getBorks({
        parentTxid: this.props.match.params.txid,
        types: [BorkType.extension],
      }),
      this.webService.getBorks({
        parentTxid: this.props.match.params.txid,
        types: [BorkType.comment],
      }),
    ])
    
    this.setState({
      extensions,
      comments,
    })
  }

  render () {
    const { extensions, comments } = this.state
    const { bork } = this.props.location.state

    return !bork ? (
      <div>
        <p>Bork not found.</p>
      </div>
    ) : (
      <div>
        <BorkComponent bork={bork} isMain showButtons/>
        <BorkList borks={extensions} />
        <BorkList borks={comments} />
      </div>
    )
  }
}

export default withAuthContext(BorkViewPage)
