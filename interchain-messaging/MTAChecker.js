const Web3 = require('web3');
const privateTestnetJson = require("./contracts/private_skale_testnet_proxy.json"); //this is the aws ABIs provided to you
const schainJson = require("./contracts/schain_proxy.json");

let privateSkaleTestnetEndpoint = process.env.SKALE_PRIVATE_MAINNET;
let schainEndpoint = process.env.SKALE_ENDPOINT;

const web3PrivateTestnet = new Web3(new Web3.providers.HttpProvider(privateSkaleTestnetEndpoint));
const web3SkaleChain = new Web3(new Web3.providers.HttpProvider(schainEndpoint));

let messageProxyForMainnetAddress = privateTestnetJson.message_proxy_mainnet_address;
let messageProxyForMainnetABI = privateTestnetJson.message_proxy_mainnet_abi;

let messageProxyForSchainAddress = schainJson.message_proxy_chain_address;
let messageProxyForSchainABI = schainJson.message_proxy_chain_abi;

let lockAndDataForMainnetAddress = privateTestnetJson.lock_and_data_for_mainnet_address;
let lockAndDataForMainnetABI = privateTestnetJson.lock_and_data_for_mainnet_abi;

let MessageProxyForMainnet = new web3PrivateTestnet.eth.Contract(messageProxyForMainnetABI, messageProxyForMainnetAddress);
let MessageProxyForSchain = new web3SkaleChain.eth.Contract(messageProxyForSchainABI, messageProxyForSchainAddress);
let LockAndDataForMainnet = new web3PrivateTestnet.eth.Contract(lockAndDataForMainnetABI, lockAndDataForMainnetAddress);

MessageProxyForMainnet.methods.getOutgoingMessagesCounter("E7J15VNI").call().then(function(res) {
    console.log("Outgoing Messages from Mainnet:", web3PrivateTestnet.utils.hexToNumber(res));
});
MessageProxyForMainnet.methods.getIncomingMessagesCounter("E7J15VNI").call().then(function(res) {
    console.log("Incoming Messages in Mainnet:", web3PrivateTestnet.utils.hexToNumber(res));
});
MessageProxyForMainnet.methods.connectedChains(web3PrivateTestnet.utils.keccak256("E7J15VNI")).call().then(function(res) {
    console.log("Chain E7J15VNI connected:", res.inited);
});

MessageProxyForSchain.methods.getOutgoingMessagesCounter("Mainnet").call().then(function(res) {
    console.log("Outgoing Messages from Schain:", web3SkaleChain.utils.hexToNumber(res));
});
MessageProxyForSchain.methods.getIncomingMessagesCounter("Mainnet").call().then(function(res) {
    console.log("Incoming Messages in Schain:", web3SkaleChain.utils.hexToNumber(res));
});

LockAndDataForMainnet.methods.tokenManagerAddresses(web3PrivateTestnet.utils.keccak256("E7J15VNI")).call().then(function(res) {
    console.log("Token Manager address in Skale Chain E7J15VNI:", res);
});


