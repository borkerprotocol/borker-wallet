import React from 'react'
import ReactDOM from 'react-dom'
import PostsPage from './posts'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<PostsPage />, div)
  ReactDOM.unmountComponentAtNode(div)
})
