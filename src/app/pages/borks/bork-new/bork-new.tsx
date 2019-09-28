import React from 'react'
import { RouteComponentProps } from 'react-router'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import BorkPreviewComponent from '../../../components/bork-preview/bork-preview'
import WebService from '../../../web-service'
import { Bork, BorkType } from '../../../../types/types'
import BigNumber from 'bignumber.js'
import './bork-new.scss'
import '../../../App.scss'
import { Parent } from '../../auth-routes'

export interface NewBorkParams {
  txid: string
}

export interface NewBorkProps extends AuthProps, RouteComponentProps<NewBorkParams> {
  type: BorkType.Bork | BorkType.Comment | BorkType.Rebork
}

export interface NewBorkState {
  body: string
  parent: Bork | undefined
  tip: BigNumber
  extraTip: string
  processing: boolean,
  error: string,
}

class NewBorkPage extends React.Component<NewBorkProps, NewBorkState> {
  public webService: WebService

  constructor (props: NewBorkProps) {
    super(props)
    this.state = {
      body: '',
      parent: undefined,
      tip: this.props.match.params.txid ? new BigNumber(1000000000) : new BigNumber(0),
      extraTip: '',
      processing: false,
      error: '',
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setTitle('New Bork')
    this.props.setShowFab(false)

    if (this.props.match.params.txid) {
      this.setState({
        parent: await this.webService.getBork(this.props.match.params.txid),
      })
    }
  }

  handleBodyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    this.setState({
      body: e.target.value,
    })
  }

  handleExtraTip = (e: React.BaseSyntheticEvent) => {
    this.setState({
      extraTip: e.target.value || '',
    })
  }

  bork = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()

    this.setState({ processing: true, error: '' })

    const charCount = this.state.body.length
    const txCount = charCount === 0 ? 0 : charCount > 76 ? Math.ceil(1 + (charCount - 76) / 75) : 1

    const parent: Parent | undefined = this.state.parent ? {
      txid: this.state.parent.txid,
      senderAddress: this.state.parent.sender.address,
    } : undefined

    try {
      await this.props.signAndBroadcast(
        this.props.type,
        txCount,
        this.state.body,
        parent,
        this.state.tip.plus(this.state.extraTip || 0),
      )
      this.setState({
        processing: false,
        body: '',
        extraTip: '',
      })
    } catch (e) {
      this.setState({
        processing: false,
        error: e.message,
      })
    }
  }

  render () {
    const { body, parent, tip, extraTip, processing } = this.state
    const hasParent = !!this.props.match.params.txid

    return (
      <div className="page-content">
        {hasParent && !parent &&
          <div className="commenting-on">
            Loading Parent...
          </div>
        }
        {parent &&
          <div className="commenting-on">
            <b>Commenting On:</b>
            <BorkPreviewComponent bork={parent} />
          </div>
        }
        <form onSubmit={this.bork} className="bork-form">
          {!hasParent &&
            <textarea value={body} onChange={this.handleBodyChange} />
          }
          {hasParent &&
            <div>
              <div style={{ marginBottom: '12px' }}>
                <b>Your comment:</b>
              </div>
              <textarea value={body} onChange={this.handleBodyChange} />

              <div className="divider"></div>

              <div style={{ marginBottom: '12px' }}>
                <b>Tip:</b>
              </div>
              <p>Base Tip: {tip.dividedBy(100000000).toString()} DOGE</p>
              <input type="number" min="0" placeholder="Additional tip amount" value={extraTip} onChange={this.handleExtraTip} />
            </div>
          }
          <input
            type="submit"
            className="small-button"
            value={processing ? 'Processing' : 'Broadcast!'}
            disabled={!body.length || processing}
          />
        </form>
      </div>
    )
  }
}

export default withAuthContext(NewBorkPage)
