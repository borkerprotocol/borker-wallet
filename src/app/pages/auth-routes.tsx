import React from 'react'
import { Switch, Redirect, Route, Link } from 'react-router-dom'
import Sidebar, { SidebarProps } from 'react-sidebar'
import SidebarContent from '../components/sidebar-content'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import BorksRoutes from './borks/bork-routes'
import ExplorePage from './explore/explore'
import WalletPage from './wallet/wallet'
import SettingsPage from './settings/settings'
import ProfileRoutes from './profile/profile-routes'
import borkButton from '../../assets/bork-button.png'
import { useAuthState, useAuthActions } from '../globalState'

const styles = {
  header: {
    backgroundColor: 'gray',
    color: 'white',
    padding: '16px',
    fontSize: '1.6em',
    fontWeight: 'bold' as 'bold',
  },
  sidebar: {
    sidebar: {
      overflowY: 'hidden',
    },
  },
}

export default function AuthRoutes() {
  const { sidebarDocked, balance, title, sidebarOpen, showFab } = useAuthState()
  const { toggleSidebar, setSidebarOpen } = useAuthActions()

  const contentHeader = (
    <div>
      {!sidebarDocked && (
        <a onClick={toggleSidebar}>
          <FontAwesomeIcon icon={faBars} />
        </a>
      )}
      <span style={{ paddingLeft: '12px' }}>{title}</span>
    </div>
  )

  const sidebarProps: SidebarProps = {
    sidebar: <SidebarContent />,
    docked: sidebarDocked,
    open: sidebarOpen,
    onSetOpen: setSidebarOpen,
    styles: styles.sidebar,
  }

  return (
    <Sidebar {...sidebarProps}>
      <div style={styles.header}>{contentHeader}</div>
      <Switch>
        <Route path="/borks" component={BorksRoutes} />
        <Route exact path="/explore" component={ExplorePage} />
        <Route path="/profile/:address" component={ProfileRoutes} />
        <Route exact path="/wallet" component={WalletPage} />
        <Route exact path="/settings" component={SettingsPage} />
        <Redirect to="/borks" />
      </Switch>
      {showFab && (
        <Link to={`/borks/new`} className="fab">
          <img src={borkButton} />
        </Link>
      )}
    </Sidebar>
  )
}
