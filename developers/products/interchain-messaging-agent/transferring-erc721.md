<StepsLayout id='ERC721'>

### Get Started with ERC721 Transfer

The Interchain Messaging Agent can be used for managing ERC721 tokens between Ethereum and SKALE.  The following steps guide you through a complete transfer from Ethereum to SKALE and back. Be sure to follow any one-time setup and mapping steps described [here](/developers/products/interchain-messaging-agent/setting-up-erc721) before initiating transfers. 

<button>[Live ERC721 IMA Demo](https://codesandbox.io/s/erc721-skale-interchain-messaging-agent-222wy)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nERC721 on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Pay\nfor gas (Add ETH)'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Exit\nfrom SKALE chain'><LeaderlessConsensus/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Deposit ERC721 on Ethereum

To send ERC721 tokens from a user's wallet to the IMA Deposit Box on Ethereum, you will need to use the [depositERC721](https://github.com/skalenetwork/IMA/blob/develop/proxy/contracts/DepositBox.sol#L142) function within the **DepositBox** IMA contract on Ethereum.

This method is called from Ethereum to lock ERC721 tokens and move ERC721 tokens into a Deposit Box.  

The **DepositBox** IMA contract is currently deployed to the Rinkeby testnet. To get the ABIs to interact with IMA on Rinkeby, check out the [current release page](https://github.com/skalenetwork/skale-network/tree/master/releases/rinkeby/IMA).  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let rinkebyABIs = "[YOUR_SKALE_ABIs_ON_RINKEBY]";
let rinkebyERC721Json = "[YOUR_ERC721_ABI_ON_RINKEBY]";

let privateKey = new Buffer("[YOUR_PRIVATE_KEY]", "hex");
let accountForMainnet = "[YOUR_ACCOUNT_ADDRESS]";
let accountForSchain = "[YOUR_ACCOUNT_ADDRESS]";

let rinkeby = "[RINKEBY_ENDPOINT]";
let schainName = "[YOUR_SKALE_CHAIN_NAME]";

let mintId = "[ERC721_MINT_ID]";

const depositBoxAddress = rinkebyABIs.deposit_box_address;
const depositBoxABI = rinkebyABIs.deposit_box_abi;

const erc721ABI = rinkebyERC721Json.erc721_abi;
const erc721Address = rinkebyERC721Json.erc721_address;

const web3ForMainnet = new Web3(rinkeby);

let depositBox = new web3ForMainnet.eth.Contract(
depositBoxABI,
depositBoxAddress
);

let contractERC721 = new web3ForMainnet.eth.Contract(
erc721ABI,
erc721Address
);

let approve = contractERC721.methods
    .approve(
      depositBoxAddress,
      mintId
    )
    .encodeABI();

let deposit = depositBox.methods
.depositERC721(schainName, erc721Address, accountForSchain, mintId)
.encodeABI();

web3ForMainnet.eth.getTransactionCount(accountForMainnet).then((nonce) => {
//create raw transaction
const rawTxApprove = {
  from: accountForMainnet,
  nonce: "0x" + nonce.toString(16),
  data: approve,
  to: erc721Address,
  gas: 6500000,
  gasPrice: 100000000000
};
//sign transaction
const txApprove = new Tx(rawTxApprove);
txApprove.sign(privateKey);

const serializedTxApprove = txApprove.serialize();

//send signed transaction (approve)
web3ForMainnet.eth
  .sendSignedTransaction("0x" + serializedTxApprove.toString("hex"))
  .on("receipt", (receipt) => {
    console.log(receipt);
    web3ForMainnet.eth
      .getTransactionCount(accountForMainnet)
      .then((nonce) => {
        const rawTxDeposit = {
          from: accountForMainnet,
          nonce: "0x" + nonce.toString(16),
          data: deposit,
          to: depositBoxAddress,
          gas: 6500000,
          gasPrice: 100000000000,
          value: web3ForMainnet.utils.toHex(
            web3ForMainnet.utils.toWei("0.1", "ether")
          )
        };

        //sign transaction
        const txDeposit = new Tx(rawTxDeposit);

        txDeposit.sign(privateKey);

        const serializedTxDeposit = txDeposit.serialize();

        //send signed transaction (deposit)
        web3ForMainnet.eth
          .sendSignedTransaction("0x" + serializedTxDeposit.toString("hex"))
          .on("receipt", receipt => {
            console.log(receipt);
          })
          .catch(console.error);
      });
  })
  .catch(console.error);
});
```

</Step>
<Step id="two">

#### 2. Pay for Gas (Add ETH)

Before sending ERC721 tokens back to Ethereum, you will need add ETH to cover the gas cost on Ethereum. Either the dApp developer or the end user can cover the cost of gas.  

This method is called from the SKALE Chain to add ETH to cover the gas cost.  

The **TokenManager** IMA contract is pre-deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]";

let privateKey = new Buffer([YOUR_PRIVATE_KEY], "hex");
let accountForSchain = "[YOUR_SCHAIN_ACCOUNT_ADDRESS]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const web3ForSchain = new Web3(schainEndpoint);

let tokenManager = new web3ForSchain.eth.Contract(
  tokenManagerABI,
  tokenManagerAddress
);

/* 
 * prepare the smart contract function 
 * addEthCost(uint amount) 
 */
let addEthCost = tokenManager.methods.addEthCost(
  web3ForSchain.utils.toHex(
    web3ForSchain.utils.toWei(
      "0.5", 
      "ether"
    )
  )
).encodeABI();

web3ForSchain.eth.getTransactionCount(accountForSchain).then((nonce) => {

  //create raw transaction
  const rawTxAddEthCost = {
    from: accountForSchain,
    nonce: "0x" + nonce.toString(16),
    data: addEthCost,
    to: tokenManagerAddress,
    gasPrice: 100000000000,
    gas: 8000000,
    value: 0
  };

  //sign transaction
  const txAddEthCost = new Tx(rawTxAddEthCost);
  txAddEthCost.sign(privateKey);

  //serialize transaction
  const serializedTxAddEthCost = txAddEthCost.serialize();

  //send signed transaction (add eth cost)
  web3ForSchain.eth
    .sendSignedTransaction("0x" + serializedTxAddEthCost.toString("hex"))
    .on("receipt", receipt => {
      console.log(receipt);
    })
    .catch(console.error);
});
```

</Step>
<Step id="three">

#### 3. Exit from SKALE Chain

To send ERC721 tokens back to Ethereum, you will need to use the exitToMain function within the **TokenManager** IMA  contract on the SKALE Chain.  

This method is called from the SKALE Chain to send funds and move the token back to Ethereum.  

The **TokenManager** IMA contract is pre-deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]");
let rinkebyERC721Json = "[YOUR_RINKEBY_ERC721_ABI]";
let schainERC721Json = "[YOUR_SKALE_CHAIN_ERC721_ABI]";

let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex');
let accountForMainnet = "[YOUR_MAINNET_ACCOUNT_ADDRESS]";
let accountForSchain = "[YOUR_SCHAIN_ACCOUNT_ADDRESS]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

let mintId = "[ERC721_MINT_ID]";

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const erc721ABI = schainERC721Json.erc721_abi;

const erc721Address = schainERC721Json.erc721_address;
const erc721AddressRinkeby = rinkebyERC721Json.erc721_address;

const web3ForSchain = new Web3(schainEndpoint);

let tokenManager = new web3ForSchain.eth.Contract(
  tokenManagerABI,
  tokenManagerAddress
);

let contractERC721 = new web3ForSchain.eth.Contract(
  erc721ABI, 
  erc721Address
);

let transfer = contractERC721.methods
    .transferFrom(
      accountForSchain,
      tokenManagerAddress,
      mintId
    )
    .encodeABI();

let exit = tokenManager.methods
  .exitToMainERC721(
    erc721AddressRinkeby,
    accountForMainnet,
    mintId
  )
  .encodeABI();

//get nonce
web3ForSchain.eth.getTransactionCount(accountForSchain).then((nonce) => {
  
  //create raw transaction (approval)
  const rawTxTransfer = {
    from: accountForSchain,
    nonce: "0x" + nonce.toString(16),
    data: transfer,
    to: erc721Address,
    gasPrice: 100000000000,
    gas: 8000000
  };

  //sign transaction
  const txTransfer = new Tx(rawTxTransfer);
    txTransfer.sign(privateKey);

  const serializedTxTransfer = txTransfer.serialize();

  //send signed transaction (approval)
  web3ForSchain.eth
    .sendSignedTransaction("0x" + serializedTxTransfer.toString("hex"))
    .on("receipt", receipt => {
      console.log(receipt);

      //get next nonce
      web3ForSchain.eth.getTransactionCount(accountForSchain).then(nonce => {
        
        //create raw transaction (exit)
        const rawTxExit = {
          from: accountForSchain,
          nonce: "0x" + nonce.toString(16),
          data: exit,
          to: tokenManagerAddress,
          gasPrice: 100000000000,
          gas: 8000000,
          value: 0
        };

        //sign transaction (exit)
        const txExit = new Tx(rawTxExit);
        txExit.sign(privateKey);

        const serializedTxExit = txExit.serialize();

        //send signed transaction (exit)
        web3ForSchain.eth
          .sendSignedTransaction("0x" + serializedTxExit.toString("hex"))
          .on("receipt", receipt => {
            console.log(receipt);
          })
          .catch(console.error);
      });
    })
    .catch(console.error);
});
```
</Step>

</StepsLayout>
