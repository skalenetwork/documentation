/*
 * This nodeJS script will deploy your smart contracts to your new S-Chain.
 *
 *  @param {String} private key - Provide your private key.
 *  @param {String} account - Provide your account address.
 *  @param {String} SKALE Chain endpoint - provide your SKALE Chain endpoint
 *  @param {String} contractName - Name of your smart contract (i.e. MySmartContract)
 *  @param {String} contractFileName - Complete filename of contract (i.e. MySmartContract.sol)
 */

require('dotenv').config();
const Web3 = require('web3'); // version 1.0.0-beta.35
const solc = require('solc'); // version 0.5.4
const path = require('path');
const fs = require('fs');

let privateKey = process.env.PRIVATE_KEY;
let account = process.env.ACCOUNT;
let schainEndpoint = process.env.SKALE_CHAIN;

let contractName = "HelloSKALE"; //replace with your contract name
let contractFileName = "HelloSKALE.sol"; //replace with the filename of the contract

//Retrieve and compile contract source code
const contractPath = path.resolve(__dirname, 'contracts', contractFileName);
const contractContent = fs.readFileSync(contractPath, 'UTF-8');

//Format contract for solc reader
var contracts = {
  language: 'Solidity',
  sources: {},
  settings: {
    outputSelection: {
      '*': {
        '*': [ '*' ]
      }
    }
  }
}

//add HelloSKALE contract to contract sources
contracts.sources[contractFileName] = { content: contractContent };

//compile data via solc reader
let solcOutput = JSON.parse(solc.compile(JSON.stringify(contracts)));

//get compile HelloSKALE contract
let contractCompiled = solcOutput.contracts[contractFileName][contractName];

//Connect Web3 to your SKALE Chain
const web3 = new Web3(schainEndpoint);

//create transaction 
var tx = {
  data : '0x' + contractCompiled.evm.bytecode.object,
  from: account, 
  gasPrice: 0,
  gas: 80000000
};

web3.eth.getBalance(account)
.then((balance) => { 
  console.log("SKALE Chain account: " + balance)
});
