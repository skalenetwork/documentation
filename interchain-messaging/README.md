

# Interchain Messaging Agent

Handling token and message transfers between the private SKALE devnet and your SKALE chain can be accomplished by a combination of the smart contract methods found below.

> The Interchain Messaging Agent will be fully open sourced in July 2019.


## Table of Contents

#### Example Scripts
 - [Configure your Environment](#configure)
 - [ETH Token Management](#eth)
     - [Deposit ETH on Ethereum](#deposit_eth)
     - [Exit from SKALE Chain](#exit_eth)
     - [Release ETH to User](#release_eth)
     - [Check Balances](#balances_eth)
 - [ERC20 Token Management](#erc20)
     - [Deposit ERC20 on Ethereum](#deposit_erc20)
     - [Exit from SKALE Chain](#exit_erc20)
     - [Check Balances](#balances_erc20)

#### Example dApp

> Example dApp to show how to clone Tokens onto your SKALE Chain.

| TOKEN TYPE  | DOCUMENTATION |
 --- |:---  | 
ETH | [documentation](example-dapp)|

#
<a name="configure"></a>
## Configure your Environment
    
+ Install node packages

```bash
npm install
```

+ Update `.env` file with your credentials.

```
ACCOUNT=[YOUR_ACCOUNT]
PRIVATE_KEY=[YOUR_PRIVATE_KEY]
PRIVATE_KEY_SKALE_CHAIN=[YOUR_PRIVATE_KEY]
SKALE_ENDPOINT=[YOUR_SKALE_CHAIN_ENDPOINT]
SKALE_CHAIN_ID=[YOUR_SKALE_CHAIN_ID]
SKALE_PRIVATE_MAINNET=[SKALE_PRIVATE_MAINNET_ENDPOINT]
```

+ Update the ABIs under `contracts` folder with the ABIs specific to your SKALE Chain.

+ Get SKALE test ETH

To get SKALE test ETH,  please use the [SKALE faucet](http://faucet.skalelabs.com/) to fund your account on the SKALE private mainnet.

<a name="eth"></a>
## ETH Token Management

<a name="deposit_eth"></a>
#### Deposit ETH on Ethereum

 To send ETH from a user's wallet to the Deposit Box on Ethereum, you will need to use the `deposit` function within the **DepositBox** Smart Contract on the mainnet.  
  
This method is called from the mainnet to "freeze" ETH tokens and move the token into a safe Deposit Box.

```
function deposit(string memory schainID, address to) public payable {
    bytes memory empty;
    deposit(schainID, to, empty);
}
```

##### Run the Deposit Script

To test this out using the code samples, run:

```bash
node eth/deposit.js
```

<a name="exit_eth"></a>
#### Exit from SKALE Chain

 To send ETH back to the mainnet, you will need to use the `exitToMain` function within the **TokenManager** Smart Contract on the mainnet.  
  
The `exitToMain` method is called from the SKALE Chain to send ETH tokens and move the token back to the mainnet.

```
function exitToMain(address to, uint amount) public {
    bytes memory empty;
    exitToMain(to, amount, empty);
}
```

##### Run the Exit Script

To test this out using the code samples, run:

```bash
node eth/exit.js
```

<a name="release_eth"></a>
#### Release ETH to User

To release funds to the end user on the mainnet, you will need to use the `getMyEth` function within the **LockAndDataForMainnet** Smart Contract on the mainnet.  
  
This method is called from the mainnet to release tokens back to the end user.

```
function getMyEth() public {
    require(address(this).balance >= approveTransfers[msg.sender], "Not enough money");
    require(approveTransfers[msg.sender] > 0, "User has not money");
    uint amount = approveTransfers[msg.sender];
    approveTransfers[msg.sender] = 0;
    msg.sender.transfer(amount);
}
```

##### Run the getMyEth Script

To test this out using the code samples, run:
```bash
node eth/getMyEth.js
```


Run the deposit script


<a name="balances_eth"></a>
#### Check Balances

Run the following, to check the balances of your accounts on the mainnet and the SKALE Chain.  

```bash
node erc20/balances.js
```
<a name="erc20"></a>
## ERC20 Token Management

<a name="deposit_erc20"></a>
#### Deposit ETH on Ethereum

 To send ERC20 Tokens from a user's wallet to the Deposit Box on Ethereum, you will need to use the `depositERC20` function within the **DepositBox** Smart Contract on the mainnet.  
  
This method is called from the mainnet to "freeze" ERC20 tokens and move the token into a safe Deposit Box.

```
function depositERC20(
    string memory schainID,
    address contractHere,
    address to,
    uint amount
)
    public
    payable
    rightTransaction(schainID)
{
    bytes32 schainHash = keccak256(abi.encodePacked(schainID));
    address tokenManagerAddress = LockAndData(lockAndDataAddress).tokenManagerAddresses(schainHash);
    address lockAndDataERC20 = ContractManager(lockAndDataAddress).permitted(keccak256(abi.encodePacked("LockAndDataERC20")));
    address erc20Module = ContractManager(lockAndDataAddress).permitted(keccak256(abi.encodePacked("ERC20Module")));
    require(
        IERC20(contractHere).allowance(
            msg.sender,
            address(this)
        ) >= amount,
        "Not allowed ERC20 Token"
    );
    require(
        IERC20(contractHere).transferFrom(
            msg.sender,
            lockAndDataERC20,
            amount
        ),
        "Could not transfer ERC20 Token"
    );
    bytes memory data = ERC20Module(erc20Module).receiveERC20(contractHere, to, amount, false);
    Proxy(proxyAddress).postOutgoingMessage(
        schainID,
        tokenManagerAddress,
        msg.value,
        address(0),
        data
    );
}
```

<a name="exit_erc20"></a>
#### Exit from SKALE Chain

 To send ERC20 tokens back to the mainnet, you will need to use the `exitToMain` function within the **TokenManager** Smart Contract on the mainnet.  
  
The `exitToMainERC20` method is called from the SKALE Chain to send ERC20 tokens back to the mainnet and back to the user.

```
function exitToMainERC20(address contractHere, address to, uint amount) public {
    address lockAndDataERC20 = ContractManager(lockAndDataAddress).permitted(keccak256(abi.encodePacked("LockAndDataERC20")));
    address erc20Module = ContractManager(lockAndDataAddress).permitted(keccak256(abi.encodePacked("ERC20Module")));
    require(
        ERC20Detailed(contractHere).allowance(
            msg.sender,
            address(this)
        ) >= amount,
        "Not allowed ERC20 Token"
    );
    require(
        ERC20Detailed(contractHere).transferFrom(
            msg.sender,
            lockAndDataERC20,
            amount
        ),
        "Could not transfer ERC20 Token"
    );
    require(LockAndData(lockAndDataAddress).reduceGasCosts(msg.sender, GAS_AMOUNT_POST_MESSAGE * AVERAGE_TX_PRICE), "Not enough gas sent");
    bytes memory data = ERC20Module(erc20Module).receiveERC20(contractHere, to, amount, false);
    ProxyForSchain(proxyForSchainAddress).postOutgoingMessage(
        "Mainnet",
        LockAndData(lockAndDataAddress).tokenManagerAddresses(keccak256(abi.encodePacked("Mainnet"))),
        GAS_AMOUNT_POST_MESSAGE * AVERAGE_TX_PRICE,
        address(0),
        data
    );
}
```

##### Run the Exit Script

To test this out using the code samples, run:

```bash
node erc20/exit.js
```

<a name="balances_erc20"></a>
#### Check Balances

Run the following, to check the balances of your accounts on the mainnet and the SKALE Chain.  

```bash
node erc20/balances.js
```