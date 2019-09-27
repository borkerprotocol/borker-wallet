import React from 'react'
import { withAuthContext, AuthProps } from '../../../contexts/auth-context'
import BigNumber from 'bignumber.js'
import WebService from '../../../web-service'
import '../../../App.scss'
import './tip-modal.scss'
import { BorkType } from '../../../../types/types'

export interface TipModalProps extends AuthProps {
  type: BorkType,
  parent: {
    txid: string
    senderAddress: string
  }
  txCount?: number
  content?: string
}

export interface TipModalState {
  tip: BigNumber
  extraTip: string
  processing: boolean
  error: string
}

class TipModal extends React.Component<TipModalProps, TipModalState> {
  public webService: WebService

  constructor (props: TipModalProps) {
    super(props)
    this.state = {
      tip: new BigNumber(1000000000),
      extraTip: '',
      processing: false,
      error: '',
    }
    this.webService = new WebService()
  }

  handleExtraTip = (e: React.BaseSyntheticEvent) => {
    const value = e.target.value ? e.target.value : ''
    this.setState({
      extraTip: value,
    })
  }

  signAndBroadcast = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    const { type, txCount, content, parent } = this.props

    this.setState({
      processing: true,
    })

    try {
      await this.props.signAndBroadcast(
        type,
        txCount,
        content,
        parent,
        this.state.tip.plus(this.state.extraTip ? new BigNumber(this.state.extraTip).times(100000000) : 0),
      )
    } catch (e) {
      this.setState({
        processing: false,
        error: `error broadcasting: ${e.message}`,
      })
    }
  }

  render () {
    const { tip, extraTip, processing, error } = this.state

    return (
      <div className="tip-modal-content">
        <form onSubmit={this.signAndBroadcast} className="tip-form">
        <h1>Tip</h1>
          <p>Base Tip: {tip.dividedBy(100000000).toString()} DOGE</p>
          <input type="number" min="0" placeholder="Additional tip amount" value={extraTip} onChange={this.handleExtraTip} />
        <div style={{ textAlign: "center" }}>
          <input type="submit" className="small-button" disabled={processing} value={processing ? 'Processing' : 'Bork!'} />
        </div>
        {error &&
          <p style={{ color: 'red' }}>{error}</p>
        }
        </form>
      </div>
    )
  }
}

export default withAuthContext(TipModal)
