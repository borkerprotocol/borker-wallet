import React from 'react'
import { Switch, Redirect, Route, Link } from "react-router-dom"
import Sidebar, { SidebarProps } from "react-sidebar"
import SidebarContent from '../components/sidebar-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import BorksRoutes from './borks/bork-routes'
import ExplorePage from './explore/explore'
import WalletPage from './wallet/wallet'
import SettingsPage from './settings/settings'
import ProfileRoutes from './profile/profile-routes'
import { AuthContext } from '../contexts/auth-context'
import borkButton from '../../assets/bork-button.png'
import BigNumber from 'bignumber.js'
import WebService from '../web-service'

export interface AuthRoutesState {
  title: string
  balance: BigNumber
  showFab: boolean
  sidebarOpen: boolean
  sidebarDocked: boolean
}

const styles = {
  header: {
    backgroundColor: "gray",
    color: "white",
    padding: "16px",
    fontSize: "1.6em",
    fontWeight: "bold" as "bold",
  },
  sidebar: {
    sidebar: {
      overflowY: "hidden",
    },
  },
}

const mql = window.matchMedia(`(min-width: 800px)`)

class AuthRoutes extends React.Component<{}, AuthRoutesState> {
  public webService: WebService

  constructor (props: {}) {
    super(props)
    this.state = {
      title: '',
      balance: new BigNumber(0),
      showFab: false,
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    }
    this.webService = new WebService()
  }

  async componentDidMount () {
    mql.addListener(this.mediaQueryChanged)

    this.setState({
      balance: await this.webService.getBalance(),
    })
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

  setTitle = (title: string) => {
    this.setState({ title })
  }

  setShowFab = (showFab: boolean) => {
    this.setState({ showFab })
  }

  render () {
    const { title, balance, sidebarDocked, sidebarOpen, showFab } = this.state

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
              path="/explore"
              component={ExplorePage}
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
      </AuthContext.Provider>
    )
  }
}

export default AuthRoutes
