# Tools and Troubleshooting

<SplitSectionLayout>
<SplitSectionColumn>

<button>[Block Explorer](http://explorer.skale.network/)</button>

</SplitSectionColumn>
<SplitSectionColumn>

<button boxPosition="BOTTOM_LEFT">[SKALE Faucet](http://faucet.skale.network/)</button>

</SplitSectionColumn>
</SplitSectionLayout>

## Troubleshooting

Need help solving an issue? Check to see if this has already been answered below. If you can't find an answer to your issue, reach out to us on discord.  

<button>[Ask a question](http://skale.chat/)</button>

### File Storage

If you are receiving the error below, this most likely has to do with uploading a file with the same name as a previously uploaded file. File names must be unique.  

Error: Transaction has been reverted by the EVM:

### MetaMask

#### RPC Error: Code 32603

If you are receiving the error below, this most likely has to do with a compatibility complaint between web3 1.0 and MetaMask. We have found the following web3js/MetaMask combinations work well together:  

MetaMask - RPC Error: Internal JSON-RPC error. {code: -32603, message: "Internal JSON-RPC error."}

**To Fix this Issue:**  

Use the following web3.js and MetaMask versions.  

**Web3.js:**  web3@1.0.0-beta.35  
**MetaMask:**  [MetaMask version 6.1](https://github.com/MetaMask/metamask-extension/releases/tag/v6.1.0)  

### Web3

#### Web3 CurrentProvider SendAsync

If you are receiving the error below, this most likely has to do with a compatibility complaint between web3 1.0 and Truffle or MetaMask. Web3.currentProvider.sendAsync is deprecated in Web3 v1.0 and it is replaced with web3.currentProvider.send.  

Uncaught TypeError: web3.currentProvider.sendAsync is not a function

**To Fix this Issue:**  

Replace web3.currentProvider.sendAsync with web3.currentProvider.send when using Web3 v1.0.  

```
var web3 = window.web3;

web3.providers.HttpProvider.prototype.sendAsync = 
	web3.providers.HttpProvider.prototype.send;

web3 = new Web3(web3.currentProvider);

```

SKALE Labs has many resources designed to help you get your questions answered. You can reach out to our community on  [discord](http://skale.chat/), or submit a support request below.  

<button>[Contact Support](https://skalelabs.typeform.com/to/pSu895)</button>
