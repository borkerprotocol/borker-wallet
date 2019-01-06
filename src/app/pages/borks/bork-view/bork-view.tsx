import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { RelativeBorkWithUser } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import { RouteComponentProps } from 'react-router'
import { getBorks } from '../../../util/mocks'
import BorkComponent from '../../../components/bork/bork'
import '../../../App.scss'
import './bork-view.scss'

export interface BorkViewParams {
  id: string
}

export interface BorkViewProps extends AuthProps, RouteComponentProps<BorkViewParams> {}

export interface BorkViewState {
  bork: RelativeBorkWithUser | null
  thread: RelativeBorkWithUser[]
}

class BorkViewPage extends React.Component<BorkViewProps, BorkViewState> {

  state = {
    bork: null,
    thread: [],
  }

  async componentDidMount () {
    this.props.setTitle('Bork')
    this.props.setShowFab(false)

    const txid = this.props.match.params.id
    const borks = await getBorks(this.props.address, undefined, txid)
    const bork = borks.shift() as RelativeBorkWithUser
    
    this.setState({
      bork,
      thread: borks,
    })
  }

  render () {
    const { bork, thread } = this.state

    return !bork ? (
      <div>
        <p>Bork not found.</p>
      </div>
    ) : (
      <div>
        <BorkComponent bork={bork} isMain showButtons/>
        <BorkList borks={thread} />
      </div>
    )
  }
}

export default withAuthContext(BorkViewPage)
