let fs = require("fs");
let Zheltcoin = artifacts.require("./Zheltcoin.sol");

async function deploy(deployer) {
  await deployer.deploy(Zheltcoin, 1000000, "Zheltcoin", "ZhLT", {gas: 2000000});
  let jsonObject = {
      zhelcoin_address: Zheltcoin.address,
      zhelcoin_abi: Zheltcoin.abi
  };

  await fs.writeFile("data.json", JSON.stringify(jsonObject), function (err) {
      if (err) {
          return console.log(err);
      }
      console.log('Done, check data.json file in data folder.');
      process.exit(0);
  });

}

module.exports = deploy;
