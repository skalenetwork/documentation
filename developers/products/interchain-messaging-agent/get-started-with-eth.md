<StepsLayout id='ETH'>

### Get Started with ETH

The Interchain Messaging Agent can be used for managing ETH tokens between Ethereum and SKALE.  

<button>[Live Demo](https://codesandbox.io/s/skale-interchain-messaging-agent-eth-zm6hz)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nETH on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Exit\nfrom SKALE Chain'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Release\nETH to User'><LeaderlessConsensus/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Deposit ETH on Ethereum

To send ETH from a user's wallet to the Deposit Box on Ethereum, you will need to use the deposit function within the  **DepositBox**  Smart Contract on Ethereum.  
  
This method is called from Ethereum to "freeze" funds and move ETH into a safe Deposit Box.  

The  **DepositBox**  Smart Contract is currently deployed to the Rinkeby testnet. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
function deposit(string memory schainID, address to) public payable {
        bytes memory empty;
        deposit(schainID, to, empty);
  }

```

Alternatively, you can choose to send a message with the ETH to the SKALE Chain by using the deposit function below.  

```javascript
function deposit(
  string memory schainID, 
  address to, 
  bytes memory data
) 
  public
  payable
  rightTransaction(schainID)
{
    bytes32 schainHash = keccak256(abi.encodePacked(schainID));
    address tokenManagerAddress = LockAndData(lockAndDataAddress)
      .tokenManagerAddresses(schainHash);
    bytes memory newData;
    newData = abi.encodePacked(bytes1(uint8(1)), data);
    Proxy(proxyAddress).postOutgoingMessage(
        schainID,
        tokenManagerAddress,
        msg.value,
        to,
        newData
    );
    LockAndData(lockAndDataAddress)
      .receiveEth.value(msg.value)(msg.sender);
}

```

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let rinkebyABIs = require("[YOUR_SKALE_ABIs_ON_RINKEBY]");
let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex')
let account = "[YOUR_ACCOUNT_ADDRESS]";
let rinkeby = "[RINKEBY_ENDPOINT]";
let schainID = "[YOUR_SKALE_CHAIN_ID]";

const depositBoxAddress = rinkebyABIs.deposit_box_address;
const depositBoxABI = rinkebyABIs.deposit_box_abi;

const web3 = new Web3(rinkeby);

let contract = new web3.eth.Contract(depositBoxABI, depositBoxAddress);

/* 
 * prepare the smart contract function 
 * deposit(string schainID, address to)
 */
let deposit = contract.methods
  .deposit(schainID, account)
  .encodeABI();

//get nonce
web3.eth.getTransactionCount(account).then(nonce => {
  
  //create raw transaction
  const rawTx = {
    from: account,
    nonce: "0x" + nonce.toString(16),
    data: deposit,
    to: depositBoxAddress,
    gas: 6500000,
    gasPrice: 100000000000,
    value: web3.utils.toHex(web3.utils.toWei("1", "ether"))
  };

  //sign transaction
  const tx = new Tx(rawTx);
  tx.sign(privateKey);

  //serialize transaction
  const serializedTx = tx.serialize();

  //send signed transaction
  web3.eth
    .sendSignedTransaction("0x" + serializedTx.toString("hex"))
    .on("receipt", receipt => {
      //record receipt to console
      console.log(receipt);
    })
    .catch(console.error);
});

```

</Step>

<Step id="two">

#### 2. Exit from SKALE Chain

To send ETH back to Ethereum, you will need to use the exitToMain function within the  **TokenManager**  Smart Contract on the SKALE Chain.  
  
This method is called from the SKALE Chain to send funds and move the token back to Ethereum.  

The  **TokenManager**  Smart Contract is deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
function exitToMain(address to, uint amount) public {
    bytes memory empty;
    exitToMain(to, amount, empty);
}

```

Alternatively, you can choose to send a message with the ETH back to Ethereum by using the exitToMain function below.  

```javascript
function exitToMain(address to, uint amount, bytes memory data) public receivedEth(amount) {
    bytes memory newData;
    newData = abi.encodePacked(bytes1(uint8(1)), data);
    ProxyForSchain(proxyForSchainAddress).postOutgoingMessage(
        "Mainnet",
        LockAndData(lockAndDataAddress)
            .tokenManagerAddresses(keccak256(abi.encodePacked("Mainnet"))),
        amount,
        to,
        newData
    );
}

```

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let schainABIs = require("[YOUR_SKALE_CHAIN_ABIs]");
let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex')
let account = "[YOUR_ACCOUNT_ADDRESS]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const web3 = new Web3(new Web3.providers.HttpProvider(schainEndpoint));

let contract = new web3.eth.Contract(
  tokenManagerABI, 
  tokenManagerAddress
);

/* 
 * prepare the smart contract function 
 * exitToMain(address to)
 */
let exitToMain = contract.methods.exitToMain(
    account, web3.utils.toWei('1', 'ether'), 
    web3.utils.fromAscii("[YOUR_MESSAGE")
).encodeABI();  

//get nonce
web3.eth.getTransactionCount(account).then(nonce => {
  //create raw transaction
  const rawTx = {
    nonce: nonce,
    from: account, 
    nonce: "0x" + nonce.toString(16),
    data : exitToMain,
    to: tokenManagerAddress,
    gasPrice: 0,
    gas: 8000000,
    value: 0
  }

  //sign transaction
  const tx = new Tx(rawTx);
  tx.sign(privateKey);

  //serialize transaction
  const serializedTx = tx.serialize();

  //send signed transaction
  web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).
    on('receipt', receipt => {
      //record receipt to console
      console.log(receipt);
   }).
    catch(console.error);
});

```

</Step>

<Step id="three">

#### 3. Release ETH to User

To release funds to the end user on Ethereum, you will need to use the getMyEth function within the  **LockAndDataForMainnet**  Smart Contract on Ethereum.  
  
This method is called from Ethereum to release tokens back to the end user.  

The  **LockAndDataForMainnet**  Smart Contract is deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
function getMyEth() public {
    require(
      address(this).balance >= approveTransfers[msg.sender], 
      "Not enough money"
    );
    require(
      approveTransfers[msg.sender] > 0, 
      "User has not money"
    );
    uint amount = approveTransfers[msg.sender];
    approveTransfers[msg.sender] = 0;
    msg.sender.transfer(amount);
}

```

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let rinkebyABIs = require("[YOUR_SKALE_ABIs_ON_RINKEBY]");
let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex')
let account = "[YOUR_ACCOUNT_ADDRESS]";
let rinkeby = "[RINKEBY_ENDPOINT]";

const lockAndDataForMainnetAddress =
  rinkebyABIs.lock_and_data_for_mainnet_address;

const lockAndDataForMainnetABI = 
  rinkebyABIs.lock_and_data_for_mainnet_abi;

const web3 = new Web3(rinkeby);

let LockAndDataForMainnet = new web3.eth.Contract(
  lockAndDataForMainnetABI,
  lockAndDataForMainnetAddress
);

/* 
 * prepare the smart contract function 
 * exitToMain(address to)
 */
let getMyEth = LockAndDataForMainnet.methods.getMyEth().encodeABI();

//get nonce
web3.eth.getTransactionCount(account).then(nonce => {
  
  //create raw transaction
  const rawTxGetMyEth = {
    from: account,
    nonce: "0x" + nonce.toString(16),
    data: getMyEth,
    to: lockAndDataForMainnetAddress,
    gas: 6500000,
    gasPrice: 100000000000,
    value: 0
  };

  //sign transaction
  const txGetMyEth = new Tx(rawTxGetMyEth);
  txGetMyEth.sign(privateKey);

  //serialize transaction
  const serializedTxGetMyEth = txGetMyEth.serialize();

  //send signed transaction
  web3.eth
    .sendSignedTransaction("0x" + serializedTxGetMyEth.toString("hex"))
    .on("receipt", receipt => {
      //record receipt to console
      console.log(receipt);
    })
    .catch(console.error);
});

```

</Step>
</StepsLayout>