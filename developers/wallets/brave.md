### Brave

The Brave Browser wallet allows you to integrate your dApp with SKALE.

#### Install the NPM Packages

```shell
npm install --save web3
```

#### Example Code

```javascript
import Web3 from 'web3';


// Your setup information

let web3 = "";

let switchToSKALE = {
    chainId: "0x12345", // your chainID
    chainName: "YOUR_CHAIN_NAME", // your chain name
    rpcUrls: ["https://your.skale.endpoint"],
    nativeCurrency: {
        name: "SKALE ETH",
        symbol: "skETH",
        decimals: 18
    },
}

async function getWeb3() {
  web3 = window.web3;

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      console.log("Brave - Web 3 Initialized!");

      //Get user wallet accounts
      window.web3.eth.getAccounts((error, accounts) => {
        if (error) {
          console.error(error);
        }
        console.log(accounts);

        //request change to SKALE Network
        window.ethereum
          .request({
            method: "wallet_addEthereumChain",
            params: [switchToSKALE, accounts[0]]
          })
          .catch((error) => console.log(error.message));
      });
    } catch (error) {
      // User denied account access...
    }
  }
}
```

#### Example Sandbox

<https://codesandbox.io/s/brave-wallet-integration-skale-dev-docs-bave-83rvp>
