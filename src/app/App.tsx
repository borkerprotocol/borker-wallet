import React from 'react'
import Sidebar, { SidebarProps } from "react-sidebar"
import { BrowserRouter as Router, Route, Link } from "react-router-dom"
import './App.css'
import Posts from './posts/posts'
import Wallet from './wallet/wallet'
import Settings from './settings/settings'
import SidebarContent from './sidebar-content/sidebar-content';

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
  content: {
    padding: "16px"
  },
  root: {
    fontFamily:
      '"HelveticaNeue-Light", "Helvetica Neue Light", "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif',
    fontWeight: 300
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
    const routes = [
      {
        path: "/posts",
        exact: true,
        title: () => contentHeader('Posts'),
        body: () => <Posts />
      },
      {
        path: "/wallet",
        exact: true,
        title: () => contentHeader('Wallet'),
        body: () => <Wallet />
      },
      {
        path: "/settings",
        exact: true,
        title: () => contentHeader('Settings'),
        body: () => <Settings />
      }
    ]

    const contentHeader = (title: string) => (
      <span>
        {!this.state.sidebarDocked && (
          <a
            href="#"
            onClick={this.toggleSidebar}
            style={styles.contentHeaderMenuLink}
          >
            =
          </a>
        )}
        <span>{title}</span>
      </span>
    )

    const sidebarProps: SidebarProps = {
      sidebar: <SidebarContent toggleSidebar={this.toggleSidebar} />,
      docked: this.state.sidebarDocked,
      open: this.state.sidebarOpen,
      onSetOpen: this.onSetSidebarOpen,
      styles: styles.sidebar
    }

    return (
      <Router>
        <Sidebar {...sidebarProps}>
          <div style={styles.root}>
            <div style={styles.header}>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  component={route.title}
                />
              ))}
            </div>
          </div>
          <div style={styles.content}>
            {routes.map((route, index) => (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.body}
              />
            ))}
          </div>
        </Sidebar>
      </Router>
    )
  }
}

export default App
