import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, BorkType } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import WebService from '../../../web-service'
import '../../../App.scss'
import './feed.scss'

export interface FeedProps extends AuthProps {}

export interface FeedState {
  loading: boolean
  borks: Bork[]
}

class FeedPage extends React.Component<FeedProps, FeedState> {
  public webService: WebService

  constructor (props: FeedProps) {
    super(props)
    this.state = { loading: true, borks: [] }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('Feed')
    this.props.setShowFab(true)

    this.setState({
      borks: await this.webService.getBorks({
        filterFollowing: true,
        types: [
          BorkType.Bork,
          BorkType.Rebork,
          BorkType.Comment,
          BorkType.Like,
        ],
      }) || [],
      loading: false,
    })
  }

  render () {
    const { borks, loading } = this.state

    if (loading) { return null }

    return !borks.length ? (
      <div style={{ padding: "20px" }}>
        <p>This is your news feed.</p>
        <p>Borks and likes of people you follow will show up here.</p>
        <p>You can discover new people to follow in the <i>Explore</i> tab.</p>
      </div>
    ) : (
      <BorkList borks={borks} />
    )
  }
}

export default withAuthContext(FeedPage)
