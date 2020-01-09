<StepsLayout id='ERC20'>

### Get Started with ERC20

The Interchain Messaging Agent can be used for managing ERC20 tokens between Ethereum and SKALE.  

<button>[Live Demo](https://codesandbox.io/s/erc20-skale-interchain-messaging-agent-hp37q)</button>

<StepsController>
    <StepNav stepId='one' label='Deposit\nERC20 on Ethereum'><ByzantineFaultTolerant/></StepNav>
    <StepNav stepId='two' label='Get\ncloned ERC20'><AsynchronousProtocol/></StepNav>
    <StepNav stepId='three' label='Pay\nfor gas (Add Eth)'><LeaderlessConsensus/></StepNav>
    <StepNav stepId='four' label='Exit\nfrom SKALE chain'><LeaderlessConsensus/></StepNav>
</StepsController>
<Step id='one'>

#### 1. Deposit ERC20 on Ethereum

To send ERC20 tokens from a user's wallet to the Deposit Box on Ethereum, you will need to use the  [deposit](https://github.com/skalenetwork/MTA/blob/develop/proxy/contracts/DepositBox.sol#L120)  function within the  **DepositBox**  Smart Contract on Ethereum.  

This method is called from Ethereum to "freeze" funds and move ERC20 tokens into a safe Deposit Box.  

The  **DepositBox**  Smart Contract is currently deployed to the Rinkeby testnet. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
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
    address tokenManagerAddress = ILockAndDataDB(lockAndDataAddress)
        .tokenManagerAddresses(schainHash);
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
    bytes memory data = IERC20Module(erc20Module)
        .receiveERC20(contractHere, to, amount, false);
    IMessageProxy(proxyAddress).postOutgoingMessage(
        schainID,
        tokenManagerAddress,
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
let rinkebyERC20ABI = require("[YOUR_ERC20_ABI_ON_RINKEBY]");

let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex')
let account = "[YOUR_ACCOUNT_ADDRESS]";
let rinkeby = "[RINKEBY_ENDPOINT]";
let schainID = "[YOUR_SKALE_CHAIN_ID]";

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
    schainID,
    erc20Address,
    account,
    web3ForMainnet.utils.toHex(web3ForMainnet.utils.toWei("1", "ether"))
  )
  .encodeABI();

web3ForMainnet.eth.getTransactionCount(account).then(nonce => {
  //create raw transaction
  const rawTxApprove = {
    from: account,
    nonce: "0x" + nonce.toString(16),
    data: approve,
    to: erc20Address,
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
        .getTransactionCount(account)
        .then(nonce => {
          const rawTxDeposit = {
            from: account,
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

#### 2. Get Cloned ERC20

When you make the first deposit from an ERC20 contract on Ethereum, the  **ERC20ModuleForSchain** contract creates a clone of the ERC20 contract onto your SKALE Chain. In order to interact with this contract, you will need to retrieve the ABIs.  

This can be accomplished by filtering the past events and finding the ERC20TokenCreated event created by the  **ERC20ModuleForSchain** on your SKALE Chain.  

##### Example Code

```javascript
const Web3 = require('web3');

let rinkebyABIs = require("[YOUR_SKALE_ABIs_ON_RINKEBY]");
let schainABIs = require("[YOUR_SKALE_CHAIN_ABIs]");
let rinkebyERC20ABI = require("[YOUR_RINKEBY_ERC20_ABI]");

let rinkeby = [RINKEBY_ENDPOINT];
let schainEndpoint = [YOUR_SKALE_CHAIN_ENDPOINT];

const erc20ModuleSchainAddress = schainABIs.erc20_module_for_schain_address;
const erc20ModuleSchainABI = schainABIs.erc20_module_for_schain_abi;

const erc20ModuleRinkebyAddress = rinkebyABIs.erc20_module_address;
const erc20ModuleRinkebyABI = rinkebyABIs.erc20_module_abi;

const web3 = new Web3(schainEndpoint);
const web3Rinkeby = new Web3(rinkeby);

let erc20ModuleSchain = new web3.eth.Contract(
  erc20ModuleSchainABI,
  erc20ModuleSchainAddress
);

let erc20ModuleRinkeby = new web3Rinkeby.eth.Contract(
  erc20ModuleRinkebyABI,
  erc20ModuleRinkebyAddress
);

const erc20ABI = rinkebyERC20ABI.zhelcoin_abi;
const erc20Address = rinkebyERC20ABI.zhelcoin_address;

erc20ModuleRinkeby
  .getPastEvents("ERC20TokenAdded", {
    filter: { tokenHere: [erc20Address] },
    fromBlock: 0,
    toBlock: "latest"
  })
  .then(events => {
    console.log(
      "ERC20 contract position on mainnet: " +
        events[0].returnValues.contractPosition
    );
    erc20ModuleSchain
      .getPastEvents("ERC20TokenCreated", {
        filter: { contractPosition: events[0].returnValues.contractPosition },
        fromBlock: 0,
        toBlock: "latest"
      })
      .then(events => {
        console.log(
          "ERC20 clone address on Skale Chain: " +
            events[0].returnValues.tokenThere
        );
        let jsonObject = {
          erc20_address: events[0].returnValues.tokenThere,
          erc20_abi: erc20ABI
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

Before sending ERC20 tokens back to Ethereum, you will need add ETH to cover the gas cost on Ethereum. Either the dApp developer or the end user can cover the cost of gas.  

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

To send ERC20 tokens back to Ethereum, you will need to use the exitToMain function within the  **TokenManager**  Smart Contract on the SKALE Chain.  

This method is called from the SKALE Chain to send funds and move the token back to Ethereum.  

The  **TokenManager**  Smart Contract is deployed to your SKALE Chain. Please reach out to your account manager to receive the ABIs specific for your SKALE Chain.  

```javascript
function exitToMainERC20(
    address contractHere, 
    address to, 
    uint amount
) 
    public 
{
    address lockAndDataERC20 = ContractManager(lockAndDataAddress)
        .permitted(keccak256(abi.encodePacked("LockAndDataERC20")));
    address erc20Module = ContractManager(lockAndDataAddress)
        .permitted(keccak256(abi.encodePacked("ERC20Module")));
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
    require(
        ILockAndDataTM(lockAndDataAddress)
        .reduceGasCosts(
            msg.sender, 
            GAS_AMOUNT_POST_MESSAGE * AVERAGE_TX_PRICE
        ), 
        "Not enough gas sent"
    );
    bytes memory data = IERC20Module(erc20Module)
        .receiveERC20(contractHere, to, amount, false);
    IMessageProxy(proxyForSchainAddress).postOutgoingMessage(
        "Mainnet",
        ILockAndDataTM(lockAndDataAddress).
            tokenManagerAddresses(keccak256(abi.encodePacked("Mainnet"))),
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
let schainERC20Json = require("[YOUR_SKALE_CHAIN_ERC20_ABI]");

let privateKey = new Buffer('[YOUR_PRIVATE_KEY]', 'hex')
let account = "[YOUR_ACCOUNT_ADDRESS]";
let rinkeby = "[RINKEBY_ENDPOINT]";
let schainEndpoint = "[YOUR_SKALE_CHAIN_ENDPOINT]";

const tokenManagerAddress = schainABIs.token_manager_address;
const tokenManagerABI = schainABIs.token_manager_abi;

const schainERC20ABI = schainERC20Json.erc20_abi;
const schainERC20Address = schainERC20Json.erc20_address;

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
    erc20Address,
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
    to: erc20Address,
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

If your ERC20 contract contains custom functions outside of the standard required functions for ERC20 contracts, please refer to the following code example:  

<button>[Live Demo](https://codesandbox.io/s/raw-erc20-skale-interchain-messaging-agent-u4tdt)</button>

</StepsLayout>
