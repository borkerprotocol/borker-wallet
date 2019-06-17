import React from 'react'
import ReactModal from 'react-modal'
import './modal.scss'
import { useAppState, useAppActions } from '../../globalState'

function Modal() {
  const { toggleModal } = useAppActions()
  const { modalContent } = useAppState()
  return (
    <ReactModal
      ariaHideApp={false}
      isOpen={!!modalContent}
      onRequestClose={() => toggleModal(null)}
      shouldCloseOnOverlayClick={true}
      className="Modal"
      overlayClassName="Modal-Overlay"
    >
      {modalContent}
    </ReactModal>
  )
}
export default Modal
