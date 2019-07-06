import React from 'react'
import { Link } from 'react-router-dom'
import logo from '../../../assets/logo.png'
import '../../App.scss'
import './home.scss'

class HomePage extends React.PureComponent {

  render () {
    return (
      <div className="page-content">
        <div className="start-page">
          <h1>Borker <span>beta</span></h1>
          <div><img className="home-logo" src={logo} alt="logo"></img></div>
          <button><Link to="create">Create Wallet</Link></button>
          <br/>
          <br/>
          <button> <Link to="recover">Recover Wallet</Link></button>
        </div>
      </div>
    )
  }
}

export default HomePage
