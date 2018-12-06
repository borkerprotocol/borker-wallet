import React from 'react'
import Sidebar, { SidebarProps } from "react-sidebar"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import PostsPage from './pages/posts/posts'
import ProfilePage from './pages/profile/profile'
import WalletPage from './pages/wallet/wallet'
import WalletCreatePage from './pages/wallet-create/wallet-create'
import WalletRestorePage from './pages/wallet-restore/wallet-restore'
import SettingsPage from './pages/settings/settings'
import SidebarContent from './sidebar-content'
import * as Storage from 'idb-keyval'
import './App.css'

const mql = window.matchMedia(`(min-width: 800px)`)

export interface AppProps {}

export interface AppState {
  sidebarOpen: boolean
  sidebarDocked: boolean
}

const styles = {
  contentHeaderMenuLink: {
    textDecoration: "none",
    color: "white",
    padding: 8
  },
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

class App extends React.Component<AppProps, AppState> {

  constructor(props) {
    super(props)
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false,
    }
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this)
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
    this.toggleSidebar = this.toggleSidebar.bind(this)
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged)
  }

  componentDidMount() {
    if (!('indexedDB' in window)) {
      alert('This browser doesn\'t support IndexedDB')
      return
    }
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged)
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  onSetSidebarOpen(open: boolean) {
    this.setState({ sidebarOpen: open })
  }

  toggleSidebar(ev) {
    ev.preventDefault()
    this.onSetSidebarOpen(!this.state.sidebarOpen)
  }

  async _logout() {
    await Storage.clear()
  }

  render() {
    const contentHeader = (
      <div>
        {!this.state.sidebarDocked && (
          <a
            onClick={this.toggleSidebar}
            style={styles.contentHeaderMenuLink}
          >
            =
          </a>
        )}
        <button onClick={this._logout} className="logout-button">Logout</button>
      </div>
    )

    const sidebarProps: SidebarProps = {
      sidebar: <SidebarContent
        toggleSidebar={this.toggleSidebar}
      />,
      docked: this.state.sidebarDocked,
      open: this.state.sidebarOpen,
      onSetOpen: this.onSetSidebarOpen,
      styles: styles.sidebar
    }

    return (
      <Router>
        <Sidebar {...sidebarProps}>
          <div style={styles.header}>
            {contentHeader}
          </div>
          <Switch>
            <Route exact path="/" render={() => <Redirect to="/posts" />} />
            <Route path="/posts" component={PostsPage} />
            <Route exact path="/wallet" component={WalletPage} />
            <Route exact path="/wallet/create" component={WalletCreatePage} />
            <Route exact path="/wallet/restore" component={WalletRestorePage} />
            <Route exact path="/wallet/:address" component={WalletPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route exact path="/profile/:address" component={ProfilePage} />
          </Switch>
        </Sidebar>
      </Router>
    )
  }
}

export default App
