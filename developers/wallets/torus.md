### Torus

The Torus Wallet provides a non-custodial OAuth-based wallet Web3 interface that works with an iframe, and allows you to integrate your dApp with your SKALE Chain. For more information and support, see <https://docs.tor.us/torus-wallet/quick-start> and <https://docs.tor.us/how-torus-works/torus-wallet>.

#### Install the NPM Packages

```shell
npm install --save web3 @toruslabs/torus-embed
```

#### Example Code

```javascript
import Portis from '@toruslabs/torus-embed';
import Web3 from 'web3';


// Your setup information
const endpoint = 'https://your.skale.endpoint'; // your SKALE Chain endpoint
const skaleChainId = 123456                     // Optional SKALE Chain chainId
const network = "SKALE Network";                // Optional network name

// Setting network
const torus = new Torus()
await torus.init(
    {
        network: {
            host: endpoint,
            chainId: skaleChainId,
            networkName: network
        }
    }
);
await torus.login(); // await torus.ethereum.enable()
const web3 = new Web3(torus.provider);
```

#### Example Sandbox

<https://codesandbox.io/s/torus-wallet-integration-skale-dev-docs-soj6n>
