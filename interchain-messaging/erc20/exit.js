const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const fs = require('fs');
const privateTestnetJson = require("../contracts/private_skale_testnet_proxy.json");
const erc20SchainJson = require("../contracts/ERC20_schain_proxy.json");
const schainJson = require("../contracts/schain_proxy.json");
require("dotenv").config();

function exit() {
  let privateKeyForSchain = new Buffer(process.env.PRIVATE_KEY, "hex");
  let accountForMainnet = process.env.ACCOUNT;
  let accountForSchain = process.env.ACCOUNT;

  let privateSkaleTestnetEndpoint = process.env.SKALE_PRIVATE_MAINNET;
  let schainEndpoint = process.env.SKALE_ENDPOINT;
  let schainID = process.env.SKALE_CHAIN_ID;

  const depositBoxAddress = privateTestnetJson.deposit_box_address;
  const depositBoxABI = privateTestnetJson.deposit_box_abi;

  const tokenManagerAddress = schainJson.token_manager_address;
  const tokenManagerABI = schainJson.token_manager_abi;

  const erc20ABI = erc20SchainJson.erc20_abi;
  const erc20Address = erc20SchainJson.erc20_address;


  const web3ForMainnet = new Web3(new Web3.providers.HttpProvider(privateSkaleTestnetEndpoint));
  const web3ForSchain = new Web3(new Web3.providers.HttpProvider(schainEndpoint));

  let depositBox = new web3ForMainnet.eth.Contract(depositBoxABI, depositBoxAddress);

  let tokenManager = new web3ForSchain.eth.Contract(tokenManagerABI, tokenManagerAddress);

  let contractERC20 = new web3ForSchain.eth.Contract(erc20ABI, erc20Address);
  //prepare the smart contract function deposit(string schainID, address to)

  let approve = contractERC20.methods.approve(tokenManagerAddress, web3ForSchain.utils.toBN("1000000000000000000")).encodeABI();

  let deposit = tokenManager.methods.exitToMainERC20(erc20Address, accountForMainnet, web3ForSchain.utils.toBN("1000000000000000000")).encodeABI();

  web3ForSchain.eth.getTransactionCount(accountForSchain).then(nonce => {
    
      //create raw transaction
      const rawTxApprove = {
        from: accountForSchain, 
        nonce: "0x" + nonce.toString(16),
        data : approve,
        to: erc20Address,
        gasPrice: 0,
        gas: 8000000
      }
      nonce += 1;
      const rawTxDeposit = {
          from: accountForSchain, 
          nonce: "0x" + nonce.toString(16),
          data : deposit,
          to: tokenManagerAddress,
          gasPrice: 0,
          gas: 8000000,
          value: web3ForSchain.utils.toHex(web3ForSchain.utils.toWei('1', 'ether'))
      }
    
      //sign transaction
      const txApprove = new Tx(rawTxApprove);
      const txDeposit = new Tx(rawTxDeposit);
      txApprove.sign(privateKeyForSchain);
      txDeposit.sign(privateKeyForSchain);
    
      const serializedTxApprove = txApprove.serialize();
      const serializedTxDeposit = txDeposit.serialize();
    
    
    
    //send signed transaction
    web3ForSchain.eth.sendSignedTransaction('0x' + serializedTxApprove.toString('hex')).
      on('receipt', receipt => {
        console.log(receipt);
        web3ForSchain.eth.sendSignedTransaction('0x' + serializedTxDeposit.toString('hex')).
            on('receipt', receipt => {
                console.log(receipt);
                // tokenManager.getPastEvents("ERC20TokenCreated", {
                //     "filter": {"contractThere": [erc20Address]},
                //     "fromBlock": 0,
                //     "toBlock": "latest"
                // }, (error, events) => {console.log(events);}).then((events) => {
                //     console.log("New Created ERC20 clone on Skale Chain: " + events[0].returnValues.contractHere);
                //     let jsonObject = {
                //         erc20_address: events[0].returnValues.contractHere,
                //         erc20_abi: erc20ABI
                //     };

                //     fs.writeFile("./contracts/ERC20_schain_proxy.json", JSON.stringify(jsonObject), function (err) {
                //         if (err) {
                //             return console.log(err);
                //         }
                //         console.log('Done, check ERC20_schain_proxy.json file in data folder.');
                //         process.exit(0);
                //     });
                // });
            }).
            catch(console.error);
     }).
      catch(console.error);
  });
}

exit();
