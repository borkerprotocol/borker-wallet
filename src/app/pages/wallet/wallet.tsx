import React, { useEffect } from 'react'
import DepositModal from '../../components/modals/deposit-modal/deposit-modal'
import WithdrawalModal from '../../components/modals/withdrawal-modal/withdrawal-modal'
import { useAppActions, useAppState, useAuthState, useAuthActions } from '../../globalState'

import '../../App.scss'
import './wallet.scss'

export default function WalletPage() {
  const { wallet } = useAppState()
  const { decryptWallet, toggleModal } = useAppActions()
  const { balance } = useAuthState()
  const { setShowFab, setTitle, getBalance } = useAuthActions()

  useEffect(() => {
    setShowFab(false)
    setTitle('Wallet')
    getBalance()
  }, [setShowFab, setTitle, getBalance])

  return (
    <div className="page-content">
      <div className="wallet-balance">
        <h1>{balance.dividedBy(100000000).toFormat(8)}</h1>
      </div>
      <table className="wallet-buttons">
        <tbody>
          <tr>
            <td>
              <button onClick={() => toggleModal(<DepositModal />)}>Deposit</button>
            </td>
            <td>
              <button
                onClick={() =>
                  toggleModal(
                    <WithdrawalModal
                      balance={balance}
                      wallet={wallet}
                      decryptWallet={decryptWallet}
                    />,
                  )
                }
              >
                Withdrawal
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
