### Wallet Connect

The Wallet Connect is an open source protocol to link dApps and Wallets, and allows you to integrate your dApp with SKALE. For more information and support, see <https://docs.walletconnect.org/quick-start/dapps/web3-provider>

#### Install the NPM Packages

```shell
npm install --save web3 @walletconnect/web3-provider
```

#### Example Code

```javascript
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3 from 'web3';


// Your setup information
const endpoint = 'https://your.skale.endpoint';             // your SKALE Chain endpoint
const ethereumEndpoint = 'https://your.ethereum.endpoint'   // your Ethereum endpoint
const skaleChainId = 123456                                 // chainId of your SKALE Chain

const provider = new WalletConnectProvider({
    rpc: {
      skaleChainId: endpoint,
      4: ethereumEndpoint
    }
  });
  await provider.enable();
  const web3 = new Web3(provider);
```

#### Example Sandbox

<https://codesandbox.io/s/wallet-connect-wallet-integration-skale-dev-docs-forked-5xq08>
