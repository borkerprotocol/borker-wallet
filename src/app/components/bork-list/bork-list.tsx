import React from 'react'
import { Bork } from '../../../types/types'
import BorkPreviewComponent from '../bork-preview/bork-preview'
import '../../App.scss'
import './bork-list.scss'

export interface BorkListProps {
  borks: Bork[]
  showButtons?: boolean
  showHeader?: boolean
}

class BorkList extends React.PureComponent<BorkListProps> {

  render () {
    const { borks } = this.props
    const showButtons = this.props.showButtons === undefined ? true : this.props.showButtons
    const showHeader = this.props.showHeader === undefined ? true : this.props.showHeader

    return (
      <ul className="bork-list">
        {borks.map(b => {
          return (
            <li key={b.txid}>
              <BorkPreviewComponent
                bork={b}
                showButtons={showButtons}
                showHeader={showHeader}
              />
            </li>
          )
        })}
      </ul>
    )
  }
}

export default BorkList
