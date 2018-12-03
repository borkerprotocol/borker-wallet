import React from 'react'
import { Link } from "react-router-dom"
import { BorkWithUser } from '../../../types/types'
import './bork-list.css'

export interface BorkListProps {
  borks: BorkWithUser[]
}

export interface BorkListState {
  borks: BorkWithUser[]
}

class BorkList extends React.Component<BorkListProps, BorkListState> {

  constructor(props: BorkListProps) {
    super(props)
    this.state = {
      borks: props.borks
    }
  }

  render() {
    return (
      <ul className="bork-list">
        {this.state.borks.map(b => {
          return (
            <li key={b.txid}>
              <Link to={`/profile/${b.address}`}>
                <img src={`data:image/png;base64,${b.user.avatar}`} className="avatar"/>
              </Link>
              <p>
                <b style={{color: 'orange'}}>{b.user.name}</b>
                <span> &#183; </span>
                <Link
                  to={`/profile/${b.address}`}
                  className="link"
                >
                  @{b.address.substring(0,11)}
                </Link>
                <span> &#183; </span>
                <span style={{color: 'gray'}}>{b.timestamp}</span>
              </p>
              <p>{b.content}</p>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default BorkList
