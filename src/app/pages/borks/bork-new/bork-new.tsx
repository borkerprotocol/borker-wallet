import React from 'react'
import { RouteComponentProps } from 'react-router'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import BorkPreviewComponent from '../../../components/bork-preview/bork-preview'
import WebService from '../../../web-service'
import { Bork, BorkType } from '../../../../types/types'
import BigNumber from 'bignumber.js'
import './bork-new.scss'
import '../../../App.scss'

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
  pin: string
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
      tip: new BigNumber(1000000000),
      extraTip: '',
      pin: '',
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

  render () {
    const { body, parent, tip, extraTip } = this.state
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
        <form onSubmit={(e) => { e.preventDefault() }} className="bork-form">
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
              <input type="number" min="0" placeholder="Extra tip" value={extraTip} onChange={this.handleExtraTip} />
            </div>
          }
          <input type="submit" className="small-button" value="Bork!" disabled={!body.length} />
        </form>
      </div>
    )
  }
}

export default withAuthContext(NewBorkPage)
