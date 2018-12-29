import React from 'react'
import { Switch, Route, RouteComponentProps } from 'react-router'
import ProfileShowPage from './profile-show/profile-show'
import ProfileEditPage from './profile-edit/profile-edit'
import { User } from '../../../types/types'
import { getUser } from '../../util/mocks'
import '../../App.scss'
import { AuthProps } from '../../contexts/auth-context';

export interface ProfileRoutesParams {
  id: string
}

export interface ProfileRoutesProps extends RouteComponentProps<ProfileRoutesParams> {}

export interface ProfileRoutesState {
  user: User | null
}

class ProfileRoutes extends React.Component<ProfileRoutesProps, ProfileRoutesState> {

  constructor (props: ProfileRoutesProps) {
    super(props)
    this.state = {
      user: null,
    }
  }

  async componentDidMount () {
    this.setState({ user: await getUser(this.props.match.params.id) })
  }

  async componentWillReceiveProps (nextProps: ProfileRoutesProps) {
    const oldAddress = this.props.match.params.id
    const newAddress = nextProps.match.params.id

    if (oldAddress !== newAddress) {
      this.setState({
        user: await getUser(newAddress),
      })
    }
  }

  render () {
    const { user } = this.state

    return !user ? (
      null
    ) : (
      <Switch>
        <Route
          exact
          path="/profile/:id"
          render={props => <ProfileShowPage {...props} user={user} />}
        />
        <Route
          exact
          path="/profile/:id/edit"
          render={props => <ProfileEditPage {...props} user={user} />}
        />
      </Switch>
    )
  }
}

export default ProfileRoutes
