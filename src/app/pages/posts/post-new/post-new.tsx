import React from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { getRates } from '../../../util/mocks'
import BigNumber from 'bignumber.js'
import './post-new.scss'
import '../../../App.scss'

export interface NewPostProps extends AuthProps {}

export interface NewPostState {
  body: string
  txRate: BigNumber
  charRate: BigNumber
}

class NewPostPage extends React.Component<NewPostProps, NewPostState> {

  state = {
    body: '',
    txRate: new BigNumber(0),
    charRate: new BigNumber(0),
  }

  async componentDidMount () {
    this.props.setTitle('New Post')
    this.props.setShowFab(false)

    const { txRate, charRate } = await getRates()
    this.setState({
      txRate,
      charRate,
    })
  }

  handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      body: e.target.value,
    })
  }

  broadcast = async () => {
    alert ('broadcasts coming soon!')
  }

  render () {
    const { body, txRate, charRate } = this.state
    const charCount = body.length
    const txCount = charCount > 77 ? Math.ceil(1 + (charCount - 77) / 76) : 1
    const cost = txRate.times(txCount).plus(charRate.times(charCount))

    const modal = (
      <div>
        <p>Transaction Count: {txCount}</p>
        <p>Character Count: {charCount}</p>
        <p>Total Cost: {cost.toFormat(8)} DOGE</p>
        <button onClick={this.broadcast}>Broadcast!</button>
      </div>
    )

    return (
      <div className="page-content">
        <form onSubmit={(e) => { e.preventDefault(); this.props.toggleModal(modal) }} className="post-form">
          <p>Cost Per Transaction: {txRate.toFormat(8)} DOGE</p>
          <p>Cost Per Added Character: {charRate.toFormat(8)} DOGE</p>
          <textarea value={body} onChange={this.handleBodyChange} />
          <input type="submit" value="Preview" disabled={!charCount} />
        </form>
        <p>Transaction Count: {txCount}</p>
        <p>Character Count: {charCount}</p>
        <b>Total Cost: {cost.toFormat(8)} DOGE</b>
      </div>
    )
  }
}

export default withAuthContext(NewPostPage)
