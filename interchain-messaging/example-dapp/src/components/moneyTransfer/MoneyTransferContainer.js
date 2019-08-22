import { connect } from 'react-redux'
import MoneyTransfer from './MoneyTransfer'
import { refreshBalances, deposit, exit, getMyEth, updateAccount, updateEndpoint, updateEndpointSkale, updatePrivateKey, updateSkaleId, updateTokenAddress } from './MoneyTransferActions'

const mapStateToProps = (state, ownProps) => {
  return {
    transactionDataMainnet: state.transactions.transactionDataMainnet,
    transactionDataSchain: state.transactions.transactionDataSchain,
    lockDataMainnetBalance: state.web3.lockDataMainnetBalance,
    lockDataSchainBalance: state.web3.lockDataSchainBalance,
    depositBoxBalance: state.web3.depositBoxBalance,
    mainnetBalance: state.web3.mainnetBalance,
    schainBalance: state.web3.schainBalance,
    account: state.web3.account,
    endpoint: state.web3.endpoint,
    endpointSkale: state.web3.endpointSkale,
    privateKey: state.web3.privateKey,
    skaleId: state.web3.skaleId,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onRefreshBalances: () => {
      refreshBalances();
    },
    onDeposit: (event, amount) => {
      event.preventDefault();
      deposit(amount);
    },
    onExit: (event, amount) => {
      event.preventDefault();
      exit(amount);
    },
    onGetMyEth: (event, amount) => {
      event.preventDefault();
      getMyEth(amount);
    },
    onUpdateAccount: (accountData) => {
      event.preventDefault();
      dispatch(updateAccount(accountData));
    },
    onUpdateEndpoint: (accountData) => {
      event.preventDefault();
      dispatch(updateEndpoint(accountData));
    },
    onUpdateEndpointSkale: (accountData) => {
      event.preventDefault();
      dispatch(updateEndpointSkale(accountData));
    },
    onUpdatePrivateKey: (accountData) => {
      event.preventDefault();
      dispatch(updatePrivateKey(accountData));
    },
    onUpdateSkaleId: (accountData) => {
      event.preventDefault();
      dispatch(updateSkaleId(accountData));
    }
  }
}

const MoneyTransferContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(MoneyTransfer)

export default MoneyTransferContainer
