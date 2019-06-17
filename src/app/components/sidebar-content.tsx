import React from 'react'
import { Link } from 'react-router-dom'
import { useAuthActions, useAppState } from '../globalState'

const styles = {
  content: {
    width: 220,
    height: '100%',
    padding: '16px',
    backgroundColor: 'white',
  },
  link: {
    fontSize: '1.6rem',
    display: 'block',
    padding: '12px',
    color: 'gray',
    textDecoration: 'none',
  },
}

function SidebarContent() {
  const { address } = useAppState()
  const { toggleSidebar } = useAuthActions()

  return (
    <div style={styles.content}>
      <span onClick={toggleSidebar}>
        <Link to="/borks/feed" style={styles.link}>
          Feed
        </Link>
      </span>
      <span onClick={toggleSidebar}>
        <Link to={`/explore`} style={styles.link}>
          Explore
        </Link>
      </span>
      <span onClick={toggleSidebar}>
        <Link to={`/profile/${address}`} style={styles.link}>
          Profile
        </Link>
      </span>
      <span onClick={toggleSidebar}>
        <Link to={`/wallet`} style={styles.link}>
          Wallet
        </Link>
      </span>
      <span onClick={toggleSidebar}>
        <Link to="/settings" style={styles.link}>
          Settings
        </Link>
      </span>
    </div>
  )
}

export default SidebarContent
