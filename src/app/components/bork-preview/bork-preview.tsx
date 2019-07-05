import React from 'react'
import { Link } from "react-router-dom"
import { Bork, BorkType } from '../../../types/types'
import BorkButtons from '../bork-buttons/bork-buttons'
import { fromNow } from '../../../util/timestamps'
import defaultAvatar from '../../../assets/avatar-1.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart, faRetweet } from '@fortawesome/free-solid-svg-icons'
import '../../App.scss'
import './bork-preview.scss'

export interface BorkPreviewComponentProps {
  bork: Bork
  showButtons?: boolean
  isSubBork?: boolean
}

class BorkPreviewComponent extends React.PureComponent<BorkPreviewComponentProps> {

  render () {
    let { bork, showButtons, isSubBork } = this.props
    let child: Bork | null = null
    let childText: string = ''
    let childIcon: any

    if (bork.type === BorkType.Like || bork.type === BorkType.Rebork) {
      child = bork
      bork = bork.parent
      childText = child.type === BorkType.Like ? 'Liked' : 'Reborked'
      childIcon = child.type === BorkType.Like ? faHeart : faRetweet
    }

    // TODO convert #tags into <Links>
    function getTags (content: string) {
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
          <p>
            {bork.type === BorkType.Extension ? "…" : ""}
            {content}
            {bork.position < bork.extensionsCount ? "…" : ""}
          </p>
        </Link>
      )
    }

    return (
      <div>
        <div className="bork-header">
          {child &&
            <p className="bork-preview-ref">
              <FontAwesomeIcon
                icon={childIcon}
              />
              {childText} by {child.sender.name}
            </p>
          }
          {!isSubBork && avatar}
          <p>
            {userName}<span> &#183; </span>{userAddress}
            {!isSubBork &&
              <span style={{ color: 'gray' }}> &#183; {fromNow(bork.createdAt)}</span>
            }
          </p>
        </div>
        <div className={isSubBork ? "sub-bork-content" : "bork-content-small"}>
          <BorkBody />
        </div>
        {bork.type === BorkType.Comment && bork.parent &&
          <div className="sub-bork">
            <BorkPreviewComponent bork={bork.parent} isSubBork />
          </div>
        }
        {showButtons &&
          <div className="bork-footer-small">
            <BorkButtons bork={bork} showCount />
          </div>
        }
      </div>
    )
  }
}

export default BorkPreviewComponent
