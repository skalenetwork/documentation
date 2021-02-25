### Magic Wallet (Fortmatic)

The Magic Wallet SDK allows you to integrate your dApp with SKALE. For more information and support, see <https://docs.fortmatic.com/web3-integration/network-configuration#switch-network-to-custom-node>

#### Install the NPM Package

```shell
npm install --save web3 fortmatic
```

#### Example Code

```javascript
import Fortmatic from 'fortmatic';
import Web3 from 'web3';


// Your setup information
const endpoint = 'https://your.skale.endpoint'; // your SKALE Chain endpoint
const skaleChainId = 123456                     // chainId of your SKALE Chain
const testAPIKey = 'your_test_api_key';

const customNodeOptions = {
    rpcUrl: endpoint, 
    chainId: skaleChainId 
}

// Setting network
const fm = new Fortmatic(testAPIKey, customNodeOptions);
let web3 = new Web3(fm.getProvider());
```

#### Example Sandbox

<https://codesandbox.io/s/fortmatic-wallet-integration-skale-dev-docs-moskd>
