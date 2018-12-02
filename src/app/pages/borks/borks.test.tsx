import React from 'react'
import ReactDOM from 'react-dom'
import BorksPage from './borks'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<BorksPage />, div)
  ReactDOM.unmountComponentAtNode(div)
})
