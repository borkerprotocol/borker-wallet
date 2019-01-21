import React from 'react'
import { Link } from "react-router-dom"
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import { AuthProps, withAuthContext } from '../../../contexts/auth-context'
import { Bork, User, BorkType } from '../../../../types/types'
import WebService from '../../../web-service'
import BorkList from '../../../components/bork-list/bork-list'
import CheckoutModal from '../../../components/modals/checkout-modal/checkout-modal'
import { calendar } from '../../../util/timestamps'
import { avatar1 } from '../../../util/avatars'
import 'react-tabs/style/react-tabs.scss'
import './profile-show.scss'
import '../../../App.scss'

export interface ProfileShowProps extends AuthProps {
  user: User
}

export interface ProfileShowState {
  loading: boolean
  borks: Bork[]
  likes: Bork[]
  profileUpdates: Bork[]
}

class ProfileShowPage extends React.Component<ProfileShowProps, ProfileShowState> {
  public webService: WebService

  constructor (props: ProfileShowProps) {
    super(props)
    this.state = {
      loading: true,
      borks: [],
      likes: [],
      profileUpdates: [],
    }
    this.webService = new WebService(props.address)
  }

  async componentDidMount () {
    this.props.setTitle('Profile')
    this.props.setShowFab(true)

    this.getUserData(this.props.user.address)
  }

  async componentWillReceiveProps (nextProps: ProfileShowProps) {
    const oldAddress = this.props.user.address
    const newAddress = nextProps.user.address

    if (oldAddress !== newAddress) {
      this.setState({ loading: true })
      this.getUserData(newAddress)
    }
  }

  getUserData = async (senderAddress: string) => {
    const [ borks, likes, profileUpdates ] = await Promise.all([
      this.webService.getBorks({
        senderAddress,
        types: [BorkType.bork, BorkType.rebork],
      }),
      this.webService.getBorks({
        senderAddress,
        types: [BorkType.like],
      }),
      this.webService.getProfileUpdates(senderAddress),
    ])

    this.setState({ loading: false, borks, likes, profileUpdates })
  }

  render () {
    const { loading, borks, likes, profileUpdates } = this.state
    const { user } = this.props

    return (
      <div className="page-content">
        <div>
          <div className="align-right">
            {user.address === this.props.address ? (
              <div>
                <Link to={`/profile/${user.address}/edit`}>
                  <button>Edit Profile</button>
                </Link>
              </div>
            ) : (
                <button onClick={() => this.props.toggleModal(<CheckoutModal type={BorkType.follow} txCount={1} />)}>Follow</button>   
            )}
          </div>
          <div className="profile-header">
            <img src={user.avatar || `data:image/png;base64,${avatar1}`} className="profile-avatar" />
            <h4>
              {user.name}
              <br></br>
              <a href={`https://live.blockcypher.com/doge/address/${user.address}/`} target="_blank">@{user.address.substr(0, 11)}</a>
              <br></br>
              <b>Birth Block: </b>{user.birthBlock}
            </h4>
          </div>
          <p className="profile-bio">{user.bio}</p>
          <Tabs>
            <TabList>
              <Tab>Borks & re:Borks</Tab>
              <Tab>Likes</Tab>
              <Tab>Profile Updates</Tab>
            </TabList>

            <TabPanel>
              {!loading &&
                <div>
                  {borks.length > 0 &&
                    <BorkList borks={borks.map(p => {
                      return { ...p }
                    })} />
                  }
                  {!borks.length &&
                    <p>No Borks</p>
                  }
                </div>
              }
            </TabPanel>

            <TabPanel>
              {!loading &&
                <div>
                  {likes.length > 0 &&
                    <BorkList borks={likes.map(l => {
                      return l.parent
                    })} />
                  }
                  {!likes.length &&
                    <p>No Likes</p>
                  }
                </div>
              }

            </TabPanel>

            <TabPanel>
              {!loading &&
                <div>
                  {profileUpdates.length > 0 &&
                    <ul className="profile-update-list">
                      {profileUpdates.map(p => {
                        return (
                          <li key={p.txid}>
                            <p style={{ color: 'gray' }}>{calendar(p.createdAt)}</p>

                            <p>
                              Changed <b style={{ textTransform: 'capitalize' }}>{p.type.split('_')[1]}</b> to: "{p.content}"
                            </p>
                          </li>
                        )
                      })}
                    </ul>
                  }
                  {!profileUpdates.length &&
                    <p>No Profile Updates</p>
                  }
                </div>
              }
            </TabPanel>
          </Tabs>
        </div>
    </div>
    )
  }
}

export default withAuthContext(ProfileShowPage)
