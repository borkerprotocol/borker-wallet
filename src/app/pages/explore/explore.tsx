import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { AuthProps, withAuthContext } from '../../contexts/auth-context'
import { User, OrderBy } from '../../../types/types'
import WebService from '../../web-service'
import defaultAvatar from '../../../assets/default-avatar.png'
import FollowButton from '../../components/follow-button/follow-button'
import '../user-list/user-list.scss'
import { useAuthActions } from '../../globalState'

export interface UserListProps extends AuthProps {}

export interface UserListState {
  order: OrderBy<User>
  users: User[]
}

export default function ExplorePage() {
  const webService = new WebService()
  const [users, setUsers] = useState<User[]>([])
  const [order, setOrder] = useState<OrderBy<User>>({ birthBlock: 'ASC' })

  const { setShowFab, setTitle, getBalance } = useAuthActions()

  useEffect(() => {
    setTitle('Explore')
    setShowFab(false)
  }, [])

  useEffect(() => {
    let fetching = true
    webService.getUsers(order).then(users => {
      if (fetching) {
        setUsers(users)
      }
    })
    return () => {
      fetching = false
    }
  }, [])

  if (users && !users.length) {
    return null
  }
  return (
    <ul className="user-list">
      {(users || []).map(user => {
        return (
          <li key={user.address}>
            <div className="user-item">
              <div className="user-item-follow">
                <FollowButton user={user} />
              </div>
              <Link to={`/profile/${user.address}`} style={{ textDecoration: 'none' }}>
                <img
                  src={user.avatarLink || defaultAvatar}
                  className="user-item-avatar"
                  alt="avatar"
                />
                <span style={{ fontWeight: 'bold', color: 'black' }}>{user.name}</span>
                <br />
                <span style={{ color: 'gray' }}>@{user.address.substring(0, 9)}</span>
                <br />
                <p style={{ marginLeft: 64, color: 'black' }}>{user.bio}</p>
              </Link>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
