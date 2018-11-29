import React from 'react'
import Sidebar, { SidebarProps } from "react-sidebar"
import logo from '../assets/logo.svg'
import './App.css'
import SidebarContent from "./sidebar-content"

const mql = window.matchMedia(`(min-width: 800px)`);

export interface AppState {
  sidebarOpen: boolean
  sidebarDocked: boolean
  mql
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
    fontSize: "1.5em"
  }
}

class App extends React.Component<{}, AppState> {

  constructor(props) {
    super(props)
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: true,
      mql
    }
    this.mediaQueryChanged = this.mediaQueryChanged.bind(this)
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this)
    this.menuButtonClick = this.menuButtonClick.bind(this)
  }

  async componentWillMount() {
    mql.addListener(this.mediaQueryChanged)
    const borkerLib = await import('borker-rs')
    const wallet = new borkerLib.JsWallet(undefined as any)
    const words = wallet.words()
    console.log(words.join(" "))
  }

  componentWillUnmount() {
    this.state.mql.removeListener(this.mediaQueryChanged)
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false })
  }

  onSetSidebarOpen(open: boolean) {
    this.setState({ sidebarOpen: open })
  }

  menuButtonClick(ev) {
    ev.preventDefault()
    this.onSetSidebarOpen(!this.state.sidebarOpen)
  }

  render() {
    const contentHeader = (
      <span>
        {!this.state.sidebarDocked && (
          <a
            onClick={this.menuButtonClick}
            href="#"
            style={styles.contentHeaderMenuLink}
          >
            =
          </a>
        )}
        <span>Borker</span>
      </span>
    )

    const sidebarProps: SidebarProps = {
      sidebar: <SidebarContent />,
      docked: this.state.sidebarDocked,
      open: this.state.sidebarOpen,
      onSetOpen: this.onSetSidebarOpen,
    }

    return (
      <Sidebar {...sidebarProps}>
        <div style={styles.root}>
          <div style={styles.header}>
            {contentHeader}
          </div>
        </div>
        <div style={styles.content}>
          <p>
            Borker is here!
          </p>
        </div>
      </Sidebar>
    )
  }
}

export default App
