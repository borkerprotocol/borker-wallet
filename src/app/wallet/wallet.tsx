import React from 'react'

export interface WalletProps {}

export interface WalletState {}

const styles = {
  content: {
    padding: "16px"
  }
}

class Wallet extends React.Component<WalletProps, WalletState> {

  constructor(props) {
    super(props)
    this.state = {}
  }

  async componentDidMount() {
    const borkerLib = await import('borker-rs')
    const wallet = new borkerLib.JsWallet()
    const words = wallet.words()
    console.log(words.join(" "))
  }

  render() {
    return (
      <div style={styles.content}>
        <p>
          Wallet Page
        </p>
      </div>
    )
  }
}

export default Wallet
