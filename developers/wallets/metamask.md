### Metamask

Metamask is a Chromium (Chrome, Brave, and Edge) and Firefox browser add-on that provides a non-custodial Ethereum wallet. An end-user's private key is stored in an encrypted Vault data stored in the browser.

[Please be sure you and your end-users are running a legitimate version of Metamask!](https://medium.com/mycrypto/how-to-ensure-youre-running-the-legitimate-version-of-metamask-5fcd8ab32b96) 

Metamask allows you to integrate your dApp with SKALE by setting the Network RPC endpoint for your users. For more information and support, see <https://consensys.net/blog/metamask/connect-users-to-layer-2-networks-with-the-metamask-custom-networks-api>

#### Install the NPM Packages

```shell
npm install --save web3
```

#### Example Code

```javascript
import Web3 from 'web3';

let web3 = "";

let switchToSKALE = {
  chainId: "0x54173", //decodes to 344435
  chainName: "SKALE Network Testnet",
  rpcUrls: ["https://dev-testnet-v1-0.skalelabs.com"],
  nativeCurrency: {
    name: "SKALE ETH",
    symbol: "skETH",
    decimals: 18
  },
  blockExplorerUrls: [
    "https://expedition.dev/?rpcUrl=https://dev-testnet-v1-0.skalelabs.com"
  ]
};

web3 = window.web3;

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      console.log("MetaMask - Web3 Initialized!");

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
  // Legacy dapp browsers...
  else if (window.web3) {
    window.web3 = new Web3(web3.currentProvider);
    console.log("MetaMask - Web3 Initialized!");
  }
  // Non-dapp browsers...
  else {
    console.log(
      "Non-Web3 browser detected. You should consider trying MetaMask!"
    );
  }
```

#### Example Sandbox

<https://codesandbox.io/s/metamask-wallet-integration-skale-dev-docs-k77zj>
