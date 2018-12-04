import React from 'react'
import { Link } from "react-router-dom"
import { User } from '../types/types';

export interface SidebarContentProps {
  user?: User
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
    console.log(props)
    this.state = {
      user: props.user
    }
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
          <Link to="/borks" style={styles.link}>Borks</Link>
        </span>
        <span onClick={this.props.toggleSidebar}>
          <Link to="/wallet" style={styles.link}>Wallet</Link>
        </span>
        <span onClick={this.props.toggleSidebar}>
          <Link to="/settings" style={styles.link}>Settings</Link>
        </span>
      </div>
    )
  }
}

export default SidebarContent
