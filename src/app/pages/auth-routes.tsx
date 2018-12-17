import React from 'react'
import { Switch, Redirect, Route } from "react-router-dom"
import Sidebar, { SidebarProps } from "react-sidebar"
import SidebarContent from '../components/sidebar-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import PostsPage from './posts/posts'
import WalletPage from './wallet/wallet'
import SettingsPage from './settings/settings'
import ProfilePage from './profile/profile'

export interface AuthRoutesProps {
  address: string
  logout: () => Promise<void>
}

export interface AuthRoutesState {
  address: string
  title: string
  sidebarOpen: boolean
  sidebarDocked: boolean
}

const styles = {
  header: {
    backgroundColor: "gray",
    color: "white",
    padding: "16px",
    fontSize: "1.6em",
    fontWeight: "bold" as "bold"
  },
  sidebar: {
    sidebar: {
      overflowY: "hidden"
    }
  }
}

const mql = window.matchMedia(`(min-width: 800px)`)

class AuthRoutes extends React.Component<AuthRoutesProps, AuthRoutesState> {

  constructor(props: AuthRoutesProps) {
    super(props)
    this.state = {
      address: props.address,
      title: '',
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    }
    this._mediaQueryChanged = this._mediaQueryChanged.bind(this)
    this._onSetSidebarOpen = this._onSetSidebarOpen.bind(this)
    this._toggleSidebar = this._toggleSidebar.bind(this)
    this.setTitle = this.setTitle.bind(this)
  }

  componentWillMount() {
    mql.addListener(this._mediaQueryChanged)
  }

  componentWillUnmount() {
    mql.removeListener(this._mediaQueryChanged)
  }

  _mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  _onSetSidebarOpen(open: boolean) {
    this.setState({ sidebarOpen: open })
  }

  _toggleSidebar(ev) {
    ev.preventDefault()
    this._onSetSidebarOpen(!this.state.sidebarOpen)
  }

  setTitle(title: string) {
    this.setState({ title })
  }

  render() {
    const { address, logout } = this.props

    const contentHeader = (
      <div>
        {!this.state.sidebarDocked && (
          <a onClick={this._toggleSidebar}><FontAwesomeIcon icon={faBars} /></a>
        )}
        <span style={{ paddingLeft: "12px" }}>{this.state.title}</span>
      </div>
    )

    const sidebarProps: SidebarProps = {
      sidebar: <SidebarContent
        address={address}
        toggleSidebar={this._toggleSidebar}
      />,
      docked: this.state.sidebarDocked,
      open: this.state.sidebarOpen,
      onSetOpen: this._onSetSidebarOpen,
      styles: styles.sidebar
    }

    return (
      <Sidebar {...sidebarProps}>
        <div style={styles.header}>
          {contentHeader}
        </div>
        <Switch>
          <Route
            exact
            path="/posts"
            render={props => <PostsPage {...props} address={address} setTitle={this.setTitle} />}
          />
          <Route
            exact
            path="/wallet"
            render={props => <WalletPage {...props} address={address} setTitle={this.setTitle} />}
          />
          <Route
            exact
            path="/settings"
            render={props => <SettingsPage {...props} logout={logout} setTitle={this.setTitle} />}
          />
          <Route
            exact
            path="/profile/:id"
            render={props => <ProfilePage {...props} address={address} setTitle={this.setTitle} />}
          />
          <Redirect to="/posts" />
        </Switch>
      </Sidebar>
    )
  }
}

export default AuthRoutes
