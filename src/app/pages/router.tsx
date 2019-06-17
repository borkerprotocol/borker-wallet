import React from 'react'
import { useAppState } from '../globalState'
import UnauthRoutes from './unauth-routes'
import AuthRoutes from './auth-routes'

export default function Router() {
  const { address } = useAppState()
  return address ? <AuthRoutes /> : <UnauthRoutes />
}
