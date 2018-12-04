import React from 'react'
import Sidebar, { SidebarProps } from "react-sidebar"
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import BorksPage from './pages/borks/borks'
import ProfilePage from './pages/profile/profile'
import WalletPage from './pages/wallet/wallet'
import SettingsPage from './pages/settings/settings'
import SidebarContent from './sidebar-content'
import { User } from '../types/types';
import './App.css'
import { getUser, sampleUsers } from './util/mocks';

const mql = window.matchMedia(`(min-width: 800px)`)

export interface AppProps {}

export interface AppState {
  user?: User
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
      user: sampleUsers[0],
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
        <span>Borker!</span>
      </div>
    )

    const sidebarProps: SidebarProps = {
      sidebar: <SidebarContent
        user={this.state.user}
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
            <Route exact path="/" render={() => <Redirect to="/borks" />} />
            <Route path="/borks" component={BorksPage} />
            <Route path="/wallet" component={WalletPage} />
            <Route path="/settings" component={SettingsPage} />
            <Route exact path="/profile/:address" component={ProfilePage} />
          </Switch>
        </Sidebar>
      </Router>
    )
  }
}

export default App
