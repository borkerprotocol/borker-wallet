import React from 'react'
import { Redirect } from 'react-router'
import Modal from 'react-modal'
import * as CryptoJS from 'crypto-js'
import { JsWallet } from 'borker-rs'
import * as Storage from 'idb-keyval'
import '../../App.scss'
import './encrypt-modal.scss'

export interface EncryptModalProps {
  isOpen: boolean
  wallet: JsWallet
  toggleModal: (e: any) => void
  login: (address: string) => Promise<void>
}

export interface EncryptModalState {
  isOpen: boolean
  password: string
  isSaved: boolean
}

const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-40%',
    transform: 'translate(-50%, -50%)',
  },
}

class EncryptModal extends React.Component<EncryptModalProps, EncryptModalState> {

  constructor (props: EncryptModalProps) {
    super(props)
    this.state = {
      isOpen: props.isOpen,
      password: '',
      isSaved: false,
    }
    this._handlePasswordChange = this._handlePasswordChange.bind(this)
    this._saveWallet = this._saveWallet.bind(this)
  }

  async _saveWallet (e: any): Promise<void> {
    e.preventDefault()
    const { wallet } = this.props

    const borkerLib = await import('borker-rs')

    const address = wallet.childAt([-44, -0, -0, 0, 0]).address(borkerLib.Network.Dogecoin)
    const encrypted = CryptoJS.AES.encrypt(Buffer.from(wallet.toBuffer()).toString('hex'), this.state.password).toString()

    await Promise.all([
      Storage.set('wallet', encrypted),
      Storage.set('address', address),
    ])

    // baseline values
    console.log(wallet.words())
    console.log('buffer', wallet.toBuffer())
    console.log('string buffer', wallet.toBuffer().toString())
    // recovered values
    const decrypted = CryptoJS.AES.decrypt(encrypted, this.state.password).toString(CryptoJS.enc.Utf8)
    console.log('words', borkerLib.JsWallet.fromBuffer(new Uint8Array(Buffer.from(decrypted, 'hex'))).words())

    this.props.login(address)
  }

  _handlePasswordChange (e: any) {
    this.setState({ password: e.target.value })
  }

  render () {
    const { isOpen, toggleModal } = this.props
    const { password, isSaved } = this.state

    if (isSaved) {
      return <Redirect to="/posts" />
    }
    return (
      <Modal
        ariaHideApp={false}
        isOpen={isOpen}
        style={modalStyles}
      >
        <button onClick={toggleModal}>x</button>
        <form onSubmit={this._saveWallet} className="password-form">
          <p>Please enter a password to encrypt your mnemonic phrase on this device.</p>
          <input type="password" value={password} onChange={this._handlePasswordChange} />
          <input type="submit" value="Save" />
        </form>
      </Modal>
    )
  }
}

export default EncryptModal

/*
wordArray: { words: [..], sigBytes: words.length * 4 }
*/

// assumes wordArray is Big-Endian (because it comes from CryptoJS which is all BE)
// From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
function convertWordArrayToUint8Array (wordArray: CryptoJS.LibWordArray) {
	var len = wordArray.words.length,
		u8_array = new Uint8Array(len << 2),
		offset = 0, word, i
	;
	for (i=0; i<len; i++) {
		word = wordArray.words[i];
		u8_array[offset++] = word >> 24;
		u8_array[offset++] = (word >> 16) & 0xff;
		u8_array[offset++] = (word >> 8) & 0xff;
		u8_array[offset++] = word & 0xff;
	}
	return u8_array;
}

// create a wordArray that is Big-Endian (because it's used with CryptoJS which is all BE)
// From: https://gist.github.com/creationix/07856504cf4d5cede5f9#file-encode-js
function convertUint8ArrayToWordArray (u8Array: Uint8Array): CryptoJS.LibWordArray {
	var words = [], i = 0, len = u8Array.length;

	while (i < len) {
		words.push(
			(u8Array[i++] << 24) |
			(u8Array[i++] << 16) |
			(u8Array[i++] << 8)  |
			(u8Array[i++]),
		);
	}

	return {
		sigBytes: words.length * 4,
		words: words,
	};
}
