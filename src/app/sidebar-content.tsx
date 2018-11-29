import React from "react"

const styles = {
  sidebarLink: {
    display: "block",
    padding: "16px 0px",
    color: "#757575",
    textDecoration: "none"
  },
  content: {
    width: 200,
    height: "100%",
    padding: "16px",
    backgroundColor: "white"
  }
}


const SidebarContent = () => {
  return (
    <div style={styles.content}>
      <a href="index.html" style={styles.sidebarLink}>
        Posts
      </a>
      <a href="index.html" style={styles.sidebarLink}>
        Wallet
      </a>
      <a href="index.html" style={styles.sidebarLink}>
        Settings
      </a>
    </div>
  )
}

export default SidebarContent