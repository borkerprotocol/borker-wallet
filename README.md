# Borker-Wallet

Borker is a first-of-its-kind, Twitter-like microblogging platform built on top of the Dogecoin p2p network. Borker is open-source, decentralized, borderless, permissionless, pseudonymous, immutable, and censorship-resistant.

The Borker-Wallet is a Progressive Web Application (PWA) and cryptocurrency wallet for managing private keys and publishing and consuming information on the Borker network.

https://wallet.borker.io

## Installation Instructions

### Install Node.js if not installed
https://github.com/nodesource/distributions/blob/master/README.md

* confirm installation with:

```node -v```

```npm -v```

### Install typescript if not installed
```npm install -g typescript```

### Clone the repository
```git clone https://github.com/borkerprotocol/borker-wallet.git```

```cd borker-app```

### Create borkerconfig.json file
cp src/borkerconfig-sample.json src/borkerconfig.json

### Edit borkerconfig.json
"borkerip": "" // the default borker url/ip

### Install packages
```npm install```

### Run it
```npm run build``` (production build)

```npm run start``` (development server with auto reload)
