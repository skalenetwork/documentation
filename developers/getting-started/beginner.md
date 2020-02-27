<StepsLayout id='Beginner'>

### Beginner

Follow the steps below to start using SKALE. If you have your SKALE Chains already set up and you are looking for examples, please see  [Code Samples](/developers/code-samples).

<StepsController>
    <StepNav stepId='one' label='Request\na SKALE Chain'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Prepare\nyour SKALE Chain'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Migrate\nSmart Contracts'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Send\na Transaction'><SendTransaction/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Request a SKALE Chain

If you do not have a SKALE Chain yet, request one by using the link below.  

<button>[Request a SKALE Chain](https://skale.network/innovators-signup)</button>

</Step>
<Step id='two'>

#### 2. Prepare your SKALE Chain

SKALE Chains on the DevNet will already be configured for you, and will not require any updates to get started with deploying your Smart Contracts onto SKALE.  

In order to use your SKALE Chain, you will need to fund your wallet account with the SKALE DevNet ETH tokens. This can be accomplished by using the SKALE Faucet to receive 0.5 test ETH. 

<note>NOTE: Transactions run on SKALE are gas-less; however, in order for a user to process transactions on your SKALE Chain their wallet will need to contain a very small amount of test ETH. This is to protect your SKALE Chain against DDoS attacks. Think of this step as giving users "permission" to use your dApp.</note> 

<button>[Get Test ETH](http://faucet.skale.network/)</button>

</Step>
<Step id='three'>

#### 3. Migrate Smart Contracts

SKALE is able to process smart contracts written in Solidity. This makes migrating your smart contracts from Ethereum fast and easy. Some smart contract updates or changes may be needed to enable certain features in SKALE such as transferring money and saving state. Please reference the respective sections within [Code Samples](/developers/code-samples).  

<note>NOTE: In order to deploy your smart contracts onto SKALE, the transaction needs to be signed. This code below shows how to use the truffle-hdwallet-provider package to sign the transaction with the private key of your wallet:</note>  

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

You can point your deployment scripts for your existing smart contracts to your SKALE Chain’s address and deploy using existing tooling (e.g.: Truffle). An example truffle deployment command is:  

```bash
truffle deploy --reset --network skale --compile-all

```

See  [Code Samples](/developers/code-samples)  for more deployment script examples.  

</Step>
<Step id='four'>

#### 4. Send a Transaction

Once your smart contracts are deployed to your SKALE Chain, you can test sending out a new transaction using your existing connectors to Ethereum (ether.js, web3.js web3.py. etc.). 

You will not need to change you ether.js or web3 code setup, but you will need to send the trnasactions directly to SKALE by connecting MetaMask or [API Based Wallet](/developers/integrations) of your choice to your SKALE Chain.


To connect SKALE in MetaMask, create a new Custom RPC with your SKALE Chain endpoint.  

<img src="https://assets.website-files.com/5be05ae542686c4ebf192462/5ce1657d7e30fb40711d2b31_rpc-metamask.gif" sx={{maxWidth: ['75vw', '50vw', '300px']}} />


</Step>
</StepsLayout>
