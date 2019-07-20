import React from 'react'
import './loader.scss'
import loader from '../../../assets/loader.gif'

class Loader extends React.PureComponent {

  render () {
    return (
      <div style={{ textAlign: 'center' }}>
        <img src={loader} alt='Loading...' />
      </div>
    )
  }
}

export default Loader
