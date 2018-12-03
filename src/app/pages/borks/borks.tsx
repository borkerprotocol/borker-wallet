import React from 'react'
import { BorkWithUser } from '../../../types/types'
import { getBorksWithUser } from '../../util/mocks'
import BorkList from '../../components/bork-list/bork-list';

export interface BorksProps {}

export interface BorksState {
  borks: BorkWithUser[]
}

class BorksPage extends React.Component<BorksProps, BorksState> {

  constructor(props: BorksProps) {
    super(props)
    this.state = {
      borks: []
    }
  }

  async componentDidMount() {
    const borks = await this._getBorks()
    this.setState({ borks })
  }

  async _getBorks(): Promise<BorkWithUser[]> {
    return getBorksWithUser()
  }

  render() {
    return (
      <div>
        {this.state.borks.length &&
          <BorkList borks={this.state.borks} />
        }
      </div>
    )
  }
}

export default BorksPage
