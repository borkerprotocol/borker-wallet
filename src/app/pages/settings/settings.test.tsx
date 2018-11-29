import React from 'react'
import ReactDOM from 'react-dom'
import SettingsPage from './settings'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<SettingsPage />, div)
  ReactDOM.unmountComponentAtNode(div)
})
