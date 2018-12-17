import React from 'react'
import { Link } from 'react-router-dom'
import '../../App.scss'
import './home.scss'

class HomePage extends React.Component {

  render() {
    return (
      <div className="page-content">
        <button>
          <Link to="create">Create New Wallet</Link>
        </button>
        <br></br>
        <button>
          <Link to="restore">Restore Existing Wallet</Link>
        </button>
      </div>
    )
  }
}

export default HomePage
