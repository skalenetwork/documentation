<StepsLayout id='ERC20'>

### Get Started with ERC20

The Interchain Messaging Agent can be used for managing ERC20 tokens between Ethereum and SKALE.  

<button>[Live ERC20 IMA Demo](https://codesandbox.io/s/erc20-skale-interchain-messaging-agent-u4tdt)</button>

<StepsController>
    <StepNav stepId='one' label='Prepare\nand Map ERC20'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Deposit\nERC20 on Ethereum'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Pay\nfor gas (Add Eth)'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Exit\nfrom SKALE chain'><LeaderlessConsensus/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Prepare and Map ERC20

To prepare and map your ERC20, there are four substeps:

1. Check (and modify if needed) the token contract.
2. Add LockAndData as token minter.
3. Register token on IMA Mainnet.
4. Register token on IMA SKALE Chain.

First, review the Mainnet ERC20 token implementation and modify (if needed) a SKALE Chain version of the contract to ensure to include Mintable and Burnable functions.

##### Example Mainnet contract

```javascript
pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

interface tokenRecipient {
    function receiveApproval(address _from, uint256 _value, address _token, bytes calldata _extraData) external;
}

contract MyERC20 is ERC20, ERC20Detailed, ERC20Mintable{

    constructor(
    uint256 _amount,
    string memory _name,
    string memory _symbol,
    uint256 _decimals

  )
    ERC20Detailed(_name, _symbol, 18)
    public
  {
    require(_amount > 0, "amount has to be greater than 0");
    _mint(msg.sender, _amount.mul(10 ** uint256(_decimals)));
    }
}
```

##### Example Modified SKALE Chain contract

```javascript
pragma solidity >=0.4.22 <0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Mintable.sol";

contract MyERC20 is ERC20Burnable, ERC20Detailed, ERC20Mintable {

    constructor(
      string memory _name,
      string memory _symbol,
      uint256 _decimals
    )
    ERC20Detailed(_name, _symbol, 18)
    public
    {
    }
}
```

If you aren't using OpenZeppelin's framework, then you can simply manually add [Mintable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/c3178ff942f9f487b9fda2c648aa19e633560adb/contracts/token/ERC20/ERC20.sol#L233) and [Burnable](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/c3178ff942f9f487b9fda2c648aa19e633560adb/contracts/token/ERC20/ERC20.sol#L254) functions, and finally [add MINTER_ROLE access control](https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.5.1/contracts/access/roles/MinterRole.sol). 

Second, you need to add LockAndDataForSchainERC20 as the MINTER_ROLE for the modified SKALE Chain contract. With OpenZeppelin's framework, you simply need to execute an AddMinter transaction on the SKALE chain token contract.

##### Example Add Minter Role 

```javascript
let addMinter = schainERC20Contract.methods
    .addMinter(lockAndDataForSchainERC20Address)
    .encodeABI();

  web3ForSchain.eth.getTransactionCount(contractOwnerAccount).then((nonce) => {
    //create raw transaction
    const rawTxAddMinter = {
      from: contractOwnerAccount,
      nonce: nonce,
      data: addMinter,
      to: erc20Address,
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

Third, you need to register the Mainnet token contract into IMA on Mainnet using the addERC20TokenByOwner method in the LockAndDataForMainnet contract:

```javascript
let addERC20TokenByOwner = LockAndDataForMainnet.methods
    .addERC20TokenByOwner(schainName, erc20AddressOnMainnet)
    .encodeABI();

  web3ForMainnet.eth.getTransactionCount(erc20OwnerForMainnet).then((nonce) => {
    const rawTxAddERC20TokenByOwner = {
      from: erc20OwnerForMainnet,
      nonce: "0x" + nonce.toString(16),
      data: addERC20TokenByOwner,
      to: lockAndDataAddress,
      gas: 6500000,
      gasPrice: 100000000000,
      value: web3ForMainnet.utils.toHex(
        web3ForMainnet.utils.toWei("0", "ether")
      )
    };

    //sign transaction
    const txAddERC20TokenByOwner = new Tx(rawTxAddERC20TokenByOwner);

    txAddERC20TokenByOwner.sign(privateKey);

    const serializedTxDeposit = txAddERC20TokenByOwner.serialize();

    //send signed transaction (addERC20TokenByOwner)
    web3ForMainnet.eth
      .sendSignedTransaction("0x" + serializedTxDeposit.toString("hex"))
      .on("receipt", (receipt) => {
        console.log(receipt);
      })
      .catch(console.error);
  });
```

Finally, you need to register the token contract on the SKALE chain IMA using the addERC20TokenByOwner method in LockAndDataForSchain contract. Note that you need to register the contract on Mainnet first, so that the registration on the SKALE Chain can reference the Mainnet token address.

```javascript
let addERC20TokenByOwner = LockAndDataForSchain.methods
    .addERC20TokenByOwner(
      "Mainnet",
      erc20AddressOnMainnet,
      erc20AddressOnSchain
    )
    .encodeABI();

  web3ForSchain.eth.getTransactionCount(erc20OwnerForSchain).then((nonce) => {
    const rawTxAddERC20TokenByOwner = {
      from: erc20OwnerForSchain,
      nonce: "0x" + nonce.toString(16),
      data: addERC20TokenByOwner,
      to: lockAndDataAddress,
      gas: 6500000,
      gasPrice: 100000000000,
      value: web3ForSchain.utils.toHex(web3ForSchain.utils.toWei("0", "ether"))
    };

    //sign transaction
    const txAddERC20TokenByOwner = new Tx(rawTxAddERC20TokenByOwner);

    txAddERC20TokenByOwner.sign(privateKey);

    const serializedTxDeposit = txAddERC20TokenByOwner.serialize();

    //send signed transaction (addERC20TokenByOwner)
    web3ForSchain.eth
      .sendSignedTransaction("0x" + serializedTxDeposit.toString("hex"))
      .on("receipt", (receipt) => {
        console.log(receipt);
      })
      .catch(console.error);
  });
```
</Step>
<Step id='two'>

#### 2. Deposit ERC20 on Ethereum

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
<Step id="three">

#### 3. Pay for Gas (Add ETH)

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
<Step id="four">

#### 4. Exit from SKALE Chain

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
