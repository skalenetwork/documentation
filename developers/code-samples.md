# Code Samples

Deploying to SKALE is similar to deploying to the Ethereum blockchain. There are a few changes you will need to make within your deployment scripts. When using these code samples, please be sure to modify the code appropriately before running anything in production!  

You can share your own code sample by reaching out to us on discord.

<button>[Access Discord](http://skale.chat/)</button>

## All Samples

Use these deployment script examples to deploy your smart contracts onto your SKALE Chain.  

### Truffle Script

Truffle is a popular way to deploy your smart contracts onto Ethereum, and can also be used to deploy your smart contracts onto SKALE. You can update your truffle configuration file (truffle.js) with a configuration to deploy your smart contracts onto SKALE.  

For more information on truffle configuration files, please see  [Truffle's Configuration Documentation](https://truffleframework.com/docs/truffle/reference/configuration).  

NOTE: In order to deploy your smart contracts onto SKALE, the transaction needs to be signed. This code below shows how to use the truffle-hdwallet-provider package to sign the transaction with the private key of your wallet.  

```javascript
/*
 * This truffle script will deploy your smart contracts to your SKALE Chain.
 *
 *  @param {String} privateKey - Provide your wallet private key.
 *  @param {String} provider - Provide your SKALE endpoint address.
 */

let HDWalletProvider = require("truffle-hdwallet-provider");

//https://skale.network/developers/ for SKALE documentation
//Provide your wallet private key
let privateKey = "[YOUR_PRIVATE_KEY]";

//Provide your SKALE endpoint address
let skale = "[YOUR_SKALE_CHAIN_ENDPOINT]";

module.exports = {
    networks: {
        ganache: {
            host: "127.0.0.1",
            port: 8545,
            network_id: "*"
        },
        skale: {
            provider: () => new HDWalletProvider(privateKey, skale),
            gasPrice: 0,
            network_id: "*"
        }
    }
}

```

You can point your deployment scripts for your existing smart contracts to your SKALE Chain’s address and deploy using existing tooling (e.g.: Truffle). An example truffle deployment command to deploy your smart contracts using the 'skale' network in the script above is:  

```bash
truffle deploy --reset --network skale --compile-all

```

### NodeJS Script

Smart contracts can be deployed with just the use of web3.js as well. Below you will find a simple script for using NodeJS and web3.  

NOTE: Web3 and solc versions matter for compatibility. Web3 1.0.0-beta.35 and solc version 0.5.4 work well together, but other version combinations can cause unexpected errors.  

For more information on using web3.js, please see  [Web3.js Getting Started Documentation](https://web3js.readthedocs.io/en/1.0/getting-started.html).  

```javascript
/*
 * This nodeJS script will deploy your smart contracts to your new S-Chain.
 *
 *  @param {String} private key - Provide your private key.
 *  @param {String} account - Provide your account address.
 *  @param {String} SKALE Chain endpoint - provide your SKALE Chain endpoint
 *  @param {String} contractName - Name of your smart contract (i.e. MySmartContract)
 *  @param {String} contractFileName - Complete filename of contract (i.e. MySmartContract.sol)
 */

const Web3 = require('web3'); // version 1.0.0-beta.35
const solc = require('solc'); // version 0.5.4
const path = require('path');
const fs = require('fs');

let privateKey = "[YOUR_PRIVATE_KEY]";
let account = "[YOUR_ACCOUNT_ADDRESS]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

let contractName = "HelloSKALE"; //replace with your contract name
let contractFileName = "HelloSKALE.sol"; //replace with the filename of the contract

//Retrieve and compile contract source code
const contractPath = path.resolve(__dirname, 'contracts', contractFileName);
const contractContent = fs.readFileSync(contractPath, 'UTF-8');

//Format contract for solc reader
var contracts = {
  language: 'Solidity',
  sources: {},
  settings: {
    outputSelection: {
      '*': {
        '*': [ '*' ]
      }
    }
  }
}

//add HelloSKALE contract to contract sources
contracts.sources[contractFileName] = { content: contractContent };

//compile data via solc reader
let solcOutput = JSON.parse(solc.compile(JSON.stringify(contracts)));

//get compile HelloSKALE contract
let contractCompiled = solcOutput.contracts[contractFileName][contractName];

//Connect Web3 to your SKALE Chain
const web3 = new Web3(new Web3.providers.HttpProvider(schainEndpoint));


//create transaction 
var tx = {
  data : '0x' + contractCompiled.evm.bytecode.object,
  from: account, 
  gasPrice: 0,
  gas: 80000000
};

//sign transaction to deploy contract
web3.eth.accounts.signTransaction(tx, privateKey).then(signed => {
  web3.eth.sendSignedTransaction(signed.rawTransaction).
    on('receipt', receipt => {
     console.log(receipt)
   }).
    catch(console.error);
});

```

### Remix

Smart contracts can be deployed using Remix and MetaMask. Follow the steps below to deploy your smart contracts.  

For more information on using remix, please see [Remix Documentation](https://remix.readthedocs.io/en/latest/).  

**1. Connect to SKALE in MetaMask**  

To connect SKALE in MetaMask, create a new Custom RPC with your SKALE chain endpoint.  

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5ce1657d7e30fb40711d2b31_rpc-metamask.gif" sx={{maxWidth: ['75vw', '50vw', '25vw']}} />
