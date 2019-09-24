import React from 'react'
import { Switch, Redirect, Route, Link } from "react-router-dom"
import Sidebar, { SidebarProps } from "react-sidebar"
import SidebarContent from '../components/sidebar-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import BorksRoutes from './borks/bork-routes'
import BorkersPage from './borkers/borkers'
import WalletPage from './wallet/wallet'
import SettingsPage from './settings/settings'
import ProfileRoutes from './profile/profile-routes'
import { AuthContext } from '../contexts/auth-context'
import borkButton from '../../assets/bork-button.png'
import BigNumber from 'bignumber.js'
import WebService from '../web-service'
import { withAppContext, AppProps } from '../contexts/app-context'
import { BorkType } from '../../types/types'
import { JsWallet } from 'borker-rs-browser'
import PinModal from '../components/modals/pin-modal/pin-modal'
import Modal from '../components/modals/modal'

export interface AuthRoutesState {
  title: string
  balance: BigNumber
  showFab: boolean
  sidebarOpen: boolean
  sidebarDocked: boolean
  modalContent: JSX.Element | null
}

export interface Parent {
  txid: string
  senderAddress: string
}

const styles = {
  header: {
    backgroundColor: "gray",
    color: "white",
    padding: "16px",
    fontSize: "1.6em",
    fontWeight: "bold" as "bold",
    position: "sticky" as "sticky",
    top: 0,
    zIndex: 1,
  },
  sidebar: {
    sidebar: {
      overflowY: "hidden",
    },
  },
}

const mql = window.matchMedia(`(min-width: 800px)`)

class AuthRoutes extends React.Component<AppProps, AuthRoutesState> {
  public webService: WebService

  constructor (props: AppProps) {
    super(props)
    this.state = {
      title: '',
      balance: new BigNumber(0),
      showFab: false,
      sidebarDocked: mql.matches,
      sidebarOpen: false,
      modalContent: null,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    mql.addListener(this.mediaQueryChanged)
  }

  componentWillUnmount () {
    mql.removeListener(this.mediaQueryChanged)
  }

  mediaQueryChanged = () => {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  onSetSidebarOpen = (open: boolean) => {
    this.setState({ sidebarOpen: open })
  }

  toggleSidebar = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    e.preventDefault()
    this.onSetSidebarOpen(!this.state.sidebarOpen)
  }

  getBalance = async () => {
    this.setState({
      balance: await this.webService.getBalance(this.props.address),
    })
  }

  setTitle = (title: string) => {
    this.setState({ title })
  }

  setShowFab = (showFab: boolean) => {
    this.setState({ showFab })
  }

  signAndBroadcast = async (
    type: BorkType,
    txCount?: number,
    content?: string,
    parent?: Parent,
    tip?: BigNumber,
  ): Promise<void> => {

    if (!this.props.wallet) {
      let wallet: JsWallet
      try {
        wallet = await this.props.decryptWallet('')
        await this.props.login(wallet)
      } catch (e) {
        this.toggleModal(<PinModal callback={this.signAndBroadcast} />)
        return
      }
    }

    const borkerLib = await import('borker-rs-browser')

    const feePerTx = new BigNumber(100000000)
    const totalFee = feePerTx.times(txCount || 1)
    const totalCost = totalFee.plus(tip || 0)

    const ret_utxos = await this.webService.getUtxos(totalCost)
    const utxos = ret_utxos.filter(u => !(window.sessionStorage.getItem('usedUTXOs') || '').includes(`${u.txid}-${u.position}`))

    // set referenceId based on type
    let referenceId = ''
    if (parent) {
      if ([BorkType.Comment, BorkType.Rebork, BorkType.Delete, BorkType.Like].includes(type)) {
        referenceId = await this.webService.getReferenceId(parent.txid, parent.senderAddress)
      } else if (type === BorkType.Flag) {
        referenceId = parent.txid
      }
    }
    // construct params for lib
    const data = {
      type,
      content,
      referenceId,
    }
    // inputs
    let inputs = utxos.map(utxo => utxo.raw)
    if (inputs.length === 0) {
      const last = window.sessionStorage.getItem('lastTransaction')
      inputs = last ? [last.split(':')[1]] : []
    }
    // recipient
    let recipient: { address: string, value: number } | null = null
    if ([BorkType.Comment, BorkType.Rebork, BorkType.Like].includes(type)) {
      if (!parent) { throw new Error('missing parent') }
      if (!tip) { throw new Error('missing tip') }
      recipient = { address: parent.senderAddress, value: tip.toNumber() }
    }

    const childWallet = this.props.getChild(this.props.wallet!)
    const rawTxs = childWallet.newBork(data, inputs, recipient, [], feePerTx.toNumber(), borkerLib.Network.Dogecoin)
    // broadcast
    console.log('boradcasting:', rawTxs)
    // let res = await this.webService.broadcastTx(rawTxs)
    // window.sessionStorage.setItem('usedUTXOs', ret_utxos.map(u => `${u.txid}-${u.position}`) + ',' + (window.sessionStorage.getItem('lastTransaction') || '').split(':')[0])
    // window.sessionStorage.setItem('lastTransaction', `${res[res.length - 1]}-0:${rawTxs[rawTxs.length - 1]}`)
  }

  toggleModal = (modalContent: JSX.Element | null) => {
    this.setState({ modalContent })
  }

  render () {
    const { title, balance, sidebarDocked, sidebarOpen, showFab, modalContent } = this.state

    const contentHeader = (
      <div>
        {!sidebarDocked && (
          <a onClick={this.toggleSidebar}><FontAwesomeIcon icon={faBars} /></a>
        )}
        <span style={{ paddingLeft: "12px" }}>{title}</span>
      </div>
    )

    const sidebarProps: SidebarProps = {
      sidebar: <SidebarContent
        toggleSidebar={this.toggleSidebar}
      />,
      docked: sidebarDocked,
      open: sidebarOpen,
      onSetOpen: this.onSetSidebarOpen,
      styles: styles.sidebar,
    }

    return (
      <AuthContext.Provider value={{
        setTitle: this.setTitle,
        setShowFab: this.setShowFab,
        getBalance: this.getBalance,
        signAndBroadcast: this.signAndBroadcast,
        toggleModal: this.toggleModal,
        balance,
      }}>
        <Sidebar {...sidebarProps}>
          <div style={styles.header}>
            {contentHeader}
          </div>
          <Switch>
            <Route
              path="/borks"
              component={BorksRoutes}
            />
            <Route
              exact
              path="/borkers"
              component={BorkersPage}
            />
            <Route
              path="/profile/:address"
              component={ProfileRoutes}
            />
            <Route
              exact
              path="/wallet"
              component={WalletPage}
            />
            <Route
              exact
              path="/settings"
              component={SettingsPage}
            />
            <Redirect to="/borks" />
          </Switch>
          {showFab &&
            <Link to={`/borks/new`} className="fab">
              <img src={borkButton} />
            </Link>
          }
        </Sidebar>
        <Modal content={modalContent}/>
      </AuthContext.Provider>
    )
  }
}

export default withAppContext(AuthRoutes)
