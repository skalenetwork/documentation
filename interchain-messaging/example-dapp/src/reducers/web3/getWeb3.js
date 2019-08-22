import store from '../../store'
import Web3 from 'web3'
import rinkebyJson from "../../contracts/mainnet/rinkeby_proxy.json"
import schainJson from "../../contracts/skale-chain/schain_proxy.json"

export const WEB3_INITIALIZED = 'WEB3_INITIALIZED'
function web3Initialized(results) {
  return {
    type: WEB3_INITIALIZED,
    payload: results
  }
}

export let getWeb3 = new Promise(function(resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function(dispatch) {

    let web3 = new Web3(process.env.RINKEBY);

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {

      resolve(store.dispatch(web3Initialized({
        web3Instance: web3,
        rinkebyJson: rinkebyJson,
        schainJson: schainJson
      })));

    } 
  })
})