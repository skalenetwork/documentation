<StepsLayout id='Setup-ERC20'>

### Setup and Map ERC20 Transfers

The following one-time setup for each ERC20 token is required for SKALE Chains with a default access control policy (default settings are: whitelisting enabled, automatic deployment disabled). For more information on IMA access control, [see here](/developers/products/interchain-messaging-agent/ima-access-control).

<StepsController>
    <StepNav stepId='one' label='Review\nand Modify ERC20'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Add\na Minter Role'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Register\non Mainnet IMA'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Register\non SKALE Chain IMA'><SendTransaction/></StepNav>
</StepsController>

<Step id='one'>

#### 1. Review the token contract

First, review the Mainnet ERC20 token implementation and (if needed) modify a SKALE Chain version of the contract to include Mintable and Burnable functions. These functions are required to dynamically mint and burn the token on the SKALE chain in response to deposit and exit on the Mainnet.

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

</Step>

<Step id='two'>

#### 2. Add a Minter Role

Now you need to add the pre-deployed LockAndDataForSchainERC20 contact on your SKALE Chain as the MINTER_ROLE for the modified SKALE Chain contract. With OpenZeppelin's framework, you simply need to execute an AddMinter transaction on the SKALE chain token contract.

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

</Step>

<Step id='three'>

#### 3. Register Mainnet contract to IMA

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

</Step>
<Step id='four'>

#### 4. Register SKALE Chain contract to IMA

Finally, you need to register the (modified) token contract on the SKALE chain IMA using the addERC20TokenByOwner method in LockAndDataForSchain contract. Note that you need to register the contract on Mainnet first, so that the registration on the SKALE Chain can reference the Mainnet token address.

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

</StepsLayout>
