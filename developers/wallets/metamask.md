### Metamask

Metamask is a Chromium (Chrome, Brave, and Edge) and Firefox browser add-on that provides a non-custodial Ethereum wallet. An end-user's private key is stored in an encrypted Vault data stored in the browser.

[Please be sure you and your end-users are running a legitimate version of Metamask!](https://medium.com/mycrypto/how-to-ensure-youre-running-the-legitimate-version-of-metamask-5fcd8ab32b96) 

Metamask allows you to integrate your dApp with SKALE by setting the Network RPC endpoint in the Metamask extension. For more information and support, see <https://metamask.zendesk.com/hc/en-us/articles/360043227612-How-to-add-custom-Network-RPC-and-or-Block-Explorer>

#### Install the NPM Packages

```shell
npm install --save web3
```

#### Example Code

```javascript
import Web3 from 'web3';

let web3 = "";

web3 = window.web3;

  if (window.ethereum) {
    window.web3 = new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      console.log("MetaMask - Web3 Initialized!");
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
