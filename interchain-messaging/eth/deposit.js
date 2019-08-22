const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const privateTestnetJson = require("../contracts/private_skale_testnet_proxy.json");
require("dotenv").config();

function deposit() {
  let privateKey = new Buffer(process.env.PRIVATE_KEY, "hex");
  let accountForMainnet = process.env.ACCOUNT;
  let accountForSchain = process.env.ACCOUNT;

  let privateSkaleTestnetEndpoint = process.env.SKALE_PRIVATE_MAINNET;
  let schainID = process.env.SKALE_CHAIN_ID;

  const depositBoxAddress = privateTestnetJson.deposit_box_address;
  const abi = privateTestnetJson.deposit_box_abi;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(privateSkaleTestnetEndpoint)
  );

  let contract = new web3.eth.Contract(abi, depositBoxAddress);

  //prepare the smart contract function deposit(string schainID, address to)
  let deposit = contract.methods
    .deposit(schainID, accountForSchain)
    .encodeABI();

  //get nonce
  web3.eth.getTransactionCount(accountForMainnet).then(nonce => {
    //create raw transaction
    const rawTx = {
      from: accountForMainnet,
      nonce: "0x" + nonce.toString(16),
      data: deposit,
      to: depositBoxAddress,
      gasPrice: 0,
      gas: 8000000,
      value: web3.utils.toHex(web3.utils.toWei("1", "ether"))
    };
    //sign transaction
    const tx = new Tx(rawTx);
    tx.sign(privateKey);

    const serializedTx = tx.serialize();

    //send signed transaction
    web3.eth
      .sendSignedTransaction("0x" + serializedTx.toString("hex"))
      .on("receipt", receipt => {
        console.log(receipt);
      })
      .catch(console.error);
  });
}

deposit();