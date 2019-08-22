const Web3 = require('web3');
const fs = require('fs');
const privateTestnetJson = require("../contracts/private_skale_testnet_proxy.json");
const erc20PrivateTestnetJson = require("../contracts/ERC20_private_skale_testnet.json");
const schainJson = require("../contracts/schain_proxy.json");
require("dotenv").config();

function getBalances() {
  let accountForMainnet = process.env.ACCOUNT;
  let accountForSchain = process.env.ACCOUNT;

  let privateSkaleTestnetEndpoint = process.env.SKALE_PRIVATE_MAINNET;
  let schainEndpoint = process.env.SKALE_ENDPOINT;

  const depositBoxAddress = privateTestnetJson.deposit_box_address;
  const tokenManagerAddress = schainJson.token_manager_address;

  const web3PrivateTestnet = new Web3(new Web3.providers.HttpProvider(privateSkaleTestnetEndpoint));
  const web3SkaleChain = new Web3(new Web3.providers.HttpProvider(schainEndpoint));

  const erc20ABI = erc20PrivateTestnetJson.zhelcoin_abi;
  const erc20Address = erc20PrivateTestnetJson.zhelcoin_address;

  let contract = new web3PrivateTestnet.eth.Contract(erc20ABI, erc20Address);

  console.log("ERC20 contract address: " + erc20Address);

  contract.methods.balanceOf(accountForMainnet).call().then((balance) => {
      console.log("Account balance on private SKALE: " + balance);
  });

  contract.methods.balanceOf(depositBoxAddress).call().then((balance) => {
      console.log("Balance in private SKALE testnet Deposit Box: " + balance);
  });

  if (fs.existsSync("../contracts/ERC20_schain_proxy.json") == true) {
      const erc20SchainJson = require("../contracts/ERC20_schain_proxy.json");
      const erc20ABISchain = erc20SchainJson.erc20_abi;
      const erc20AddressSchain = erc20SchainJson.erc20_address;
      let contractSchain = new web3SkaleChain.eth.Contract(erc20ABISchain, erc20AddressSchain);

      contractSchain.methods.balanceOf(accountForSchain).call().then((balance) => {
          console.log("Account balance on SKALE chain: " + balance);
      });
      
      contractSchain.methods.balanceOf(tokenManagerAddress).call().then((balance) => {
          console.log("Balance in SKALE chain TokenManager: " + balance);
      });
  }
}

getBalances();