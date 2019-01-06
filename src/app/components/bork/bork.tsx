import React from 'react'
import { Link } from "react-router-dom"
import { RelativeBorkWithUser } from '../../../types/types'
import BorkButtons from '../bork-buttons/bork-buttons'
import { fromNow, calendar } from '../../util/timestamps'
import '../../App.scss'
import './bork.scss'

export interface BorkComponentProps {
  isMain: boolean
  showButtons: boolean
  bork: RelativeBorkWithUser
}

class BorkComponent extends React.PureComponent<BorkComponentProps> {

  render () {
    const { bork, isMain, showButtons } = this.props

    const avatar = (
      <Link to={`/profile/${bork.address}`}>
        <img src={`data:image/png;base64,${bork.user.avatar}`} className="bork-avatar" />
      </Link>
    )

    const userName = (
      <Link to={`/profile/${bork.user.address}`} className="bork-username">
        {bork.user.name}
      </Link>
    )

    const userAddress = (
      <Link to={`/profile/${bork.user.address}`} className="bork-useraddress">
        @{bork.user.address.substring(0,11)}
      </Link>
    )

    const BorkBody = () => {
      const text = bork.isThread ? `/${bork.threadIndex + 1} ${bork.content}` : bork.content
      return (
        <Link to={`/borks/${bork.txid}`} className="bork-body-link">
          {isMain &&
            <h2>{text}</h2>
          }
          {!isMain &&
            <p>{text}</p>
          }
        </Link>
      )
    }

    return isMain ? (
      <div className="bork-border">
        <div className="bork-header">
          {avatar}
          <p>
            {userName}<br />
            {userAddress}
          </p>
        </div>
        <div className="bork-content-main">
          <div className="bork-border">
            <BorkBody />
            <p><a href={`https://live.blockcypher.com/doge/tx/${bork.txid}/`} target="_blank">{bork.txid.substr(0, 30)}</a></p>
            <p style={{ color: 'gray' }}>{calendar(bork.timestamp)}</p>
          </div>
          <div className="bork-border">
            <p className="bork-stats">
              <Link
                to={`/borks/${bork.txid}/reborks`}
                className="bork-body-link"
              >
                {bork.reborks}<span> re:Borks</span>
              </Link>
              <Link
                to={`/borks/${bork.txid}/likes`}
                className="bork-body-link"
              >
                {bork.likes}<span> Likes</span>
              </Link>
            </p>
          </div>
        </div>
        {showButtons &&
          <div className="bork-footer">
            <BorkButtons bork={bork} showCount={false}/>
          </div>
        }
      </div>
    ) : (
      <div>
        <div className="bork-header">
          {avatar}
          <p>
            {userName}<span> &#183; </span>
            {userAddress}<span> &#183; </span>
            <span style={{color: 'gray'}}>{fromNow(bork.timestamp)}</span>
          </p>
        </div>
        <div className="bork-content-small">
          <BorkBody />
        </div>
        {showButtons &&
          <div className="bork-footer-small">
            <BorkButtons bork={bork} showCount/>
          </div>
        }
      </div>
    )
  }
}

export default BorkComponent
