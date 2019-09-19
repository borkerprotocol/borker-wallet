import React from 'react'
import { UnauthProps, withUnauthContext } from '../../contexts/unauth-context'
// import { sampleWords } from '../../../util/mocks'
import '../../App.scss'
import './wallet-recover.scss'

export interface WalletRecoverProps extends UnauthProps { }

export interface WalletRecoverState {
  mnemonic: string
  isMnemonicEntered: boolean
}

class WalletRecoverPage extends React.Component<WalletRecoverProps, WalletRecoverState> {

  state = {
    mnemonic: '',
    isMnemonicEntered: false,
  }

  handleMnemonicChange = (e: React.BaseSyntheticEvent) => {
    this.setState({
      mnemonic: e.target.value,
      isMnemonicEntered: e.target.value.trim().replace(/ +/g, " ").split(' ').length === 12,
    })
  }

  genWallet = async (e: React.BaseSyntheticEvent) => {
    const borkerLib = await import('borker-rs-browser')
    const wallet = new borkerLib.JsWallet(this.state.mnemonic.trim().replace(/ +/g, " ").toLowerCase().split(' '))
    await this.props.login(wallet)
  }

  render () {
    const { isMnemonicEntered, mnemonic } = this.state

    return (
      <div className="page-content">
        <p>Type your 12 word recovery phrase, separted with spaces as shown below</p>
        <textarea
          placeholder="word1 word2 word3"
          value={mnemonic}
          onChange={this.handleMnemonicChange}
          className="textarea"
        />
        <button className="standard-button" onClick={this.genWallet} disabled={!isMnemonicEntered}>
          Recover
        </button>
      </div>
    )
  }
}

export default withUnauthContext(WalletRecoverPage)
