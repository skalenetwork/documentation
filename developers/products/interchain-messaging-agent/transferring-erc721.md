<StepsLayout id='ERC721'>

### Get Started with ERC721 Transfer

The Interchain Messaging Agent can be used for managing ERC721 tokens between Ethereum and SKALE.  The following steps guide you through a complete transfer from Ethereum to SKALE and back. Be sure to follow any one-time setup and mapping steps described [here](/developers/products/interchain-messaging-agent/setting-up-erc721) before initiating transfers. 

<button>[Live ERC721 IMA Demo](https://codesandbox.io/s/erc721-transfer-skale-interchain-messaging-agent-222wy)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nERC721 on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Exit\nfrom SKALE Chain'><AsynchronousProtocol/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Deposit ERC721 on Ethereum

To send ERC721 tokens from a user's wallet to the IMA Deposit Box on Ethereum, you will need to use the [depositERC721](https://github.com/skalenetwork/IMA/blob/develop/proxy/contracts/DepositBox.sol#L142) function within the **DepositBox** IMA contract on Ethereum.

This method is called from Ethereum to lock ERC721 tokens and move ERC721 tokens into a Deposit Box.  

The **DepositBox** IMA contract is currently deployed to the Rinkeby testnet. To get the ABIs to interact with IMA on Rinkeby, check out the [current release page](https://github.com/skalenetwork/skale-network/tree/master/releases/rinkeby/IMA).  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

let rinkebyABIs = "[YOUR_SKALE_ABIs_ON_RINKEBY]";
let rinkebyERC721ABI = "[YOUR_ERC721_ABI_ON_RINKEBY]";

let privateKey = new Buffer("[YOUR_PRIVATE_KEY]", "hex");
let accountForMainnet = "[YOUR_ACCOUNT_ADDRESS]";
let accountForSchain = "[YOUR_ACCOUNT_ADDRESS]";

let rinkeby = "[RINKEBY_ENDPOINT]";
let schainName = "[YOUR_SKALE_CHAIN_NAME]";
let chainId = "YOUR_RINKEBY_CHAIN_ID";

let mintId = "[ERC721_MINT_ID]";

const depositBoxAddress = rinkebyABIs.deposit_box_address;
const depositBoxABI = rinkebyABIs.deposit_box_abi;

const erc721ABI = rinkebyERC721ABI.erc721_abi;
const erc721Address = rinkebyERC721ABI.erc721_address;

const web3ForMainnet = new Web3(rinkeby);

let depositBox = new web3ForMainnet.eth.Contract(
depositBoxABI,
depositBoxAddress
);

let contractERC721 = new web3ForMainnet.eth.Contract(
erc721ABI,
erc721Address
);

/**
   * Uses the openzeppelin ERC721
   * contract function transferFrom
   * https://github.com/OpenZeppelin/openzeppelin-contracts/tree/master/contracts/token/ERC721
   */
let transfer = contractERC721.methods
    .transferFrom(
      accountForMainnet,
      depositBoxAddress,
      mintId
    )
    .encodeABI();

let deposit = depositBox.methods
.depositERC721(schainName, erc721Address, accountForSchain, mintId)
.encodeABI();

web3ForMainnet.eth.getTransactionCount(accountForMainnet).then((nonce) => {
//create raw transaction
const rawTxTransfer = {
  chainId: chainId,
  from: accountForMainnet,
  nonce: "0x" + nonce.toString(16),
  data: transfer,
  to: erc721Address,
  gas: 6500000,
  gasPrice: 100000000000
};
//sign transaction
const txTransfer = new Tx(rawTxTransfer, {
      chain: "rinkeby",
      hardfork: "petersburg"
    });
txTransfer.sign(privateKey);

const serializedTxTransfer = txTransfer.serialize();

//send signed transaction (approve)
web3ForMainnet.eth
  .sendSignedTransaction("0x" + serializedTxTransfer.toString("hex"))
  .on("receipt", (receipt) => {
    console.log(receipt);
    web3ForMainnet.eth
      .getTransactionCount(accountForMainnet)
      .then((nonce) => {
        const rawTxDeposit = {
          chainId: chainId,
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
        const txDeposit = new Tx(rawTxDeposit, {
          chain: "rinkeby",
          hardfork: "petersburg"
        });

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

#### 2. Exit from SKALE Chain

To send ERC721 tokens back to Ethereum, you will need to use the exitToMain function within the **TokenManager** IMA  contract on the SKALE Chain.  

This method is called from the SKALE Chain to send funds and move the token back to Ethereum.  

The **TokenManager** IMA contract is pre-deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');
const Common = require('ethereumjs-common');
const Tx = require('ethereumjs-tx').Transaction;

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]");
let rinkebyERC721ABI = "[YOUR_RINKEBY_ERC721_ABI]";
let schainERC721ABI = "[YOUR_SKALE_CHAIN_ERC721_ABI]";

let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex');
let accountForMainnet = "[YOUR_MAINNET_ACCOUNT_ADDRESS]";
let accountForSchain = "[YOUR_SCHAIN_ACCOUNT_ADDRESS]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";
let chainId = "[YOUR_SKALE_CHAIN_CHAIN_ID]";

const customCommon = Common.forCustomChain(
    "mainnet",
    {
      name: "skale-network",
      chainId: chainId
    },
    "istanbul"
  );

let mintId = "[ERC721_MINT_ID]";

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const erc721ABI = schainERC721ABI.erc721_abi;

const erc721Address = schainERC721ABI.erc721_address;
const erc721AddressRinkeby = rinkebyERC721ABI.erc721_address;

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
    mintId,
    web3ForSchain.utils.toHex(web3ForSchain.utils.toWei("0.5", "ether"))
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
  const txTransfer = new Tx(rawTxTransfer, { common: customCommon });
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
        const txExit = new Tx(rawTxExit, { common: customCommon });
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
