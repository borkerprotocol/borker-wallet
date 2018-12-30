import React from 'react'
import { RouteComponentProps } from 'react-router'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'
import PostComponent from '../../../components/post/post'
import { getRates, getPosts } from '../../../util/mocks'
import { PostType, RelativePostWithUser } from '../../../../types/types'
import BigNumber from 'bignumber.js'
import './post-new.scss'
import '../../../App.scss'

export interface NewPostParams {
  id: string
}

export interface NewPostProps extends AuthProps, RouteComponentProps<NewPostParams> {} 

export interface NewPostState {
  body: string
  txRate: BigNumber
  charRate: BigNumber
  referencePost: RelativePostWithUser | null
}

class NewPostPage extends React.Component<NewPostProps, NewPostState> {

  constructor (props: NewPostProps) {
    super(props)
    this.state ={
      body: '',
      txRate: new BigNumber(0),
      charRate: new BigNumber(0),
      referencePost: null,
    }
  }

  async componentDidMount () {
    this.props.setTitle('New Post')
    this.props.setShowFab(false)

    const txid = this.props.match.params.id
    const posts = await getPosts(this.props.address, undefined, txid)
    const referencePost = posts.shift() as RelativePostWithUser

    const { txRate, charRate } = await getRates()

    this.setState({
      txRate,
      charRate,
      referencePost,
    })
  }

  handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      body: e.target.value,
    })
  }

  render () {
    const { body, txRate, charRate, referencePost } = this.state
    const charCount = body.length
    const txCount = charCount > 77 ? Math.ceil(1 + (charCount - 77) / 76) : 1
    const cost = txRate.times(txCount).plus(charRate.times(charCount))

    const modal = (
      <CheckoutModal type={referencePost ? PostType.reply : PostType.post} txCount={txCount} charCount={charCount} cost={cost} />
    )

    return (
      <div className="page-content">
        {referencePost &&
          <div className="replying-to">
            <b>Replying To:</b>
            <PostComponent isMain={false} showButtons={false} post={referencePost} />
          </div>
        }
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
