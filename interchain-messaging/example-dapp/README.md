

# SKALE Interchain Messaging Demo

# Introduction

Demo dApp designed as a proof of concept for using SKALE's interchain messaging agent (IMA) feature.

### Run App Locally

> Compatible with [MetaMask 6.1.0](https://github.com/MetaMask/metamask-extension/releases/tag/v6.1.0) or lower
    
+ Install node packages

```
npm install
```

+ Update `.env` file with your credentials.

> An easy way to get a [Rinkeby](https://www.rinkeby.io/#stats) endpoint is via [Infura](https://infura.io/)

```
ACCOUNT=[YOUR_ACCOUNT]
PRIVATE_KEY=[YOUR_PRIVATE_KEY]
SKALE_CHAIN=[YOUR_SKALE_CHAIN_ENDPOINT]
SKALE_ID=[YOUR_SKALE_CHAIN_ID]
RINKEBY=[RINKEBY_ENDPOINT]
```

+ Replace SKALE Chain ABIs in `src/contracts/skale-chain/schain_proxy.json`

```
Replace the schain_proxy.json file with the ABIs
privided to you for your SKALE Chain.
```
+ Run the app locally

```
npm start
```
      