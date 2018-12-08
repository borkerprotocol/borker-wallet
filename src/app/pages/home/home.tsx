import React from 'react'
import '../../App.scss'
import './home.scss'
import { Link } from 'react-router-dom';

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
