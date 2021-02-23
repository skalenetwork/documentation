<StepsLayout id='Setup-ERC20'>

### Setup and Map ERC721 Transfers

The following one-time setup for each ERC721 token is required for SKALE Chains with a default access control policy (default settings are: whitelisting enabled, automatic deployment disbaled). For more information on IMA access control, [see here](/developers/products/interchain-messaging-agent/ima-access-control).

<StepsController>
    <StepNav stepId='one' label='Review\nand Modify ERC721'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Add\na Minter Role'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Register\non Mainnet IMA'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Register\non SKALE Chain IMA'><SendTransaction/></StepNav>
</StepsController>

<Step id='one'>

#### 1. Review the token contract.

First, review the Mainnet ERC721 token implementation and (if needed) modify a SKALE Chain version of the contract to include Mintable and Burnable functions. These functions are required to dynamically mint and burn the token on the SKALE chain in response to deposit and exit on the Mainnet.

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

</Step>

<Step id='two'>

#### 2. Add a Minter Role

Now you need to add the pre-deployed LockAndDataForSchainERC721 contact on your SKALE Chain as the MINTER_ROLE for the modified SKALE Chain contract. With OpenZeppelin's framework, you simply need to execute an AddMinter transaction on the SKALE chain token contract.

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

</Step>

<Step id='three'>

#### 3. Register Mainnet contract to IMA

Third, you need to register the Mainnet token contract into IMA on Mainnet using the addERC20TokenByOwner method in the LockAndDataForMainnet contract:

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

</Step>
<Step id='four'>

#### 4. Register SKALE Chain contract to IMA

Finally, you need to register the (modified) token contract on the SKALE chain IMA using the addERC721TokenByOwner method in LockAndDataForSchain contract. Note that you need to register the contract on Mainnet first, so that the registration on the SKALE Chain can reference the Mainnet token address.

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

</StepsLayout>
