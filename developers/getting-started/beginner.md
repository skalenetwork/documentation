<StepsLayout id='Beginner'>

## Total Newbie

<StepsController>
    <StepNav stepId='one' label='Request\na SKALE Chain'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Prepare\nyour SKALE Chain'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Migrate\nSmart Contracts'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Send\na Transaction'><SendTransaction/></StepNav>
</StepsController>
<Step id='one'>

### 1. Request a SKALE Chain

If you do not have a SKALE Chain yet, request one by using the link below.  

<Button>[Request a SKALE Chain](https://skale.network/innovators-signup)</Button>

</Step>
<Step id='two'>

### 2. Prepare your SKALE Chain

SKALE Chains on the devnet will already be configured for you, and will not require any updates to get started with deploying your Smart Contracts onto SKALE.  

In order to use your SKALE Chain, you will need to fund your wallet account with the SKALE devnet ETH tokens. This can be accomplished by using the SKALE Faucet to receive 0.5 test ETH.  

<Button>[Get Test ETH](http://faucet.skale.network/)</Button>

</Step>
<Step id='three'>

### 3. Migrate Smart Contracts

SKALE is able to process smart contracts written in Solidity. This makes migrating your smart contracts from Ethereum fast and easy. Some smart contract updates or changes may be needed to enable certain features in SKALE such as transferring money and saving state. Please reference the respective sections within  [Code Samples](https://developers.skale.network/code-samples).  

<note>NOTE: In order to deploy your smart contracts onto SKALE, the transaction needs to be signed. This code below shows how to use the truffle-hdwallet-provider package to sign the transaction with the private key of your wallet:</note>  

```javascript
/*
 * This truffle script will deploy your smart contracts to your SKALE Chain.
 *
 *  @param {String} privateKey - Provide your wallet private key.
 *  @param {String} provider - Provide your SKALE endpoint address.
 */

let HDWalletProvider = require("truffle-hdwallet-provider");

//https://developers.skalelabs.com for SKALE documentation
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

You can point your deployment scripts for your existing smart contracts to your SKALE Chain’s address and deploy using existing tooling (e.g.: Truffle). An example truffle deployment command is:  

```bash
truffle deploy --reset --network skale --compile-all

```

See  [Code Samples](https://developers.skale.network/code-samples)  for more deployment script examples.  

</Step>
<Step id='four'>

### 4. Send a Transaction

Once your smart contracts have been moved over to your SKALE Chain, you can test sending out a new transaction, using Web3.js or Web3.py. Remember to point your Web3 instance to your SKALE Chain.  

```javascript
import Web3 from 'web3'

const web3 = new Web3("[YOUR_SKALE_CHAIN_ENDPOINT]");

```

</Step>
</StepsLayout>
