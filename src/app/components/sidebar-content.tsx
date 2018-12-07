import React from 'react'
import { Link } from "react-router-dom"
import { User } from '../../types/types'
import * as Storage from 'idb-keyval'

export interface SidebarContentProps {
  address: string
  toggleSidebar: (ev: any) => void
}

export interface SidebarContentState {
  address: string
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
    this.state = {
      address: props.address
    }
  }

  render() {
    const { address } = this.state
    return (
      <div style={styles.content}>
        <span onClick={this.props.toggleSidebar}>
          <Link
            to={`/profile/${address}`}
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
            to={`/wallet`}
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
