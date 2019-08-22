import store from '../../store'
import Web3 from 'web3'

import { showMessage, hideMessage } from './../status/StatusActions'

const Tx = require('ethereumjs-tx');

export const UPDATE_BALANCES = 'UPDATE_BALANCES'
export function updateBalances(balances) {
  return {
    type: UPDATE_BALANCES,
    payload: balances
  }
}

export const ADD_TRANSACTIONS = 'ADD_TRANSACTIONS'
export function addTransactions(transaction) {
  return {
    type: ADD_TRANSACTIONS,
    payload: transaction
  }
}

export const UPDATE_ACCOUNT = 'UPDATE_ACCOUNT'
export function accountUpdate(account) {
  return {
    type: UPDATE_ACCOUNT,
    payload: account
  }
}

export const UPDATE_ENDPOINT = 'UPDATE_ENDPOINT'
export function endpointUpdate(endpoint) {
  return {
    type: UPDATE_ENDPOINT,
    payload: endpoint
  }
}

export const UPDATE_ENDPOINT_SKALE = 'UPDATE_ENDPOINT_SKALE'
export function endpointSkaleUpdate(endpointSkale) {
  return {
    type: UPDATE_ENDPOINT_SKALE,
    payload: endpointSkale
  }
}

export const UPDATE_PRIVATE_KEY = 'UPDATE_PRIVATE_KEY'
export function privateKeyUpdate(privateKey) {
  return {
    type: UPDATE_PRIVATE_KEY,
    payload: privateKey
  }
}

export const UPDATE_SKALE_ID = 'UPDATE_SKALE_ID'
export function skaleIdUpdate(skaleId) {
  return {
    type: UPDATE_SKALE_ID,
    payload: skaleId
  }
}

export const UPDATE_TOKEN_ADDRESS = 'UPDATE_TOKEN_ADDRESS'
export function tokenAddressUpdate(tokenAddress) {
  return {
    type: UPDATE_TOKEN_ADDRESS,
    payload: tokenAddress
  }
}

export function updateAccount(account) {
  return function(dispatch) {
    dispatch(accountUpdate(account));
  }
}

export function updateEndpoint(endpoint) {
  return function(dispatch) {
    dispatch(endpointUpdate(endpoint));
  }
}

export function updateEndpointSkale(endpointSkale) {
  return function(dispatch) {
    dispatch(endpointSkaleUpdate(endpointSkale));
  }
}

export function updatePrivateKey(privateKey) {
  return function(dispatch) {
    dispatch(privateKeyUpdate(privateKey));
  }
}

export function updateSkaleId(skaleId) {
  return function(dispatch) {
    dispatch(skaleIdUpdate(skaleId));
  }
}

export function updateTokenAddress(tokenAddress) {
  return function(dispatch) {
    dispatch(tokenAddressUpdate(tokenAddress));
  }
}

async function getBalances(dispatch) {
  let {web3Instance, account, endpointSkale, schainJson, rinkebyJson} = store.getState().web3;

  const web3SKALE = new Web3(endpointSkale);

  const ethERC20Address = schainJson.eth_erc20_address;
  const ethERC20ABI = schainJson.eth_erc20_abi;

  const ETHERC20 = new web3SKALE.eth.Contract(
    ethERC20ABI,
    ethERC20Address
  );

  const lockDataMainnetAddress = rinkebyJson.lock_and_data_for_mainnet_address;

  let mainnetBalance = await web3Instance.eth.getBalance(account);
  let lockDataMainnetBalance = await web3Instance.eth.getBalance(lockDataMainnetAddress);

  const lockDataSchainAddress = schainJson.lock_and_data_for_schain_address;

  let schainBalance = await ETHERC20.methods.balanceOf(account).call();
  schainBalance = web3SKALE.utils.hexToNumberString(web3SKALE.utils.numberToHex(schainBalance));

  let lockDataSchainBalance = await await ETHERC20.methods.balanceOf(lockDataSchainAddress).call();
  lockDataSchainBalance = web3SKALE.utils.hexToNumberString(web3SKALE.utils.numberToHex(lockDataSchainBalance));

  dispatch(updateBalances({
    mainnetBalance: web3Instance.utils.fromWei(mainnetBalance, 'ether'),
    schainBalance: web3Instance.utils.fromWei(schainBalance, 'ether'),
    lockDataMainnetBalance: web3Instance.utils.fromWei(lockDataMainnetBalance, 'ether'),    
    lockDataSchainBalance: web3Instance.utils.fromWei(lockDataSchainBalance, 'ether'),    
  }));
}

export function refreshBalances() {
  getBalances(store.dispatch);
  setTimeout(function() {
    refreshBalances(store.dispatch);
  }, 2000);
}

export function deposit(amount) {
  let {privateKey, endpoint, skaleId, account, rinkebyJson} = store.getState().web3;
  
  privateKey = new Buffer(privateKey, 'hex')
  let rinkebyTestnetEndpoint = endpoint;
  let schainID = skaleId;

  const depositBoxAddress = rinkebyJson.deposit_box_address;
  const abi = rinkebyJson.deposit_box_abi;

  const web3 = new Web3(rinkebyTestnetEndpoint);

  let contract = new web3.eth.Contract(abi, depositBoxAddress);

  //prepare the smart contract function deposit(string schainID, address to)
  let deposit = contract.methods.deposit(schainID, account).encodeABI();  
  showMessage("Depositing Funds.");

  //get nonce
  web3.eth.getTransactionCount(account).then(nonce => {
    
    //create raw transaction
    const rawTx = {
      from: account, 
      nonce: "0x" + nonce.toString(16),
      data : deposit,
      to: depositBoxAddress,
      gas: 6500000,
      gasPrice: 100000000000,
      value: web3.utils.toHex(web3.utils.toWei(amount, 'ether'))
    }

    console.log(rawTx)

    //sign transaction
    const tx = new Tx(rawTx);
    tx.sign(privateKey);
    const serializedTx = tx.serialize();

    let recorded = false;

    //send signed transaction
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt',  receipt => {
        if(!recorded){
          hideMessage();
          recorded = true;
          let transactions = [];
          receipt.amount = amount;
          receipt.from = account;
          transactions.push(receipt);
          store.dispatch(addTransactions({
            transactionMainnet: transactions,
            transactionSchain: []
          }));
          getBalances(store.dispatch);
        }
     })
      .catch(console.error);
  });

}

export function exit(amount) {
  let {privateKey, endpointSkale, account, schainJson} = store.getState().web3;
  
  privateKey = new Buffer(privateKey, 'hex');
  let schainEndpoint = endpointSkale;

  const abi = schainJson.token_manager_abi;
  const tokenManagerAddress = schainJson.token_manager_address;

  const web3 = new Web3(schainEndpoint);

  let contract = new web3.eth.Contract(abi, tokenManagerAddress);

  let exitToMain = contract.methods
    .exitToMain(account, web3.utils.toWei("1", "ether"), web3.utils.fromAscii("[YOUR_MESSAGE]")).encodeABI();  

  showMessage("Exiting to Mainnet.");

  web3.eth.getTransactionCount(account).then(nonce => {
    const rawTx = {
      from: account, 
      nonce: "0x" + nonce.toString(16),
      data : exitToMain,
      to: tokenManagerAddress,
      gas: 6500000,
      gasPrice: 100000000000,
      value: 0
    }

    const tx = new Tx(rawTx);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    let recorded = false;

    //send signed transaction
    web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'))
      .on('receipt', receipt => {
        if(!recorded){
          hideMessage();
          recorded = true;
          let transactions = [];
          receipt.amount = amount;
          receipt.from = account;
          transactions.push(receipt);
          store.dispatch(addTransactions({
            transactionMainnet: [],
            transactionSchain: transactions
          }));
          getBalances(store.dispatch);
        }
          
     })
      .catch(console.error);
  });
}

export function getMyEth(amount) {
  let {privateKey, endpoint, account, rinkebyJson} = store.getState().web3;
  
  privateKey = new Buffer(privateKey, 'hex');

  const lockAndDataForMainnetAddress =
    rinkebyJson.lock_and_data_for_mainnet_address;
  const lockAndDataForMainnetABI =
    rinkebyJson.lock_and_data_for_mainnet_abi;

  const web3 = new Web3(endpoint);

  let LockAndDataForMainnet = new web3.eth.Contract(
    lockAndDataForMainnetABI,
    lockAndDataForMainnetAddress
  );

  //prepare the smart contract function exitToMain(address to)
  let getMyEth = LockAndDataForMainnet.methods.getMyEth().encodeABI();

  showMessage("Getting ETH.");

  web3.eth.getTransactionCount(account).then(nonce => {
    const rawTxGetMyEth = {
      from: account,
      nonce: "0x" + nonce.toString(16),
      data: getMyEth,
      to: lockAndDataForMainnetAddress,
      gas: 6500000,
      gasPrice: 100000000000,
      value: 0
    };

    const txGetMyEth = new Tx(rawTxGetMyEth);
    txGetMyEth.sign(privateKey);

    const serializedTxGetMyEth = txGetMyEth.serialize();

    //send signed transaction
    web3.eth
      .sendSignedTransaction("0x" + serializedTxGetMyEth.toString("hex"))
      .on("receipt", receipt => {
        console.log(receipt);
        hideMessage();
      })
      .catch(console.error);
  });
}



