import React from 'react'
import ReactModal from 'react-modal'
import { AppProps, withAppContext } from '../../contexts/app-context'

export interface ModalProps extends AppProps {
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
      >
        <button onClick={() => toggleModal(null)}>x</button>
        {content}
      </ReactModal> 
    )
  }
}

export default withAppContext(Modal)