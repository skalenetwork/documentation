<StepsLayout id='ERC721'>

### Get Started with ERC721

The Interchain Messaging Agent can be used for managing ERC721 tokens between Ethereum and SKALE.  

<button>[Live ERC721 IMA Demo](https://codesandbox.io/s/erc721-skale-interchain-messaging-agent-222wy)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nERC721 on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Get\ncloned ERC721'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Pay\nfor gas (Add Eth)'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Exit\nfrom SKALE chain'><LeaderlessConsensus/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Prepare and Map ERC721

To prepare and map your ERC721, there are four substeps:

1. Check (and modify if needed) the token contract.
2. Add LockAndData as token minter.
3. Register token on IMA Mainnet.
4. Register token on IMA SKALE Chain.

First, review the Mainnet ERC721 token implementation and modify (if needed) a SKALE Chain version of the contract to ensure to include Mintable and Burnable functions.

##### Example Mainnet contract

```javascript
pragma solidity >=0.4.24 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, ERC721Burnable {
    constructor(
        string memory _name,
        string memory _symbol
    ) 
    ERC721Full(_name, _symbol)
    public 
    {
    }

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        address _to,
        uint256 _tokenId,
        string  memory _tokenURI
    ) public
    {
        super._mint(_to, _tokenId);
        super._setTokenURI(_tokenId, _tokenURI);
    }
}
```

##### Example Modified SKALE Chain contract

```javascript
pragma solidity >=0.4.24 <0.6.0;

import "@openzeppelin/contracts/token/ERC721/ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Mintable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721Burnable.sol";

contract MyERC721 is ERC721Full, ERC721Mintable, ERC721Burnable {
    constructor(
        string memory _name,
        string memory _symbol
    ) 
    ERC721Full(_name, _symbol)
    public 
    {
    }

    /**
    * Custom accessor to create a unique token
    */
    function mintUniqueTokenTo(
        address _to,
        uint256 _tokenId,
        string  memory _tokenURI
    ) public
    {
        super._mint(_to, _tokenId);
        super._setTokenURI(_tokenId, _tokenURI);
    }
}
```

If you aren't using OpenZeppelin's framework, then you can simply manually add [Mintable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/c3178ff942f9f487b9fda2c648aa19e633560adb/contracts/token/ERC721/ERC721.sol#L256) and [Burnable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/c3178ff942f9f487b9fda2c648aa19e633560adb/contracts/token/ERC721/ERC721.sol#L278) functions, and finally [add MINTER_ROLE access control](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/access/roles/MinterRole.sol). 

Second, you need to add LockAndDataForSchainERC721 as the MINTER_ROLE for the modified SKALE Chain contract. With OpenZeppelin's framework, you simply need to execute an AddMinter transaction on the SKALE chain token contract.

##### Example Add Minter Role 

```javascript
import Tx from "ethereumjs-tx";

const Web3 = require("web3");

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]";
let schainERC721ABI = "[YOUR_SCHAIN_ERC721_ABI]";

let contractOwnerPrivateKey = new Buffer("[YOUR_PRIVATE_KEY]", 'hex');

let contractOwnerAccount = "[CONTRACT_OWNER_ACCOUNT]";

let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

const erc721ABI = schainERC721ABI.erc721_abi;
const erc721Address = schainERC721ABI.erc721_address;

const lockAndDataForSchainERC721Address =
  schainABIs.lock_and_data_for_schain_erc721_address;

const web3ForSchain = new Web3(schainEndpoint);

let schainERC721Contract = new web3ForSchain.eth.Contract(
  erc721ABI,
  erc721Address
);

let addMinter = schainERC721Contract.methods
    .addMinter(lockAndDataForSchainERC721Address)
    .encodeABI();

  web3ForSchain.eth.getTransactionCount(contractOwnerAccount).then((nonce) => {
    //create raw transaction
    const rawTxAddMinter = {
      from: contractOwnerAccount,
      nonce: nonce,
      data: addMinter,
      to: erc721Address,
      gasPrice: 100000000000,
      gas: 8000000,
      value: 0
    };
    //sign transaction
    const txAddMinter = new Tx(rawTxAddMinter);
    txAddMinter.sign(contractOwnerPrivateKey);

    const serializedTxAddMinter = txAddMinter.serialize();

    //send signed transaction (add minter)
    web3ForSchain.eth
      .sendSignedTransaction("0x" + serializedTxAddMinter.toString("hex"))
      .on("receipt", (receipt) => {
        console.log(receipt);
      })
      .catch(console.error);
  });
```

Third, you need to register the Mainnet token contract into IMA on Mainnet using the addERC721TokenByOwner method in the LockAndDataForMainnet contract:

```javascript
const Web3 = require("web3");
const Tx = require("ethereumjs-tx");

let rinkebyABIs = "[YOUR_RINKEBY_ABIs]";
let rinkebyERC721ABI = "[YOUR_RINKEBY_ERC721_ABI]";

let privateKey = new Buffer("[YOUR_PRIVATE_KEY]", 'hex');

let erc721OwnerForMainnet = "[YOUR_ERC721_MAINNET_OWNER]";

let rinkeby = "[YOUR_RINKEBY_ENDPOINT]";
let schainName = "[YOUR_SKALE_CHAIN_NAME]";

const lockAndDataAddress =
  rinkebyABIs.lock_and_data_for_mainnet_erc721_address;
const lockAndDataBoxABI = rinkebyABIs.lock_and_data_for_mainnet_erc721_abi;

const erc721AddressOnMainnet = rinkebyERC721ABI.erc721_address;

const web3ForMainnet = new Web3(rinkeby);

let LockAndDataForMainnet = new web3ForMainnet.eth.Contract(
  lockAndDataBoxABI,
  lockAndDataAddress
);

let addERC721TokenByOwner = LockAndDataForMainnet.methods
    .addERC721TokenByOwner(schainName, erc721AddressOnMainnet)
    .encodeABI();

  web3ForMainnet.eth.getTransactionCount(erc721OwnerForMainnet).then((nonce) => {
    const rawTxAddERC20TokenByOwner = {
      from: erc721OwnerForMainnet,
      nonce: "0x" + nonce.toString(16),
      data: addERC721TokenByOwner,
      to: lockAndDataAddress,
      gas: 6500000,
      gasPrice: 100000000000,
      value: web3ForMainnet.utils.toHex(
        web3ForMainnet.utils.toWei("0", "ether")
      )
    };

    //sign transaction
    const txAddERC721TokenByOwner = new Tx(rawTxAddERC721TokenByOwner);

    txAddERC721TokenByOwner.sign(privateKey);

    const serializedTxDeposit = txAddERC721TokenByOwner.serialize();

    //send signed transaction (addERC20TokenByOwner)
    web3ForMainnet.eth
      .sendSignedTransaction("0x" + serializedTxDeposit.toString("hex"))
      .on("receipt", (receipt) => {
        console.log(receipt);
      })
      .catch(console.error);
  });
```

Finally, you need to register the token contract on the SKALE chain IMA using the addERC721TokenByOwner method in LockAndDataForSchain contract. Note that you need to register the contract on Mainnet first, so that the registration on the SKALE Chain can reference the Mainnet token address.

```javascript
const Web3 = require("web3");
const Tx = require("ethereumjs-tx");

let schainABIs = "[YOUR_SKALE_CHAIN_ABIs]";
let schainERC721ABI = "[YOUR_SCHAIN_ERC721_ABI]";
let rinkebyERC721ABI = "[YOUR_RINKEBY_ERC721_ABI]";

let privateKey = new Buffer("[YOUR_PRIVATE_KEY]", 'hex');

let erc721OwnerForSchain = "[YOUR_SCHAIN_ADDRESS]";

let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

const lockAndDataAddress = schainABIs.lock_and_data_for_schain_erc721_address;
const lockAndDataBoxABI = schainABIs.lock_and_data_for_schain_erc721_abi;

const erc721AddressOnMainnet = rinkebyERC721ABI.erc721_address;
const erc721AddressOnSchain = schainERC721ABI.erc721_address;

const web3ForSchain = new Web3(schainEndpoint);

let LockAndDataForSchain = new web3ForSchain.eth.Contract(
  lockAndDataBoxABI,
  lockAndDataAddress
);

let addERC721TokenByOwner = LockAndDataForSchain.methods
    .addERC721TokenByOwner(
      "Mainnet",
      erc721AddressOnMainnet,
      erc721AddressOnSchain
    )
    .encodeABI();

  web3ForSchain.eth.getTransactionCount(erc721OwnerForSchain).then((nonce) => {
    const rawTxAddERC721TokenByOwner = {
      from: erc721OwnerForSchain,
      nonce: "0x" + nonce.toString(16),
      data: addERC721TokenByOwner,
      to: lockAndDataAddress,
      gas: 6500000,
      gasPrice: 100000000000,
      value: web3ForSchain.utils.toHex(web3ForSchain.utils.toWei("0", "ether"))
    };

    //sign transaction
    const txAddERC721TokenByOwner = new Tx(rawTxAddERC721TokenByOwner);

    txAddERC721TokenByOwner.sign(privateKey);

    const serializedTxDeposit = txAddERC721TokenByOwner.serialize();

    web3ForSchain.eth
      .sendSignedTransaction("0x" + serializedTxDeposit.toString("hex"))
      .on("receipt", (receipt) => {
        console.log(receipt);
      })
      .catch(console.error);
  });
```

</Step>
<Step id="two">

#### 2. Deposit ERC721 on Ethereum

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
  from: accountForMainnet,
  nonce: "0x" + nonce.toString(16),
  data: transfer,
  to: erc721Address,
  gas: 6500000,
  gasPrice: 100000000000
};
//sign transaction
const txTransfer = new Tx(rawTxTransfer);
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
<Step id="three">

#### 3. Pay for Gas (Add ETH)

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
<Step id="four">

#### 4. Exit from SKALE Chain

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
