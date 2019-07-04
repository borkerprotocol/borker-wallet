import React from 'react'
import { Link } from "react-router-dom"
import { Bork, BorkType } from '../../../types/types'
import BorkButtons from '../bork-buttons/bork-buttons'
import { calendar } from '../../../util/timestamps'
import defaultAvatar from '../../../assets/default-avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faComments } from '@fortawesome/free-solid-svg-icons'
import '../../App.scss'
import './bork.scss'

export interface BorkComponentProps {
  bork: Bork
  showButtons?: boolean
}

class BorkComponent extends React.PureComponent<BorkComponentProps> {

  render() {
    let { bork, showButtons } = this.props

    // TODO convert #tags into <Links>
    function getTags(content: string) {
      return content
    }

    const avatar = (
      <Link to={`/profile/${bork.sender.address}`}>
        <img src={bork.sender.avatarLink || defaultAvatar} className="bork-avatar" alt='avatar' />
      </Link>
    )

    const userName = (
      <Link to={`/profile/${bork.sender.address}`} className="bork-username">
        {bork.sender.name}
      </Link>
    )

    const userAddress = (
      <Link to={`/profile/${bork.sender.address}`} className="bork-useraddress">
        @{bork.sender.address.substring(0, 9)}
      </Link>
    )

    const BorkBody = () => {
      const content = getTags(bork.content)

      return (
        <Link
          to={`/borks/${bork.txid}`}
          className="bork-body-link"
        >
          <h2>
            {bork.type === BorkType.Extension ? "…" : ""}
            {content}
            {bork.extensionsCount > 0 ? "…" : ""}
          </h2>
        </Link>
      )
    }

    return (
      <div className="bork-border">
        <div className="bork-header">
          {avatar}
          <p>
            {userName}<br />
            {userAddress}
          </p>
          {bork.type === BorkType.Comment &&
            <p className="bork-ref">
              <FontAwesomeIcon
                icon={faComments}
              />
              Replying To {bork.parent.sender.name}
            </p>
          }
        </div>
        <div className="bork-content">
          <div className="bork-border">
            <BorkBody />
            <p><a href={`https://chain.so/tx/DOGE/${bork.txid}`} target="_blank" rel="noopener noreferrer">{bork.txid.substr(0, 20)}</a></p>
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
              <Link
                to={`/borks/${bork.txid}/flags`}
                className="bork-body-link"
              >
                {bork.flagsCount || 0}<span> Flags</span>
              </Link>
            </p>
          </div>
        </div>
        {showButtons &&
          <div className="bork-footer">
            <BorkButtons bork={bork} showCount={false} />
          </div>
        }
      </div>
    )
  }
}

export default BorkComponent
