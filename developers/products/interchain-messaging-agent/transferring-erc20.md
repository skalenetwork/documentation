<StepsLayout id='ERC20'>

### Get Started with ERC20 Transfer

The Interchain Messaging Agent can be used for managing ERC20 tokens between Ethereum and SKALE.  The following steps guide you through a complete transfer from Ethereum to SKALE and back. Be sure to follow any one-time setup and mapping steps described [here](/developers/products/interchain-messaging-agent/setting-up-erc20) before initiating transfers.

<button>[Live ERC20 IMA Demo](https://codesandbox.io/s/erc20-transfer-skale-interchain-messaging-agent-u4tdt)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nERC20 on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Exit\nfrom SKALE chain'><AsynchronousProtocol/></StepNav>
</StepsController>

<Step id='one'>

#### 1. Deposit ERC20 on Ethereum

To send ERC20 tokens from a user's wallet to the IMA Deposit Box on Ethereum, you will need to use the [depositERC20](https://github.com/skalenetwork/IMA/blob/develop/proxy/contracts/DepositBox.sol#L89) function within the **DepositBox** IMA contract on Ethereum.  

This method is called from Ethereum to lock ERC20 tokens and move ERC20 tokens into a Deposit Box.  

The **DepositBox** contract is on Rinkeby testnet. To get the ABIs to interact with IMA on Rinkeby, check out the [current release page](https://github.com/skalenetwork/skale-network/tree/master/releases/rinkeby/IMA).  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx').Transaction;

let rinkebyABIs = "[YOUR_SKALE_ABIs_ON_RINKEBY]";
let rinkebyERC20ABI = "[YOUR_ERC20_ABI_ON_RINKEBY]";

let privateKeyForMainnet = new Buffer("[YOUR_MAINNET_ACCOUNT_PRIVATE_KEY]", 'hex')

let accountForMainnet = "[YOUR_MAINNET_ACCOUNT_ADDRESS]";
let accountForSchain = "[YOUR_SCHAIN_ACCOUNT_ADDRESS]";

let rinkeby = "[RINKEBY_ENDPOINT]";
let schainName = "[YOUR_SKALE_CHAIN_NAME]";
let chainId = "RINKEBY_CHAIN_ID";

const depositBoxAddress = rinkebyABIs.deposit_box_address;
const depositBoxABI = rinkebyABIs.deposit_box_abi;

const erc20ABI = rinkebyERC20ABI.zhelcoin_abi;
const erc20Address = rinkebyERC20ABI.erc20_address;

const web3ForMainnet = new Web3(rinkeby);

let depositBox = new web3ForMainnet.eth.Contract(
  depositBoxABI,
  depositBoxAddress
);

let contractERC20 = new web3ForMainnet.eth.Contract(erc20ABI, erc20Address);

let approve = contractERC20.methods
  .approve(
    depositBoxAddress,
    web3ForMainnet.utils.toHex(web3ForMainnet.utils.toWei("1", "ether"))
  )
  .encodeABI();

let deposit = depositBox.methods
  .depositERC20(
    schainName,
    erc20Address,
    accountForSchain,
    web3ForMainnet.utils.toHex(web3ForMainnet.utils.toWei("1", "ether"))
  )
  .encodeABI();

web3ForMainnet.eth.getTransactionCount(accountForMainnet).then(nonce => {
  //create raw transaction
  const rawTxApprove = {
    chainId: chainId,
    from: accountForMainnet,
    nonce: "0x" + nonce.toString(16),
    data: approve,
    to: erc20Address,
    gas: 6500000,
    gasPrice: 100000000000
  };

  //sign transaction
  const txApprove = new Tx(rawTxApprove, {
    chain: "rinkeby",
    hardfork: "petersburg"
  });
  txApprove.sign(privateKeyForMainnet);

  const serializedTxApprove = txApprove.serialize();

  //send signed transaction (approve)
  web3ForMainnet.eth
    .sendSignedTransaction("0x" + serializedTxApprove.toString("hex"))
    .on("receipt", receipt => {
      console.log(receipt);
      web3ForMainnet.eth
        .getTransactionCount(accountForMainnet)
        .then(nonce => {
          const rawTxDeposit = {
            chainId: chainId,
            from: accountForMainnet,
            nonce: "0x" + nonce.toString(16),
            data: deposit,
            to: depositBoxAddress,
            gas: 6500000,
            gasPrice: 100000000000,
            value: web3ForMainnet.utils.toHex(
              web3ForMainnet.utils.toWei("0.5", "ether")
            )
          };

          //sign transaction
          const txDeposit = new Tx(rawTxDeposit, {
              chain: "rinkeby",
              hardfork: "petersburg"
            });

          txDeposit.sign(privateKeyForMainnet);

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

To send ERC20 tokens back to Ethereum, you will need to use the exitToMain function within the **TokenManager** IMA contract on the SKALE Chain.  

This method is called from the SKALE Chain to send funds and move the token back to Ethereum.  

The **TokenManager** IMA contract is pre-deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');
import Common from "ethereumjs-common";
const Tx = require('ethereumjs-tx').Transaction;

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]";
let rinkebyERC20ABI = "[YOUR_RINKEBY_ERC20_ABI]";
let schainERC20ABI = "[YOUR_SKALE_CHAIN_ERC20_ABI]";

let privateKeyForSchain = new Buffer('[YOUR_SCHAIN_ADDRESS_PRIVATE_KEY]', 'hex')

let accountForMainnet = "[YOUR_MAINNET_ADDRESS]";
let accountForSchain = "[YOUR_SCHAIN_ADDRESS]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";
let chainId = "YOUR_SCHAIN_CHAIN_ID";

const customCommon = Common.forCustomChain(
    "mainnet",
    {
      name: "skale-network",
      chainId: chainId
    },
    "istanbul"
  );

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const schainERC20ABI = schainERC20ABI.erc20_abi;
const schainERC20Address = schainERC20ABI.erc20_address;

const erc20AddressOnMainnet = rinkebyERC20ABI.erc20_address;

const web3ForSchain = new Web3(schainEndpoint);

let tokenManager = new web3ForSchain.eth.Contract(
  tokenManagerABI,
  tokenManagerAddress
);

let contractERC20 = new web3ForSchain.eth.Contract(
  schainERC20ABI, 
  schainERC20Address
);

//approve the ERC20 transfer 
let approve = contractERC20.methods
  .approve(
    tokenManagerAddress,
    web3ForSchain.utils.toHex(web3ForSchain.utils.toWei("1", "ether"))
  )
  .encodeABI();

/**
   * Uses the SKALE TokenManager
   * contract function exitToMainERC20
   */
let exit = tokenManager.methods
  .exitToMainERC20(
    erc20AddressOnMainnet,
    accountForMainnet,
    web3ForSchain.utils.toHex(web3ForSchain.utils.toWei("1", "ether")),
    web3ForSchain.utils.toHex(web3ForSchain.utils.toWei("0.5", "ether"))
  )
  .encodeABI();

//get nonce
web3ForSchain.eth.getTransactionCount(accountForSchain).then(nonce => {
  
  //create raw transaction (approval)
  const rawTxApprove = {
    chainId: chainId,
    from: accountForSchain,
    nonce: "0x" + nonce.toString(16),
    data: approve,
    to: erc20Address,
    gasPrice: 100000000000,
    gas: 8000000
  };

  //sign transaction (approval)
  const txApprove = new Tx(rawTxApprove, { common: customCommon });
  txApprove.sign(privateKeyForSchain);

  //serialize transaction  (approval)
  const serializedTxApprove = txApprove.serialize();

  //send signed transaction (approval)
  web3ForSchain.eth
    .sendSignedTransaction("0x" + serializedTxApprove.toString("hex"))
    .on("receipt", receipt => {
      console.log(receipt);

      //get next nonce
      web3ForSchain.eth.getTransactionCount(accountForSchain).then(nonce => {
        
        //create raw transaction (exit)
        const rawTxExit = {
          chainId: chainId,
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
        txExit.sign(privateKeyForSchain);

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
