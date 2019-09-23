import React from 'react'
import ReactModal from 'react-modal'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import './modal.scss'

export interface ModalProps extends AuthProps {
  content: JSX.Element | null
}

class Modal extends React.PureComponent<ModalProps> {

  render () {
    const { content, toggleModal } = this.props

    return (
      <ReactModal
        ariaHideApp={false}
        isOpen={!!content}
        onRequestClose={() => toggleModal(null)}
        shouldCloseOnOverlayClick={true}
        className="Modal"
        overlayClassName="Modal-Overlay"
      >
        {content}
      </ReactModal>
    )
  }
}

export default withAuthContext(Modal)