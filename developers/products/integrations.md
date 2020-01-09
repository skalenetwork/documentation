## Integrations

Elastic SKALE Chains are designed to work with all Ethereum compatible tools. If you are having difficulty integrating a tool with your SKALE Chain, please reach out to our community on  [discord](http://skale.chat/), or submit a support request for help below.  

<button>[Contact Support](https://skalelabs.typeform.com/to/pSu895)</button>

### API Based Wallets

The best way to manage your user authentication and on-boarding, is to integrate an API based wallet into your dApp. An API based wallet allows you to provide an intuitive user login flow for your users. An API based wallet can help you provide a secure and user friend wallet option. This is especially useful for your new users that are using a blockchain application for the first time. Being able to execute transactions programmatically directly from your dApp, takes the pressure off of your end user to have to manage this on their own.  
‍  
Below, you will find a few options that will help make your user management and on-boarding seamless.  

#### **Bitski**

Bitski is an open-sourced solution that manages your user's wallet keys for you through their hosted SDK solution. With Bitski, your end users can signup with their email address to create a wallet. Then, you can execute transactions programmatically directly from your dApp using the wallet that Bitski creates for your end user.  
‍  
For more information on Bitski, please see  [Bitski Developer Documentation](https://docs.bitski.com/).  

To connect the Bitski's wallet management feature to SKALE, you will need to provide the Bitski Web3 provider with your SKALE Chain endpoint.  

```javascript
const bitski = new Bitski("[YOUR-CLIENT-ID]", "[YOUR-REDIRECT-URL]");
const network = {
  rpcUrl: "[YOUR_SKALE_CHAIN_ENDPOINT]",
  chainId: 1
}
const provider = bitski.getProvider({ network });
let web3 = new Web3(provider);

```

Once connected, you can use Bitski and Web3 as normal.  

```javascript
bitski.signIn().then(() => {
  //signed in!
  console.log("User has been signed in via Bitski!")
});

```

#### **Portis**

Portis is an open-sourced solution that manages your user's wallet keys for you through their hosted SDK solution. With Portis, your end users can signup with their email address to create a wallet. Portis allows your end users to  [trust your application](https://docs.portis.io/#/trust-this-app)  for easier transaction processing for transaction that do not exceed $1 over an hour long period.  
‍  
For more information on Portis, please see  [Portis Developer Documentation](https://docs.portis.io/).  

To connect the Portis' wallet management feature to SKALE, you will need to instantiate Portis with your SKALE Chain endpoint. Please note that Portis sends out transaction requests over HTTPS, and you will need to pass your HTTPS SKALE endpoint to Portis.  

```javascript
const mySKALEChain = {
  nodeUrl: "[YOUR_HTTPS_SKALE_CHAIN_ENDPOINT]",
  chainId: 1,
  nodeProtocol: 'rpc',
};
const portis = new Portis("[YOUR_PORTIS_ID]", mySKALEChain);
let web3 = new Web3(portis.provider);

```

Once connected, you can use Portis and Web3 as normal.  

```javascript
portis.onLogin((walletAddress, email) => {
  //signed in!
  console.log("User" + walletAddress + "has been signed in via Portis!")
});
portis.showPortis();

```

#### **Torus**

Torus is an open-sourced solution that manages your user's wallet keys for you through their hosted SDK solution. With Torus, your end users can signup via Google or Facebook OAuth logins. This creates frictionless logins for dApps, that is easy for end users, and easy for dApp developers to implement.  
‍  
For more information on Torus, please see  [Torus Developer Documentation](https://docs.tor.us/).  

To connect the Torus' wallet management feature to SKALE, you will need to instantiate Portis with your SKALE Chain endpoint.  

```javascript
const torus = new Torus();
await torus.init({
  network: {
    host: [YOUR_SKALE_CHAIN_ENDPOINT],
    chainId: 1,
    networkName: 'SKALE Network'
  }
});

```

Once connected, you can use Portis and Web3 as normal.  

```javascript
await torus.login();
let web3 = new Web3(torus.provider);

```
