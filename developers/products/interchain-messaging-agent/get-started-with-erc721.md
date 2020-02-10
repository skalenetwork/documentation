<StepsLayout id='ERC721'>

### Get Started with ERC721

The Interchain Messaging Agent can be used for managing ERC721 tokens between Ethereum and SKALE.  

<button>[Live Demo](https://codesandbox.io/s/erc721-skale-interchain-messaging-agent-74bjo)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nERC721 on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Get\ncloned ERC721'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Pay\nfor gas (Add Eth)'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Exit\nfrom SKALE chain'><LeaderlessConsensus/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Deposit ERC721 on Ethereum

To send ERC721 tokens from a user's wallet to the Deposit Box on Ethereum, you will need to use the depo function within the  **DepositBox**  Smart Contract on Ethereum.  

This method is called from Ethereum to "freeze" funds and move ERC721 tokens into a safe Deposit Box.  

The  **DepositBox**  Smart Contract is currently deployed to the Rinkeby testnet. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
function depositERC721(
    string memory schainID, 
    address contractHere, 
    address to, 
    uint tokenId
)
    public
    payable
    rightTransaction(schainID)
{
    bytes32 schainHash = keccak256(abi.encodePacked(schainID));

    address lockAndDataERC721 = ContractManager(lockAndDataAddress)
        .permitted(keccak256(abi.encodePacked("LockAndDataERC721")));

    address erc721Module = ContractManager(lockAndDataAddress)
        .permitted(keccak256(abi.encodePacked("ERC721Module")));

    require(IERC721Full(contractHere).ownerOf(tokenId) == 
        address(this), "Not allowed ERC721 Token");
    IERC721Full(contractHere).transferFrom(
        address(this), 
        lockAndDataERC721, 
        tokenId
    );
    require(IERC721Full(contractHere).ownerOf(tokenId) == 
        lockAndDataERC721, "Did not transfer ERC721 token");
        bytes memory data = IERC721Module(erc721Module).receiveERC721(
        contractHere, 
        to, 
        tokenId, 
        false
    );
    IMessageProxy(proxyAddress).postOutgoingMessage(
        schainID,
        ILockAndDataDB(lockAndDataAddress).tokenManagerAddresses(schainHash),
        msg.value,
        address(0),
        data
    );
    ILockAndDataDB(lockAndDataAddress).receiveEth.value(msg.value)(msg.sender);
}

```

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let rinkebyABIs = require("[YOUR_SKALE_ABIs_ON_RINKEBY]");
let rinkebyERC721ABI = require("[YOUR_ERC721_ABI_ON_RINKEBY]");

let privateKey = new Buffer([YOUR_PRIVATE_KEY], "hex");
let accountForMainnet = [YOUR_ACCOUNT_ADDRESS];
let accountForSchain = [YOUR_ACCOUNT_ADDRESS];

let rinkeby = [RINKEBY_ENDPOINT];
let schainID = [YOUR_SKALE_CHAIN_ID];

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

let approve = contractERC721.methods
.transferFrom(accountForMainnet, depositBoxAddress, 3333)
.encodeABI();

let deposit = depositBox.methods
.depositERC721(schainID, erc721Address, accountForSchain, 3333)
.encodeABI();

web3ForMainnet.eth.getTransactionCount(accountForMainnet).then(nonce => {
//create raw transaction
const rawTxApprove = {
  from: accountForMainnet,
  nonce: "0x" + nonce.toString(16),
  data: approve,
  to: erc721Address,
  gas: 6500000,
  gasPrice: 100000000000
};
//sign transaction
const txApprove = new Tx(rawTxApprove);
txApprove.sign(privateKey);

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
<Step id="two">

#### 2. Get Cloned ERC721

When you make the first deposit from an ERC721 contract on Ethereum, the  **ERC721ModuleForSchain** contract creates a clone of the ERC721 contract onto your SKALE Chain. In order to interact with this contract, you will need to retrieve the ABIs.  

This can be accomplished by filtering the past events and finding the ERC721TokenCreated event created by the  **ERC721ModuleForSchain** on your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');

let rinkebyABIs = require("[YOUR_SKALE_ABIs_ON_RINKEBY]");
let schainABIs = require("[YOUR_SKALE_CHAIN_ABIs]");
let rinkebyERC721ABI = require("[YOUR_RINKEBY_ERC721_ABI]");

let rinkeby = [RINKEBY_ENDPOINT];
let schainEndpoint = [YOUR_SKALE_CHAIN_ENDPOINT];

const erc721ModuleSchainAddress = schainABIs.erc721_module_for_schain_address;
const erc721ModuleSchainABI = schainABIs.erc721_module_for_schain_abi;

const erc721ModuleRinkebyAddress = rinkebyABIs.erc721_module_address;
const erc721ModuleRinkebyABI = rinkebyABIs.erc721_module_abi;

const web3 = new Web3(schainEndpoint);
const web3Rinkeby = new Web3(rinkeby);

let erc721ModuleSchain = new web3.eth.Contract(
  erc721ModuleSchainABI,
  erc721ModuleSchainAddress
);

let erc721ModuleRinkeby = new web3Rinkeby.eth.Contract(
  erc721ModuleRinkebyABI,
  erc721ModuleRinkebyAddress
);

const erc721ABI = rinkebyERC721ABI.zhelcoin_abi;
const erc721Address = rinkebyERC721ABI.zhelcoin_address;

erc721ModuleRinkeby
  .getPastEvents("ERC721TokenAdded", {
    filter: { tokenHere: [erc721Address] },
    fromBlock: 0,
    toBlock: "latest"
  })
  .then(events => {
    console.log(
      "ERC721 contract position on mainnet: " +
        events[0].returnValues.contractPosition
    );
    erc721ModuleSchain
      .getPastEvents("ERC721TokenCreated", {
        filter: { contractPosition: events[0].returnValues.contractPosition },
        fromBlock: 0,
        toBlock: "latest"
      })
      .then(events => {
        console.log(
          "ERC721 clone address on Skale Chain: " +
            events[0].returnValues.tokenThere
        );
        let jsonObject = {
          erc721_address: events[0].returnValues.tokenThere,
          erc721_abi: erc721ABI
        };

        document.getElementById("abi_textbox").value = JSON.stringify(
          jsonObject
        );
      });
  });

```

</Step>
<Step id="three">

#### 3. Pay for Gas (Add ETH)

Before sending ERC721 tokens back to Ethereum, you will need add ETH to cover the gas cost on Ethereum. Either the dApp developer or the end user can cover the cost of gas.  

This method is called from the SKALE Chain to add ETH to cover the gas cost.  

The  **TokenManager**  Smart Contract is deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
function addEthCost(uint amount) public receivedEth(amount) {
    ILockAndDataTM(lockAndDataAddress).addGasCosts(msg.sender, amount);
}

```

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let schainABIs = require("[YOUR_SKALE_CHAIN_ABIs]");

let privateKey = new Buffer([YOUR_PRIVATE_KEY], "hex");
let account = [YOUR_ACCOUNT_ADDRESS];
let schainEndpoint = [YOUR_SKALE_CHAIN_ENDPOINT];

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

web3ForSchain.eth.getTransactionCount(account).then(nonce => {

  //create raw transaction
  const rawTxAddEthCost = {
    from: account,
    nonce: "0x" + nonce.toString(16),
    data: addEthCost,
    to: tokenManagerAddress,
    gasPrice: 0,
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

To send ERC721 tokens back to Ethereum, you will need to use the exitToMain function within the  **TokenManager**  Smart Contract on the SKALE Chain.  

This method is called from the SKALE Chain to send funds and move the token back to Ethereum.  

The  **TokenManager**  Smart Contract is deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
function exitToMainERC721(
    address contractHere, 
    address to, 
    uint tokenId
) 
    public 
{
    address lockAndDataERC721 = ContractManager(lockAndDataAddress)
        .permitted(keccak256(abi.encodePacked("LockAndDataERC721")));

    address erc721Module = ContractManager(lockAndDataAddress)
        .permitted(keccak256(abi.encodePacked("ERC721Module")));

    require(
        IERC721Full(contractHere).ownerOf(tokenId) == address(this), 
        "Not allowed ERC721 Token"
    );

    IERC721Full(contractHere).transferFrom(
        address(this), 
        lockAndDataERC721, 
        tokenId
    );
    require(
        IERC721Full(contractHere).ownerOf(tokenId) == lockAndDataERC721, 
        "Did not transfer ERC721 token"
    );

    require(
        ILockAndDataTM(lockAndDataAddress)
            .reduceGasCosts(msg.sender, GAS_AMOUNT_POST_MESSAGE * AVERAGE_TX_PRICE), 
        "Not enough gas sent"
    );

    bytes memory data = IERC721Module(erc721Module).receiveERC721(
        contractHere, 
        to, 
        tokenId, 
        false   
    );

    IMessageProxy(proxyForSchainAddress).postOutgoingMessage(
        "Mainnet",
        ILockAndDataTM(lockAndDataAddress)
            .tokenManagerAddresses(keccak256(abi.encodePacked("Mainnet"))),
        GAS_AMOUNT_POST_MESSAGE * AVERAGE_TX_PRICE,
        address(0),
        data
    );
}

```

##### Example Code

```javascript
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

let schainABIs = require("[YOUR_SKALE_CHAIN_ABIs]");
let schainERC720Json = require("[YOUR_SKALE_CHAIN_ERC720_ABI]");

let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex')
let account = "[YOUR_ACCOUNT_ADDRESS]";
let rinkeby = "[RINKEBY_ENDPOINT]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const schainERC720ABI = schainERC720Json.erc720_abi;
const schainERC720Address = schainERC720Json.erc720_address;

const web3ForSchain = new Web3(schainEndpoint);

let tokenManager = new web3ForSchain.eth.Contract(
  tokenManagerABI,
  tokenManagerAddress
);

let contractERC720 = new web3ForSchain.eth.Contract(
  schainERC720ABI, 
  schainERC720Address
);

//approve the ERC720 transfer 
let approve = contractERC720.methods
  .approve(
    tokenManagerAddress,
    web3ForSchain.utils.toHex(web3ForSchain.utils.toWei("1", "ether"))
  )
  .encodeABI();

/* 
 * prepare the smart contract function 
 * exitToMainERC720( address contractHere, address to, uint amount) 
 */
let exit = tokenManager.methods
  .exitToMainERC720(
    erc720Address,
    account,
    web3ForSchain.utils.toHex(
      web3ForSchain.utils.toWei("0.000000000000000001", "ether")
    )
  )
  .encodeABI();

//get nonce
web3ForSchain.eth.getTransactionCount(account).then(nonce => {
  
  //create raw transaction (approval)
  const rawTxApprove = {
    from: account,
    nonce: "0x" + nonce.toString(16),
    data: approve,
    to: erc720Address,
    gasPrice: 0,
    gas: 8000000
  };

  //sign transaction (approval)
  const txApprove = new Tx(rawTxApprove);
  txApprove.sign(privateKey);

  //serialize transaction  (approval)
  const serializedTxApprove = txApprove.serialize();

  //send signed transaction (approval)
  web3ForSchain.eth
    .sendSignedTransaction("0x" + serializedTxApprove.toString("hex"))
    .on("receipt", receipt => {
      console.log(receipt);

      //get next nonce
      web3ForSchain.eth.getTransactionCount(account).then(nonce => {
        
        //create raw transaction (exit)
        const rawTxExit = {
          from: account,
          nonce: "0x" + nonce.toString(16),
          data: exit,
          to: tokenManagerAddress,
          gasPrice: 0,
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

#### Custom Contract Example

If your ERC721 contract contains custom functions outside of the standard required functions for ERC721 contracts, please refer to the following code example:  

<button>[Live Demo](https://codesandbox.io/s/raw-erc721-skale-interchain-messaging-agent-6l4m5)</button>

</StepsLayout>
