import React from 'react'
import { RouteComponentProps } from 'react-router'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'
import BorkComponent from '../../../components/bork/bork'
import { getBork } from '../../../web-service'
import { BorkType, RelativeBorkWithUser } from '../../../../types/types'
import './bork-new.scss'
import '../../../App.scss'

export interface NewBorkParams {
  id: string
}

export interface NewBorkProps extends AuthProps, RouteComponentProps<NewBorkParams> {} 

export interface NewBorkState {
  body: string
  referenceBork: RelativeBorkWithUser | undefined
}

class NewBorkPage extends React.Component<NewBorkProps, NewBorkState> {

  constructor (props: NewBorkProps) {
    super(props)
    this.state ={
      body: '',
      referenceBork: undefined,
    }
  }

  async componentDidMount () {
    this.props.setTitle('New Bork')
    this.props.setShowFab(false)

    this.setState({
      referenceBork: await getBork(this.props.match.params.id, this.props.address),
    })
  }

  handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      body: e.target.value,
    })
  }

  render () {
    const { body, referenceBork } = this.state
    const charCount = body.length
    const txCount = charCount === 0 ? 0 : charCount > 77 ? Math.ceil(1 + (charCount - 77) / 76) : 1

    const modal = (
      <CheckoutModal type={referenceBork ? BorkType.reply : BorkType.bork} txCount={txCount} />
    )

    return (
      <div className="page-content">
        {referenceBork &&
          <div className="replying-to">
            <b>Replying To:</b>
            <BorkComponent isMain={false} showButtons={false} bork={referenceBork} />
          </div>
        }
        <form onSubmit={(e) => { e.preventDefault(); this.props.toggleModal(modal) }} className="bork-form">
          <textarea value={body} onChange={this.handleBodyChange} />
          <input type="submit" value="Preview" disabled={!charCount} />
        </form>
        <p>Character Count: {charCount}</p>
        <p>Transaction Count: {txCount}</p>
      </div>
    )
  }
}

export default withAuthContext(NewBorkPage)
