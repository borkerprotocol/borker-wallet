import React, { useState } from 'react'
import QRCode from 'qrcode.react'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useAppState } from '../../../globalState'

import '../../../App.scss'
import './deposit-modal.scss'

export default function DepositModal() {
  const [isCopied, setIsCopied] = useState(false)
  const { address } = useAppState()

  const copyToClipboard = () => {
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 1000)
  }

  return (
    <div className="deposit-modal">
      <p>
        <b>Deposit Dogecoin</b>
      </p>
      <QRCode value={address} renderAs="svg" />
      <br />
      <br />
      <p className="deposit-modal-address">{address}</p>
      <CopyToClipboard text={address}>
        <button onClick={copyToClipboard}>Copy</button>
      </CopyToClipboard>
      {isCopied && <p style={{ color: 'green' }}>Copied to Clipboard!</p>}
    </div>
  )
}
