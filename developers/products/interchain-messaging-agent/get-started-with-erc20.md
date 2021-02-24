<StepsLayout id='ERC20'>

### Get Started with ERC20 Transfer

The Interchain Messaging Agent can be used for managing ERC20 tokens between Ethereum and SKALE.  The following steps guide you through a complete transfer from Ethereum to SKALE and back. Be sure to follow any one-time setup and mapping steps described [here](/developers/products/interchain-messaging-agent/setting-up-erc20) before initiating transfers.

<button>[Live ERC20 IMA Demo](https://codesandbox.io/s/erc20-skale-interchain-messaging-agent-u4tdt)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nERC20 on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Pay\nfor gas (Add ETH)'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Exit\nfrom SKALE chain'><LeaderlessConsensus/></StepNav>
</StepsController>

<Step id='one'>

#### 1. Deposit ERC20 on Ethereum

To send ERC20 tokens from a user's wallet to the IMA Deposit Box on Ethereum, you will need to use the [depositERC20](https://github.com/skalenetwork/IMA/blob/develop/proxy/contracts/DepositBox.sol#L89) function within the **DepositBox** IMA contract on Ethereum.  

This method is called from Ethereum to lock ERC20 tokens and move ERC20 tokens into a Deposit Box.  

The **DepositBox** contract is on Rinkeby testnet. To get the ABIs to interact with IMA on Rinkeby, check out the [current release page](https://github.com/skalenetwork/skale-network/tree/master/releases/rinkeby/IMA).  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let rinkebyABIs = "[YOUR_SKALE_ABIs_ON_RINKEBY]";
let rinkebyERC20ABI = "[YOUR_ERC20_ABI_ON_RINKEBY]";

let privateKeyForMainnet = new Buffer("[YOUR_MAINNET_ACCOUNT_PRIVATE_KEY]", 'hex')

let accountForMainnet = "[YOUR_MAINNET_ACCOUNT_ADDRESS]";
let accountForSchain = "[YOUR_SCHAIN_ACCOUNT_ADDRESS]";

let rinkeby = "[RINKEBY_ENDPOINT]";
let schainName = "[YOUR_SKALE_CHAIN_NAME]";

const depositBoxAddress = rinkebyABIs.deposit_box_address;
const depositBoxABI = rinkebyABIs.deposit_box_abi;

const erc20ABI = rinkebyERC20ABI.zhelcoin_abi;
const erc20Address = rinkebyERC20ABI.zhelcoin_address;

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
    from: accountForMainnet,
    nonce: "0x" + nonce.toString(16),
    data: approve,
    to: erc20Address,
    gas: 6500000,
    gasPrice: 100000000000
  };

  //sign transaction
  const txApprove = new Tx(rawTxApprove);
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
          const txDeposit = new Tx(rawTxDeposit);

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

#### 2. Pay for Gas (Add ETH)

Before sending ERC20 tokens back to Ethereum, you will need add ETH to cover the gas cost on Ethereum. Either the dApp developer or the end user can cover the cost of gas.  

This method is called from the SKALE Chain to add ETH to cover the gas cost.  

The **TokenManager** contract is pre-deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]";

let privateKey = new Buffer([YOUR_PRIVATE_KEY], "hex");
let accountForSchain = "[YOUR_ACCOUNT_ADDRESS]";
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

web3ForSchain.eth.getTransactionCount(accountForSchain).then(nonce => {

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

To send ERC20 tokens back to Ethereum, you will need to use the exitToMain function within the **TokenManager** IMA contract on the SKALE Chain.  

This method is called from the SKALE Chain to send funds and move the token back to Ethereum.  

The **TokenManager** IMA contract is pre-deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]";
let schainERC20Json = "[YOUR_SKALE_CHAIN_ERC20_ABI]";

let privateKeyForSchain = new Buffer('[YOUR_SCHAIN_ADDRESS_PRIVATE_KEY]', 'hex')
let account = "[YOUR_ACCOUNT_ADDRESS]";

let accountForMainnet = "[YOUR_MAINNET_ADDRESS]";
let accountForSchain = "[YOUR_SCHAIN_ADDRESS]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const schainERC20ABI = schainERC20Json.erc20_abi;
const schainERC20Address = schainERC20Json.erc20_address;

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

/* 
 * prepare the smart contract function 
 * exitToMainERC20( address contractHere, address to, uint amount) 
 */
let exit = tokenManager.methods
  .exitToMainERC20(
    erc20AddressOnMainnet,
    accountForMainnet,
    web3ForSchain.utils.toHex(
      web3ForSchain.utils.toWei("1", "ether")
    )
  )
  .encodeABI();

//get nonce
web3ForSchain.eth.getTransactionCount(accountForSchain).then(nonce => {
  
  //create raw transaction (approval)
  const rawTxApprove = {
    from: accountForSchain,
    nonce: "0x" + nonce.toString(16),
    data: approve,
    to: erc20Address,
    gasPrice: 100000000000,
    gas: 8000000
  };

  //sign transaction (approval)
  const txApprove = new Tx(rawTxApprove);
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
