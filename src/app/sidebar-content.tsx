import React from 'react'
import { Link } from "react-router-dom"
import { User } from '../types/types'
import * as Storage from 'idb-keyval'

export interface SidebarContentProps {
  toggleSidebar: (ev: any) => void
}

export interface SidebarContentState {
  user?: User
}

const styles = {
  content: {
    width: 220,
    height: "100%",
    padding: "16px",
    backgroundColor: "white"
  },
  link: {
    fontSize: "1.6rem",
    display: "block",
    padding: "12px",
    color: "gray",
    textDecoration: "none"
  }
}

class SidebarContent extends React.Component<SidebarContentProps, SidebarContentState> {

  constructor(props: SidebarContentProps) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    this.setState({ user: await Storage.get('user') as User })
  }

  render() {
    return (
      <div style={styles.content}>
        <span onClick={this.props.toggleSidebar}>
          <Link
            to={`/profile/${this.state.user ? this.state.user.address : 'create'}`}
            style={styles.link}
          >
            Profile
          </Link>
        </span>
        <span onClick={this.props.toggleSidebar}>
          <Link to="/posts" style={styles.link}>Posts</Link>
        </span>
        <span onClick={this.props.toggleSidebar}>
        <Link
            to={`/wallet/${this.state.user ? this.state.user.address : ''}`}
            style={styles.link}
          >
            Wallet
          </Link>
        </span>
        <span onClick={this.props.toggleSidebar}>
          <Link to="/settings" style={styles.link}>Settings</Link>
        </span>
      </div>
    )
  }
}

export default SidebarContent
