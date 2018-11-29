import React from 'react'
import { Post } from '../../../types/types'

export interface PostsProps {}

export interface PostsState {
  posts: Post[]
}

class PostsPage extends React.Component<PostsProps, PostsState> {

  constructor(props) {
    super(props)
    this.state = {
      posts: []
    }
  }

  async componentDidMount() {
    this.setState({
      posts: await this._getPosts()
    })
  }

  async _getPosts(): Promise<Post[]> {
    return samplePosts
  }

  render() {
    return (
      <ul>
        {this.state.posts.map(post => {
          return (
            <li key={post.txid}>
              <p>
                {post.user.name} - {post.user.birthBlock} - {post.timestamp}
              </p>
              <p>
                {post.content}
              </p>
            </li>
          )
        })}
      </ul>
    )
  }
}

export default PostsPage


export const samplePosts: Post[] = [
  {
    timestamp: new Date().toLocaleDateString(),
    txid: 'txid',
    user: {
      name: 'MattHill',
      address: 'address',
      birthBlock: 4000,
      profileTxids: ['1234'],
      postTxids: ['9876', '5432']

    },
    content: 'I like post. I like post'  
  },
  {
    timestamp: new Date().toLocaleDateString(),
    txid: 'txid2222',
    user: {
      name: 'AidenMcClelland',
      address: 'addreess2222',
      birthBlock: 3000,
      profileTxids: ['2345'],
      postTxids: ['8765', '4321']

    },
    content: 'Post some more. Post some more.'  
  }
]