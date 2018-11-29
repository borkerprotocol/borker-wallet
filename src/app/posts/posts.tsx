import React from 'react'

export interface PostsProps {}

export interface PostsState {}

const styles = {
  content: {
    padding: "16px"
  }
}

class Posts extends React.Component<PostsProps, PostsState> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div style={styles.content}>
        <p>
          Posts Page
        </p>
      </div>
    )
  }
}

export default Posts
