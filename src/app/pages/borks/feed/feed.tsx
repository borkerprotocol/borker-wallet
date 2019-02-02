import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, BorkType } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import WebService from '../../../web-service'
import '../../../App.scss'
import './feed.scss'

export interface FeedProps extends AuthProps {}

export interface FeedState {
  borks: Bork[]
}

class FeedPage extends React.Component<FeedProps, FeedState> {
  public webService: WebService

  constructor (props: FeedProps) {
    super(props)
    this.state = { borks: [] }
    this.webService = new WebService(props.address)
  }

  async componentDidMount () {
    this.props.setTitle('Feed')
    this.props.setShowFab(true)

    this.setState({
      borks: await this.webService.getBorks({
        isFeed: true,
        types: [BorkType.bork, BorkType.rebork],
      }) || [],
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

export default withAuthContext(FeedPage)
