//let HDWalletProvider = require("truffle-hdwallet-provider");
var HDWalletProvider = require("truffle-hdwallet-provider");
const MNEMONIC = "sick economy invite crucial crumble sort field behind nut term machine battle";
const mainnetRpcUrl = "http://134.209.56.46:1919";
//let MNEMONIC2 = "sleep ladder medal wage catalog machine supply light oppose flee motor vocal";
let ropsten_endpoint = "https://ropsten.infura.io/v3/39613f7ae6584dd59741e4e78b652981";

module.exports = {
    networks: {
        local: {
            gasPrice: 0,
            host: "localhost",
            port: 8545,
            gas: 8000000,
            network_id: "*"
        },
        ropsten: {
          provider: new HDWalletProvider(MNEMONIC, ropsten_endpoint),
          network_id: 3,
          gasPrice: 1000000000,
          gas: 8000000
        },
        mainnet: {
          provider: () => { 
            return new HDWalletProvider(MNEMONIC, mainnetRpcUrl); 
          },
          // host: "localhost",
          // port: 8545,
          gasPrice: 1000000000,
          gas: 8000000,
          network_id: "*"
        },
        skale: {
          provider: new HDWalletProvider(MNEMONIC, "http://104.248.242.35:8003"),
          network_id: "*",
          gasPrice: 0,
        }
    }
};
