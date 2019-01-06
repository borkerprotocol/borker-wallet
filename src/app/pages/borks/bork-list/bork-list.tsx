import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { RelativeBorkWithUser } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import { getBorks } from '../../../web-service'
import '../../../App.scss'
import './bork-list.scss'

export interface BorkListProps extends AuthProps {}

export interface BorkListState {
  borks: RelativeBorkWithUser[]
}

class BorkListPage extends React.Component<BorkListProps, BorkListState> {

  state = { borks: [] }

  async componentDidMount () {
    this.props.setTitle('Borks')
    this.props.setShowFab(true)

    this.setState({
      borks: await getBorks(this.props.address),
    })
  }

  render () {
    const { borks } = this.state

    return !borks.length ? (
      null
    ) : (
      <BorkList borks={borks} />
    )
  }
}

export default withAuthContext(BorkListPage)
