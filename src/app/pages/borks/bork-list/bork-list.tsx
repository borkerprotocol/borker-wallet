import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, BorkType } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import WebService from '../../../web-service'
import '../../../App.scss'
import './bork-list.scss'

export interface BorkListProps extends AuthProps {}

export interface BorkListState {
  borks: Bork[]
}

class BorkListPage extends React.Component<BorkListProps, BorkListState> {
  public webService: WebService

  constructor (props: BorkListProps) {
    super(props)
    this.state = { borks: [] }
    this.webService = new WebService(props.address)
  }

  async componentDidMount () {
    this.props.setTitle('Borks')
    this.props.setShowFab(true)

    this.setState({
      borks: await this.webService.getBorks({
        types: [BorkType.bork, BorkType.rebork],
      }),
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
