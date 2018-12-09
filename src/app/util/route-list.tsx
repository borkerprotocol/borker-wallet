import PostsPage from '../pages/posts/posts'
import ProfilePage from '../pages/profile/profile'
import WalletPage from '../pages/wallet/wallet'
import WalletCreatePage from '../pages/wallet-create/wallet-create'
import WalletRestorePage from '../pages/wallet-restore/wallet-restore'
import SettingsPage from '../pages/settings/settings'
import HomePage from '../pages/home/home'

export const authenticatedRoutes = [
  {
    path: "/posts",
    title: "Posts",
    component: PostsPage
  },
  {
    path: "/wallet",
    title: "Wallet",
    component: WalletPage
  },
  {
    path: "/settings",
    title: "Settings",
    component: SettingsPage
  },
  {
    path: "/profile/:address",
    title: "Profile",
    component: ProfilePage
  },
]

export const unauthenticatedRoutes = [
  {
    path: "/",
    component: HomePage,
    allowAuthenticated: false
  },
  {
    path: "/create",
    component: WalletCreatePage,
    allowAuthenticated: false
  },
  {
    path: "/restore",
    component: WalletRestorePage,
    allowAuthenticated: false
  }
]