### Portis

The Portis SDK allows you to integrate your dApp with SKALE. For more information and support, see <https://docs.portis.io/#/quick-start>

#### Install the NPM Packages

```shell
npm install --save web3 @portis/web3
```

#### Example Code

```javascript
import Portis from '@portis/web3';
import Web3 from 'web3';


// Your setup information
const endpoint = 'https://your.skale.endpoint'; // your SKALE Chain endpoint
const skaleChainId = 123456                     // chainId of your SKALE Chain
const testAPIKey = 'your_api_key';

const mySKALEChain = {
    nodeUrl: endpoint,
    chainId: skaleChainId,
    nodeProtocol: "rpc"
}

// Setting network
const portis = new Portis(testAPIKey, mySKALEChain);
let web3 = new Web3(portis.provider);
```

#### Example Sandbox

<https://codesandbox.io/s/portis-wallet-integration-skale-dev-docs-41knv>
