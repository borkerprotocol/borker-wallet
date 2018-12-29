import React from 'react'
import { Switch, Redirect, Route, Link } from "react-router-dom"
import Sidebar, { SidebarProps } from "react-sidebar"
import SidebarContent from '../components/sidebar-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { faDog } from '@fortawesome/free-solid-svg-icons'
import PostsPage from './posts/posts-routes'
import WalletPage from './wallet/wallet'
import SettingsPage from './settings/settings'
import ProfileRoutes from './profile/profile-routes'
import { AuthContext } from '../contexts/auth-context'

export interface AuthRoutesState {
  title: string
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

  constructor (props: {}) {
    super(props)
    this.state = {
      title: '',
      showFab: false,
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    }
    this._mediaQueryChanged = this._mediaQueryChanged.bind(this)
    this._onSetSidebarOpen = this._onSetSidebarOpen.bind(this)
  }

  componentDidMount () {
    mql.addListener(this._mediaQueryChanged)
  }

  componentWillUnmount () {
    mql.removeListener(this._mediaQueryChanged)
  }

  _mediaQueryChanged () {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  _onSetSidebarOpen (open: boolean) {
    this.setState({ sidebarOpen: open })
  }

  toggleSidebar = (e: React.FormEvent) => {
    e.preventDefault()
    this._onSetSidebarOpen(!this.state.sidebarOpen)
  }

  setTitle = (title: string) => {
    this.setState({ title })
  }

  setShowFab = (showFab: boolean) => {
    this.setState({ showFab })
  }

  render () {
    const { title, sidebarDocked, sidebarOpen, showFab } = this.state

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
      onSetOpen: this._onSetSidebarOpen,
      styles: styles.sidebar,
    }

    return (
      <AuthContext.Provider value={{ setTitle: this.setTitle, setShowFab: this.setShowFab }}>
        <Sidebar {...sidebarProps}>
          <div style={styles.header}>
            {contentHeader}
          </div>
          <Switch>
            <Route
              path="/posts"
              component={PostsPage}
            />
            <Route
              path="/profile/:id"
              component={ProfileRoutes}
            />
            <Route
              exact
              path="/settings"
              component={SettingsPage}
            />
            <Route
              exact
              path="/wallet"
              component={WalletPage}
            />
            <Redirect to="/posts" />
          </Switch>
          {showFab &&
            <Link to={`/posts/new`} className="fab"><FontAwesomeIcon icon={faDog} /></Link>
          }
        </Sidebar>
      </AuthContext.Provider>
    )
  }
}

export default AuthRoutes
