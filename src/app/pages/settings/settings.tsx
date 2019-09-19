import React from 'react'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import WebService from '../../web-service'
import * as Storage from 'idb-keyval'
import '../../App.scss'
import './settings.scss'
import * as CryptoJS from 'crypto-js'
import PinModal from '../../components/modals/pin-modal/pin-modal'
import ChangePinModal from '../../components/modals/change-pin-modal/change-pin-modal'

export interface SettingsProps extends AuthProps {}

export interface SettingsState {
  submitEnabled: boolean
  borkerip: string
  mnemonic: string
}

class SettingsPage extends React.Component<SettingsProps, SettingsState> {
  public webService: WebService

  constructor (props: SettingsProps) {
    super(props)
    this.state = {
      submitEnabled: false,
      borkerip: '',
      mnemonic: '',
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    this.props.setShowFab(false)
    this.props.setTitle('Settings')

    const borkerip = await Storage.get<string>('borkerip')

    if (borkerip) {
      this.setState({ borkerip })
    }
  }

  handleIpChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      submitEnabled: true,
      borkerip: e.target.value,
    })
  }

  showMnemonic = async (pin: string) => {
    const { wallet } = await this.props.decryptWallet(pin)
    this.setState({
      mnemonic: wallet.words().join(' '),
    })
    this.props.toggleModal(null)
  }

  saveConfig = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    this.setState({
      submitEnabled: false,
    })
    await Storage.set('borkerip', this.state.borkerip)
    if (!this.state.borkerip) {
      return
    }
    try {
      await this.props.getBalance()
      alert('Success! Happy Borking')
    } catch (err) {
      alert('invalid borker IP')
      await Storage.set('borkerip', { borkerip: '' })
    }
  }

  render () {
    const { submitEnabled, borkerip, mnemonic } = this.state

    return (
      <div className="page-content">
        <form onSubmit={this.saveConfig} className="settings-edit-form">
          <label>Borker IP Address</label>
          <input
            type="text"
            value={borkerip}
            maxLength={40}
            onChange={this.handleIpChange}
          />
          <input
            type="submit"
            className="small-button"
            value="Save"
            disabled={!submitEnabled}
          />
        </form>
        <div style={{ marginBottom: '40px' }}>
          <button
            className="standard-button"
            onClick={() => this.props.toggleModal(<ChangePinModal />)}
          >
            Change Pin
          </button>
        </div>
        <div style={{ marginBottom: '40px' }}>
          {!mnemonic && (
            <button
              className="standard-button"
              onClick={() =>
                this.props.toggleModal(
                  <PinModal usePinFn={this.showMnemonic} />,
                )
              }
            >
              View Recovery Phrase
            </button>
          )}
          {mnemonic && <p>{mnemonic}</p>}
        </div>
        <button
          className="small-button"
          style={{ color: 'red' }}
          onClick={this.props.logout}
        >
          Logout
        </button>
      </div>
    )
  }
}

export default withAuthContext(SettingsPage)
