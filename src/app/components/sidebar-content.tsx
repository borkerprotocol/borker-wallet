import React from 'react'
import { Link } from "react-router-dom"
import { withAuthContext, AuthProps } from '../contexts/auth-context'

export interface SidebarContentProps extends AuthProps {
  toggleSidebar: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void
}

const styles = {
  content: {
    width: 220,
    height: "100%",
    padding: "16px",
    backgroundColor: "white",
  },
  link: {
    fontSize: "1.6rem",
    display: "block",
    padding: "12px",
    color: "gray",
    textDecoration: "none",
  },
}

class SidebarContent extends React.Component<SidebarContentProps> {

  render () {
    const { address, toggleSidebar } = this.props
    
    return (
      <div style={styles.content}>
        <span onClick={toggleSidebar}>
          <Link to="/borks/feed" style={styles.link}>Feed</Link>
        </span>
        <span onClick={toggleSidebar}>
          <Link to={`/explore`} style={styles.link}>Explore</Link>
        </span>
        <span onClick={toggleSidebar}>
          <Link to={`/profile/${address}`} style={styles.link}>Profile</Link>
        </span>
        <span onClick={toggleSidebar}>
          <Link to="/settings" style={styles.link}>Settings</Link>
        </span>
      </div>
    )
  }
}

export default withAuthContext(SidebarContent)
