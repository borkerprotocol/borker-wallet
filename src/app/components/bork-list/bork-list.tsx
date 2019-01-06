import React from 'react'
import { RelativeBorkWithUser, Bork } from '../../../types/types'
import BorkComponent from '../bork/bork'
import '../../App.scss'
import './bork-list.scss'

export interface BorkListProps {
  borks: RelativeBorkWithUser[]
}

class BorkList extends React.PureComponent<BorkListProps> {

  render () {
    const { borks } = this.props

    return (
      <ul className="bork-list">
        {borks.map(b => {
          return (
            <li key={b.txid}>
              <BorkComponent bork={b} isMain={false} showButtons />
            </li>
          )
        })}
      </ul>
    )
  }
}

export default BorkList
