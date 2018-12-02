import React from 'react'
import { Link } from "react-router-dom"
import { Bork, BorkWithUser } from '../../../types/types'
import { getBorksWithUser } from '../../util/mocks'
import './borks.css'

export interface BorksProps {}

export interface BorksState {
  borks: BorkWithUser[]
}

class BorksPage extends React.Component<BorksProps, BorksState> {

  constructor(props) {
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
      <ul>
        {this.state.borks.map(b => {
          return (
            <li key={b.txid}>
              <p>
                {b.user.name}
                <span> &#183; </span>
                <Link
                  to={`/profile/${b.address}`}
                  className="link"
                >
                  @{b.address.substring(0,11)}
                </Link>
                <span> &#183; </span>
                {b.timestamp}
              </p>
              <p>
                {b.content}
              </p>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default BorksPage
