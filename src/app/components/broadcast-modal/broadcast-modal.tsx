import React from 'react'
import Modal from 'react-modal'
import BigNumber from 'bignumber.js'
import '../../App.scss'
import './broadcast-modal.scss'

export interface BroadcastModalProps {
  txCount: number
  charCount: number
  cost: BigNumber
  isOpen: boolean
  toggleModal: (e) => void
  broadcast: () => Promise<void>
}

export interface BroadcastModalState {}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-40%',
    transform: 'translate(-50%, -50%)'
  }
}

class BroadcastModal extends React.Component<BroadcastModalProps, BroadcastModalState> {

  render() {
    const { isOpen, txCount, charCount, cost, toggleModal, broadcast } = this.props

    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        style={modalStyles}
      >
        <button onClick={toggleModal}>x</button>
        <p>Transaction Count: {txCount}</p>
        <p>Character Count: {charCount}</p>
        <p>Total Cost: {cost.toFormat(8)} DOGE</p>
        <button onClick={broadcast}>Broadcast!</button>
      </Modal>
    )
  }
}

export default BroadcastModal
