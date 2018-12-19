import React from 'react'
import { getRates } from '../../../util/mocks'
import BigNumber from 'bignumber.js'
import BroadcastModal from '../../../components/broadcast-modal/broadcast-modal'
import './post-new.scss'
import '../../../App.scss'

export interface NewPostProps {
  setTitle: (title: string) => void
}

export interface NewPostState {
  body: string
  txRate: BigNumber
  charRate: BigNumber
  isModalOpen: boolean
}

class NewPostPage extends React.Component<NewPostProps, NewPostState> {

  constructor (props: NewPostProps) {
    super(props)
    this.state = {
      body: '',
      txRate: new BigNumber(0),
      charRate: new BigNumber(0),
      isModalOpen: false,
    }
    this._handleBodyChange = this._handleBodyChange.bind(this)
    this.toggleModal = this.toggleModal.bind(this)
  }

  async componentDidMount () {
    this.props.setTitle('New Post')
    const { txRate, charRate } = await getRates()
    this.setState({
      txRate,
      charRate,
    })
  }

  _handleBodyChange (e) {
    this.setState({
      body: e.target.value,
    })
  }

  toggleModal (e) {
    e.preventDefault()
    this.setState({
      isModalOpen: !this.state.isModalOpen,
    })
  }

  async broadcast (): Promise<void> {
    alert('broadcasts coming soon!')
  }

  render() {
    const { body, txRate, charRate, isModalOpen } = this.state
    const txCount = Math.ceil(body.length / 77) || 1
    const charCount = body.length
    const cost = txRate.times(txCount).plus(charRate.times(charCount))
    
    return (
      <div className="page-content">
        <form onSubmit={this.toggleModal} className="post-form">
          <p>Cost Per Transaction: {txRate.toFormat(8)} DOGE</p>
          <p>Cost Per Character: {charRate.toFormat(8)} DOGE</p>
          <input type="text" value={body} onChange={this._handleBodyChange} />
          <input type="submit" value="Preview" disabled={!body.length} />
        </form>
        <p>Transaction Count: {txCount}</p>
        <p>Character Count: {charCount}</p>
        <p>Total Cost: {cost.toFormat(8)} DOGE</p>
        {isModalOpen &&
          <BroadcastModal
            isOpen={isModalOpen}
            txCount={txCount}
            charCount={charCount}
            cost={cost}
            toggleModal={this.toggleModal}
            broadcast={this.broadcast}
          />
        }
      </div>
    )
  }
}

export default NewPostPage