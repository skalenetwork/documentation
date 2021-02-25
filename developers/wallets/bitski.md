### Bitski

The Bitski SDK allows you to integrate your dApp with SKALE. For more information and support, see <https://docs.bitski.com/>

#### Install the NPM Packages

```shell
npm install --save web3 bitski
```

#### Example Code

```javascript
import { Bitski } from 'bitski';
import Web3 from 'web3';


// Your setup information
const endpoint = 'https://your.skale.endpoint'; // your SKALE Chain endpoint
const skaleChainId = 123456                     // chainId of your SKALE Chain
const testAPIKey = 'your_client_id';
const callbackUrl = 'https://your.app/oath-callback.html';

const bitski = new Bitski(
    testAPIKey,
    callbackUrl
);

const network = {
    rpcUrl: endpoint,
    chainId: skaleChainId,
}

// Setting network
const provider = bitski.getProvider({ network });
let web3 = new Web3(provider);
```

#### Example Sandbox

<https://codesandbox.io/s/bitski-wallet-integration-skale-dev-docs-s3uor>
