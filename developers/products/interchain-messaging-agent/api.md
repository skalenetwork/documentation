## Interchain Messaging API

Available Functions within the Interchain Messaging smart contracts.  

### Deposit Box

#### deposit

This method is used for depositing ETH into a safe deposit box smart contract on the mainnet.  

deposit(string memory schainID, address to, bytes memory data)  

**Parameters**  

1.  String  - Your SKALE Chain id.
2.  Address  - Wallet address to deposit ETH and create clone for on SKALE Chain.
3.  Bytes  - (optional) Message to send with ETH.

```javascript
let deposit = contract.methods
  .deposit(
    [YOUR_SKALE_CHAIN_ID],
    [WALLET_TO_CLONE_ETH]
  );

```

#### depositERC20

This method is used for depositing ERC20 tokens into a safe deposit box smart contract on the mainnet.  

function depositERC20(string memory schainID, address contractHere, address to, uint amount)  

**Parameters**  

1.  String  - Your SKALE Chain id.
2.  Address  - Address of ERC20 Contract deployed to mainnet.
3.  Address  - Wallet address to deposit ERC20 and create clone for on SKALE Chain.
4.  Uint  - Amount of ERC20 tokens to deposit.

```javascript
let contractERC20 = new web3.eth.Contract(
  [MAINNET_ERC20_ABI], 
  [MAINNET_ERC20_ADDRESS]
);

let approve = contractERC20.methods
  .approve(
    [DEPOSIT_BOX_ADDRESS],
    [AMOUNT_ERC20_TO_SEND])
  );

let deposit = depositBox.methods
  .depositERC20(
    [YOUR_SKALE_CHAIN_ID],
    [MAINNET_ERC20_ADDRESS],
    [WALLET_TO_CLONE_ERC20],
    [AMOUNT_ERC20_TO_SEND])
  );

```

#### rawDepositERC20

This method is used for depositing ERC20 tokens into a safe deposit box smart contract on the mainnet. Use this method when you have a custom implementation of the ERC20 contract.  

function rawDepositERC20(string memory schainID, address contractHere, address contractThere, address to, uint amount)  

**Parameters**  

1.  String  - Your SKALE Chain id.
2.  Address  - Address of ERC20 Contract deployed to mainnet.
3.  Address  - Address of ERC20 Contract deployed to SKALE Chain.
4.  Address  - Wallet address to deposit ERC20 and create clone for on SKALE Chain.
5.  Uint  - Amount of ERC20 tokens to deposit.

```javascript
let contractERC20 = new web3.eth.Contract(
  [MAINNET_ERC20_ABI], 
  [MAINNET_ERC20_ADDRESS]
);

let approve = contractERC20.methods
  .approve(
    [DEPOSIT_BOX_ADDRESS],
    [AMOUNT_ERC20_TO_SEND])
  );

let deposit = depositBox.methods
  .rawDepositERC20(
    [YOUR_SKALE_CHAIN_ID],
    [MAINNET_ERC20_ADDRESS],
    [SKALE_CHAIN_ERC20_ADDRESS],
    [WALLET_TO_CLONE_ERC20],
    [AMOUNT_ERC20_TO_SEND])
  );

```

#### depositERC721

This method is used for depositing ERC721 tokens into a safe deposit box smart contract on the mainnet.  

function depositERC721(string memory schainID, address contractHere, address to, uint tokenId)  

**Parameters**  

1.  String  - Your SKALE Chain id.
2.  Address  - Address of ERC721 Contract deployed to mainnet.
3.  Address  - Wallet address to deposit ERC721 and create clone for on SKALE Chain.
4.  Uint  - Unique token id of ERC721 token to deposit.

```javascript
let contractERC721 = new web3.eth.Contract(
  [MAINNET_ERC721_ABI], 
  [MAINNET_ERC721_ADDRESS]
);

let transferFrom = contractERC721.methods
  .transferFrom(
    [ERC721_TOKEN_OWNER_ADDRESS],
    [DEPOSIT_BOX_ADDRESS],
    [UNIQUE_ERC721_TOKEN_ID])
  );

let deposit = depositBox.methods
  .depositERC721(
    [YOUR_SKALE_CHAIN_ID],
    [MAINNET_ERC721_ADDRESS],
    [WALLET_TO_CLONE_ERC721],
    [UNIQUE_ERC721_TOKEN_ID])
  );

```

#### rawDepositERC721

This method is used for depositing ERC721 tokens into a safe deposit box smart contract on the mainnet. Use this method when you have a custom implementation of the ERC721 contract.  

function rawDepositERC721(string memory schainID, address contractHere, address contractThere, address to, uint tokenId)  

**Parameters**  

1.  String  - Your SKALE Chain id.
2.  Address  - Address of ERC721 Contract deployed to mainnet.
3.  Address  - Address of ERC721 Contract deployed to SKALE Chain.
4.  Address  - Wallet address to deposit ERC721 and create clone for on SKALE Chain.
5.  Uint  - Unique token id of ERC721 token to deposit.

```javascript
let contractERC721 = new web3.eth.Contract(
  [MAINNET_ERC721_ABI], 
  [MAINNET_ERC721_ADDRESS]
);

let transferFrom = contractERC721.methods
  .transferFrom(
    [ERC721_TOKEN_OWNER_ADDRESS],
    [DEPOSIT_BOX_ADDRESS],
    [UNIQUE_ERC721_TOKEN_ID])
  );

let deposit = depositBox.methods
  .rawDepositERC721(
    [YOUR_SKALE_CHAIN_ID],
    [MAINNET_ERC721_ADDRESS],
    [SKALE_CHAIN_ERC721_ADDRESS],
    [WALLET_TO_CLONE_ERC721],
    [UNIQUE_ERC721_TOKEN_ID])
  );

```

### Lock And Data For Mainnet

#### getMyEth

This method is used by the end user to release funds back to their wallet.  

function getMyEth()  

```javascript
let getMyEth = LockAndDataForMainnet.methods.getMyEth();

```

### Message Proxy

#### postOutgoingMessage

This method is used on either the mainnet or the SKALE Chain to send messages between SKALE and the mainnet.  

function postOutgoingMessage(string memory dstChainID, address dstContract, uint amount, address to, bytes memory data)  

**Parameters**  

1.  String  - Destination chain ("Mainnet" or "[YOUR_SKALE_CHAIN_ID]".
2.  Address  - Smart Contract to receive the message data.
3.  Uint  - Amount of ETH to send (set to 0 is not sending money).
4.  Addres  - Address the data is intended for.
5.  Bytes  - Data to send across chains.

**Additional Setup**  

The destination contract must implement the following method to receive the message:  

```javascript
function postMessage(
    address sender, 
    string memory fromSchainID, 
    address payable to, 
    uint amount, 
    bytes memory data
) 
    public 
{
    //do something with the data
}

```

```javascript
let postOutgoingMessage = messageProxy.methods
  .postOutgoingMessage(
    "Mainnet",
    [DESTINATION_CONTRACT],
     [AMOUNT_TO_SEND],
    [ACCOUNT],
    [DATA]
  )

```

### Token Manager

#### addEthCost

This method is used to pay for the gas of the exit transaction for ERC20 and ERC721 token transfer. ETH can be payed for by the end user, or by the dApp developer.  

function addEthCost(uint amount)  

**Parameters**  

1.  Unit  - Amount of ETH to send.

```javascript
let addEthCost = tokenManager.methods
  .addEthCost(
    [AMOUNT_ETH_TO_SEND])
  );

```

#### exitToMain

This method is used for returning ETH back to a user on the mainnet. The clone of the ETH on the SKALE Chain is burned, and the released back to the user on mainnet.  

function exitToMain(address to, uint amount, bytes memory data)  

**Parameters**  

1.  Address  - Wallet address to send ETH to on mannet.
2.  Unit  - Amount of ETH to send.
3.  Bytes  - (optional) Message to send with ETH.

```javascript
let exitToMain = tokenManager.methods
  .exitToMain(
    [WALLET_TO_SEND_ETH],
    [AMOUNT_OF_ETH_TO_SEND],
  );

```

#### exitToMainERC20

This method is used for returning ERC20 back to a user on the mainnet. The clone of the ERC20 on the SKALE Chain is burned, and the released back to the user on mainnet.  

function exitToMainERC20(address contractHere, address to, uint amount)  

**Parameters**  

1.  Address  - Address of ERC20 Contract deployed to SKALE Chain.
2.  Address  - Wallet address to send ERC20 and burn clone for on SKALE Chain.
3.  Unit  - Amount of ERC20 to send.

```javascript
let contractERC20 = new web3.eth.Contract(
  [MAINNET_ERC20_ABI], 
  [MAINNET_ERC20_ADDRESS]
);

let approve = contractERC20.methods
  .approve(
    [DEPOSIT_BOX_ADDRESS],
    [AMOUNT_ERC20_TO_SEND])
  );

let exit = tokenManager.methods
  .exitToMainERC20(
    [SKALE_CHAIN_ERC20_ADDRESS],
    [WALLET_TO_SEND_ERC20],
    [AMOUNT_ERC20_TO_SEND])
  );

```

#### rawExitToMainERC20

This method is used for returning ERC20 back to a user on the mainnet. The clone of the ERC20 on the SKALE Chain is burned, and the released back to the user on mainnet. Use this method when you have a custom implementation of the ERC20 contract.  

function rawExitToMainERC20(address contractHere, address contractThere, address to, uint amount)  

**Parameters**  

1.  Address  - Address of ERC20 Contract deployed to SKALE Chain.
2.  Address  - Address of ERC20 Contract deployed to mainnet.
3.  Address  - Wallet address to send ERC20 and burn clone for on SKALE Chain.
4.  Unit  - Amount of ERC20 to send.

```javascript
let contractERC20 = new web3.eth.Contract(
  [MAINNET_ERC20_ABI], 
  [MAINNET_ERC20_ADDRESS]
);

let approve = contractERC20.methods
  .approve(
    [DEPOSIT_BOX_ADDRESS],
    [AMOUNT_ERC20_TO_SEND])
  );

let exit = tokenManager.methods
  .rawExitToMainERC20(
    [SKALE_CHAIN_ERC20_ADDRESS],
    [MAINNET_ERC20_ADDRESS],
    [WALLET_TO_SEND_ERC20],
    [AMOUNT_ERC20_TO_SEND])
  );

```

#### exitToMainERC721

This method is used for returning ERC721 back to a user on the mainnet. The clone of the ERC721 on the SKALE Chain is burned, and the released back to the user on mainnet.  

function exitToMainERC721(address contractHere, address to, uint tokenId)  

**Parameters**  

1.  Address  - Address of ERC721 Contract deployed to SKALE Chain.
2.  Address  - Wallet address to send ERC721 and create clone for on SKALE Chain.
3.  Uint  - Unique token id of ERC721 token to deposit.

```javascript
let contractERC721 = new web3.eth.Contract(
  [MAINNET_ERC721_ABI], 
  [MAINNET_ERC721_ADDRESS]
);

let transferFrom = contractERC721.methods
  .transferFrom(
    [ERC721_TOKEN_OWNER_ADDRESS],
    [DEPOSIT_BOX_ADDRESS],
    [UNIQUE_ERC721_TOKEN_ID])
  );

let exit = tokenManager.methods
  .exitToMainERC721(
    [SKALE_CHAIN_ERC721_ADDRESS],
    [WALLET_TO_SEND_ERC721],
    [UNIQUE_ERC721_TOKEN_ID])
  );

```

#### rawExitToMainERC721

This method is used for returning ERC721 back to a user on the mainnet. The clone of the ERC721 on the SKALE Chain is burned, and the released back to the user on mainnet. Use this method when you have a custom implementation of the ERC721 contract.  

function rawExitToMainERC721(address contractHere, address contractThere, address to, uint tokenId)  

**Parameters**  

1.  Address  - Address of ERC721 Contract deployed to SKALE Chain.
2.  Address  - Address of ERC721 Contract deployed to mainnet.
3.  Address  - Wallet address to send ERC721 and create clone for on SKALE Chain.
4.  Uint  - Unique token id of ERC721 token to deposit.

```javascript
let contractERC721 = new web3.eth.Contract(
  [MAINNET_ERC721_ABI], 
  [MAINNET_ERC721_ADDRESS]
);

let transferFrom = contractERC721.methods
  .transferFrom(
    [ERC721_TOKEN_OWNER_ADDRESS],
    [DEPOSIT_BOX_ADDRESS],
    [UNIQUE_ERC721_TOKEN_ID])
  );

let exit = tokenManager.methods
  .rawExitToMainERC721(
    [SKALE_CHAIN_ERC721_ADDRESS],
    [MAINNET_ERC721_ADDRESS],
    [WALLET_TO_SEND_ERC721],
    [UNIQUE_ERC721_TOKEN_ID])
  );

```
