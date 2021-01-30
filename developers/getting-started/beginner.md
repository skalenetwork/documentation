<StepsLayout id='Beginner'>

### Beginner

Follow the steps below to start using SKALE. If you have your SKALE Chains already set up and are looking for examples, please see  [Code Samples](/developers/code-samples).

<StepsController>
    <StepNav stepId='one' label='Get\na SKALE Chain'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Prepare\nyour SKALE Chain'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Migrate\nSmart Contracts'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Send\na Transaction'><SendTransaction/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Get a SKALE Chain

If you don't have a SKALE Chain yet, there are several ways to get one.

For rapid and quick testing, you can check out [this post here](https://forum.skale.network/t/skale-chain-sdk/170) to grab an endpoint and chainID information.

You can run a single node containerized SKALE Chain on your local machine (Ubuntu or Mac) with minimal setup. To get started, head over to SKALE-SDK and follow the instructions to clone the repo to your local machine, cd into the repo, and execute `./run.sh`.
<button>[Get the SKALE SDK](https://github.com/skalenetwork/skale-sdk)</button>

If you want to get started with SKALE and the Interchain Messaging Agent (IMA) you can use the SKALE-IMA-SDK. This setup is more complicated as it involves deploying IMA contracts on a Testnet and a containerized SKALE Chain. You will need:

-   Ethereum testnet account
-   Ethereum testnet ETH
-   Ethereum testnet endpoint such as Infura or Geth.

<button>[Get the SKALE IMA SDK](https://github.com/skalenetwork/skale-ima-sdk)</button>

You can join an active Testnet and request a SKALE chain. Reach out to the SKALE developer community on discord for more information.
<button>[Get a Testnet SKALE Chain](http://skale.chat)</button>

You can also request to join the SKALE Innovator Program (SIP), which provides grants for Mainnet SKALE Chain access.
<button>[Request to join SIP](https://skale.network/innovators-signup)</button>

</Step>
<Step id='two'>

#### 2. Prepare your SKALE Chain

SKALE Chains on the SDKs or Testnet will already be configured for you and won't require any updates to get started with deploying your Smart Contracts onto SKALE.  

To use your SKALE Chain in the SDKs, you will need to use the provided account with test ETH. See the README in the SDK for this pre-funded account. For Testnets, you will need your wallet account with the SKALE TestNet ETH tokens. Do this by using the SKALE Faucet to receive 0.5 test ETH. 

NOTE: Transactions run on SKALE are gas-less; however, for a user to process transactions on your SKALE Chain their wallet will need to contain a small amount of test ETH. [Read more about SKALE ETH](/developers/skale-chain-eth).

<button>[Get Testnet ETH](https://faucet.skale.network/)</button>

</Step>
<Step id='three'>

#### 3. Migrate Smart Contracts

SKALE can process smart contracts written in Solidity. This makes migrating your smart contracts from Ethereum fast and easy. Some smart contract updates or changes may be needed to enable certain features in SKALE, such as transferring money and saving state. Please reference the respective sections within [Code Samples](/developers/code-samples).  

<note>NOTE: To deploy your smart contracts onto SKALE, the transaction needs to be signed. This code below shows how to use the truffle-hdwallet-provider package to sign the transaction with the private key of your wallet:</note>  

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
            network_id: "*",
            skipDryRun: true
        }
    }
}

```

You can point your deployment scripts for your existing smart contracts to your SKALE Chain’s address and deploy using existing tooling. An example Truffle deployment command is:  

```shell
truffle deploy --reset --network skale --compile-all
```

See [Code Samples](/developers/code-samples) for more deployment script examples.  

</Step>
<Step id='four'>

#### 4. Send a Transaction

Once your smart contracts deploy to your SKALE Chain, you can test sending out a new transaction using your existing connectors to Ethereum (ether.js, web3.js, web3.py, Remix, etc.). 

You won't need to change your ether.js or web3 code setup, but you will need to send the transactions directly to SKALE by connecting MetaMask or [API Based Wallet](/developers/integrations) of your choice to your SKALE Chain.

To connect SKALE in MetaMask, create a new Custom RPC with your SKALE Chain endpoint.  

<img src="<https://assets.website-files.com/5be05ae542686c4ebf192462/5ce1657d7e30fb40711d2b31_rpc-metamask.gif>" sx={{maxWidth: ['75vw', '50vw', '300px']}} />

</Step>
</StepsLayout>
