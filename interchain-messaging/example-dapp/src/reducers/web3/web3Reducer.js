const initialState = {
  skale: false,
  web3Instance: null,
  lockDataMainnetBalance: null,
  lockDataSchainBalance: null,
  depositBoxBalance: null,
  mainnetBalance: null,
  schainBalance: null,
  account: process.env.ACCOUNT,
  endpoint: process.env.RINKEBY,
  endpointSkale: process.env.SKALE_CHAIN,
  privateKey: process.env.PRIVATE_KEY,
  skaleId: process.env.SKALE_ID,
  rinkebyJson: null,
  schainJson: null
}

const web3Reducer = (state = initialState, action) => {
  if (action.type === 'WEB3_INITIALIZED')
  {
    return Object.assign({}, state, {
      web3Instance: action.payload.web3Instance,
      rinkebyJson: action.payload.rinkebyJson,
      schainJson: action.payload.schainJson
    })
  }
  if (action.type === 'UPDATE_BALANCES')
  {
    return Object.assign({}, state, {
      depositBoxBalance: action.payload.depositBoxBalance,
      mainnetBalance: action.payload.mainnetBalance,
      schainBalance: action.payload.schainBalance,
      lockDataMainnetBalance: action.payload.lockDataMainnetBalance,
      lockDataSchainBalance: action.payload.lockDataSchainBalance
    })
  }
  if (action.type === 'UPDATE_ACCOUNT')
  {
    return Object.assign({}, state, {
      account: action.payload
    })
  }
  if (action.type === 'UPDATE_ENDPOINT')
  {
    return Object.assign({}, state, {
      endpoint: action.payload,
    })
  }
  if (action.type === 'UPDATE_ENDPOINT_SKALE')
  {
    return Object.assign({}, state, {
      endpointSkale: action.payload,
    })
  }
  if (action.type === 'UPDATE_PRIVATE_KEY')
  {
    return Object.assign({}, state, {
      privateKey: action.payload,
    })
  }
  if (action.type === 'UPDATE_SKALE_ID')
  {
    return Object.assign({}, state, {
      skaleId: action.payload,
    })
  }

  return state
}

export default web3Reducer
