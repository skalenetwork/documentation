## FUJI Hard Upgrade
!!! NOT FOR MAINNET !!! DO NOT PERFORM THESE OPERATIONS IF YOU ARE REGISTERING NODE FOR FIRST TIME OR ON MAINNET

These are the steps to clean up SKALE functionalities already set up in your node so validators can re-register their validator and node to the new skale_manager smart contract on Rinkeby

**Stop sgx-wallet containers**
```bash
cd /root/sgxwallet/run_sgx && docker-compose down
```

**SKALE Node down**
```bash
cd ~/.skale/config && docker-compose down
```

**Remove SKALE Folder**
```bash
rm -rf ~/.skale
```

**Remove Validator Folder**
```bash
rm -rf ~/.skale-val-cli
```

**Here is an example how you can clean up SKALE Containers**
```bash
docker ps --format ‘{{.Names}}’ | grep “^skale” | awk ‘{print $1}’ | xargs -I {} docker stop {}
``` 

<button>[Register your node](/validators/register-validator-node)</button>
