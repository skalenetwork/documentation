const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const privateTestnetJson = require("../contracts/private_skale_testnet_proxy.json");
require("dotenv").config();

function getMyEth() {
  let privateKey = new Buffer(process.env.PRIVATE_KEY, "hex");
  let accountForMainnet = process.env.ACCOUNT;
  let accountForSchain = process.env.ACCOUNT;
  let privateSkaleTestnetEndpoint = process.env.SKALE_PRIVATE_MAINNET;

  const lockAndDataForMainnetAddress =
    privateTestnetJson.lock_and_data_for_mainnet_address;
  const lockAndDataForMainnetABI =
    privateTestnetJson.lock_and_data_for_mainnet_abi;

  const web3 = new Web3(
    new Web3.providers.HttpProvider(privateSkaleTestnetEndpoint)
  );

  let LockAndDataForMainnet = new web3.eth.Contract(
    lockAndDataForMainnetABI,
    lockAndDataForMainnetAddress
  );

  //prepare the smart contract function exitToMain(address to)
  let getMyEth = LockAndDataForMainnet.methods.getMyEth().encodeABI();

  web3.eth.getTransactionCount(accountForSchain).then(nonce => {
    const rawTxGetMyEth = {
      from: accountForMainnet,
      nonce: "0x" + nonce.toString(16),
      data: getMyEth,
      to: lockAndDataForMainnetAddress,
      gasPrice: 0,
      gas: 8000000,
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
      })
      .catch(console.error);
  });
}

getMyEth();