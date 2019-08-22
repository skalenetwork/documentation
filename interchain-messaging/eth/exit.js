const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const schainJson = require("../contracts/schain_proxy.json");
require("dotenv").config();

function exit() {
  let privateKey = new Buffer(process.env.PRIVATE_KEY, "hex");
  let accountForMainnet = process.env.ACCOUNT;
  let accountForSchain = process.env.ACCOUNT;
  let schainEndpoint = process.env.SKALE_ENDPOINT;

  const tokenManagerAddress = schainJson.token_manager_address;
  const tokenManagerABI = schainJson.token_manager_abi;

  const web3 = new Web3(new Web3.providers.HttpProvider(schainEndpoint));

  let TokenManager = new web3.eth.Contract(
    tokenManagerABI,
    tokenManagerAddress
  );

  //prepare the smart contract function exitToMain(address to)
  let exitToMain = TokenManager.methods
    .exitToMain(accountForMainnet, web3.utils.toWei("1", "ether"))
    .encodeABI();

  web3.eth.getTransactionCount(accountForSchain).then(nonce => {
    const rawTxExit = {
      from: accountForSchain,
      nonce: "0x" + nonce.toString(16),
      data: exitToMain,
      to: tokenManagerAddress,
      gasPrice: 0,
      gas: 8000000,
      value: 0
    };

    const txExit = new Tx(rawTxExit);
    txExit.sign(privateKey);

    const serializedTxExit = txExit.serialize();

    //send signed transaction
    web3.eth
      .sendSignedTransaction("0x" + serializedTxExit.toString("hex"))
      .on("receipt", receipt => {
        console.log(receipt);
      })
      .catch(console.error);
  });
}

exit();