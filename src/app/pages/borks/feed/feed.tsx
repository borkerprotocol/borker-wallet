import React, { useState, useEffect } from 'react'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, BorkType } from '../../../../types/types'
import BorkList from '../../../components/bork-list/bork-list'
import WebService from '../../../web-service'
import '../../../App.scss'
import './feed.scss'
import { useAuthActions } from '../../../globalState'

export interface FeedProps extends AuthProps {}

export interface FeedState {
  borks: Bork[]
}

export default function FeedPage() {
  const webService = new WebService()
  const [borks, setBorks] = useState<Bork[]>([])
  const { setTitle, setShowFab } = useAuthActions()

  useEffect(() => {
    let fetching = true
    setTitle('Feed')
    setShowFab(true)

    webService
      .getBorks({
        filterFollowing: true,
        types: [BorkType.Bork, BorkType.Rebork, BorkType.Comment, BorkType.Like],
      })
      .then(fetchedBorks => {
        if (fetching) {
          setBorks(fetchedBorks || [])
        }
      })

    return () => {
      fetching = false
    }
  }, [])

  if (!borks.length) return null

  return <BorkList borks={borks} />
}
