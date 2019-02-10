import React from 'react'
import { Link } from "react-router-dom"
import { Bork, BorkType } from '../../../types/types'
import BorkButtons from '../bork-buttons/bork-buttons'
import { fromNow } from '../../../util/timestamps'
import defaultAvatar from '../../../assets/default-avatar.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHeart } from '@fortawesome/free-solid-svg-icons'
import '../../App.scss'
import './bork-preview.scss'

export interface BorkPreviewComponentProps {
  bork: Bork
  showButtons: boolean
}

class BorkPreviewComponent extends React.PureComponent<BorkPreviewComponentProps> {

  render () {
    let { bork, showButtons } = this.props
    let child: Bork | null = null

    if (bork.type === BorkType.like) {
      child = bork
      bork = bork.parent
    }

    // TODO convert #tags into <Links>
    function getTags (content: string) {
      return content
    }

    const avatar = (
      <Link to={`/profile/${bork.sender.address}`}>
        <img src={bork.sender.avatar || defaultAvatar} className="bork-avatar" />
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
      const content = getTags(bork.content)

      return (
        <Link
          to={`/borks/${bork.txid}`}
          className="bork-body-link"
        >
          <p>{content}</p>
        </Link>
      )
    }

    return (
      <div>
        <div className="bork-header">
          {child && 
            <p className="bork-preview-ref">
              <FontAwesomeIcon
                icon={faHeart}
              />
              Liked by {child.sender.name}
            </p>
          }
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

export default BorkPreviewComponent
