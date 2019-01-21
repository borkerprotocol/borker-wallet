import React from 'react'
import { Link } from "react-router-dom"
import { Bork } from '../../../types/types'
import BorkButtons from '../bork-buttons/bork-buttons'
import { fromNow, calendar } from '../../util/timestamps'
import { avatar1 } from '../../util/avatars'
import '../../App.scss'
import './bork.scss'

export interface BorkComponentProps {
  isMain: boolean
  showButtons: boolean
  bork: Bork
}

class BorkComponent extends React.PureComponent<BorkComponentProps> {

  render () {
    const { bork, isMain, showButtons } = this.props

    const avatar = (
      <Link to={`/profile/${bork.sender.address}`}>
        <img src={bork.sender.avatar || `data:image/png;base64,${avatar1}`} className="bork-avatar" />
      </Link>
    )

    const userName = (
      <Link to={`/profile/${bork.sender.address}`} className="bork-username">
        {bork.sender.name}
      </Link>
    )

    const userAddress = (
      <Link to={`/profile/${bork.sender.address}`} className="bork-useraddress">
        @{bork.sender.address.substring(0,11)}
      </Link>
    )

    const BorkBody = () => {
      return (
        <Link 
          to={{
            pathname: `/borks/${bork.txid}`,
            state: { bork },
          }}
          className="bork-body-link"
        >
          {isMain &&
            <h2>{bork.content}</h2>
          }
          {!isMain &&
            <p>{bork.content}</p>
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
            <p style={{ color: 'gray' }}>{calendar(bork.createdAt)}</p>
          </div>
          <div className="bork-border">
            <p className="bork-stats">
              <Link
                to={`/borks/${bork.txid}/reborks`}
                className="bork-body-link"
              >
                {bork.reborksCount || 0}<span> Reborks</span>
              </Link>
              <Link
                to={`/borks/${bork.txid}/likes`}
                className="bork-body-link"
              >
                {bork.likesCount || 0}<span> Likes</span>
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
            <span style={{color: 'gray'}}>{fromNow(bork.createdAt)}</span>
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
