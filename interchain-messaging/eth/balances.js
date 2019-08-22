const Web3 = require('web3');
const privateTestnetJson = require("../contracts/private_skale_testnet_proxy.json");
const schainJson = require("../contracts/schain_proxy.json");
require("dotenv").config();

function getBalances() {
  let accountForMainnet = process.env.ACCOUNT;
  let accountForSchain = process.env.ACCOUNT;

  let privateSkaleTestnetEndpoint = process.env.SKALE_PRIVATE_MAINNET;
  let schainEndpoint = process.env.SKALE_ENDPOINT;

  const lockAndDataForMainnetAddress =
    privateTestnetJson.lock_and_data_for_mainnet_address;
  const lockAndDataForSchainAddress =
    schainJson.lock_and_data_for_schain_address;

  const ethERC20Address = schainJson.eth_erc20_address;
  const ethERC20ABI = schainJson.eth_erc20_abi;

  const web3PrivateTestnet = new Web3(
    new Web3.providers.HttpProvider(privateSkaleTestnetEndpoint)
  );
  const web3SkaleChain = new Web3(
    new Web3.providers.HttpProvider(schainEndpoint)
  );

  const ETHERC20 = new web3SkaleChain.eth.Contract(
    ethERC20ABI,
    ethERC20Address
  );
  console.log(ethERC20Address);

  ETHERC20.methods
    .balanceOf(accountForSchain)
    .call()
    .then(balance => {
      console.log("ETH clone balance of account: " + balance);
    });

  web3PrivateTestnet.eth.getBalance(accountForMainnet).then(balance => {
    console.log(
      "Account balance on private SKALE: " +
        web3PrivateTestnet.utils.fromWei(balance, "ether")
    );
  });

  web3PrivateTestnet.eth
    .getBalance(lockAndDataForMainnetAddress)
    .then(balance => {
      console.log(
        "Balance in private SKALE testnet Lock&Data: " +
          web3PrivateTestnet.utils.fromWei(balance, "ether")
      );
    });

  ETHERC20.methods
    .balanceOf(lockAndDataForSchainAddress)
    .call()
    .then(balance => {
      console.log("ETH clone balance of Lock&Data: " + balance);
    });
}

getBalances();
