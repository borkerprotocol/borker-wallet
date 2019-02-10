import React from 'react'
import { Bork } from '../../../types/types'
import BorkPreviewComponent from '../bork-preview/bork-preview'
import '../../App.scss'
import './bork-list.scss'

export interface BorkListProps {
  borks: Bork[]
}

class BorkList extends React.PureComponent<BorkListProps> {

  render () {
    const { borks } = this.props

    return (
      <ul className="bork-list">
        {borks.map(b => {
          return (
            <li key={b.txid}>
              <BorkPreviewComponent
                bork={b}
                showButtons
              />
            </li>
          )
        })}
      </ul>
    )
  }
}

export default BorkList
