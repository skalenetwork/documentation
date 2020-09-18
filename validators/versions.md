## SKALE Mainnet Versions

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### Mainnet Versions for Set up

**Node CLI version**: [1.0.0](https://github.com/skalenetwork/skale-node-cli/releases/download/1.0.0/skale-1.0.0-Linux-x86_64) 

**Validator CLI version**:  [1.1.0](https://github.com/skalenetwork/validator-cli/releases/tag/1.1.0)

**SGX Wallet**: [1.58.5-stable.1](https://github.com/skalenetwork/sgxwallet/releases/tag/1.58.5-stable.1)

### Mainnet Versions for Review

**SKALE Manager version**: [1.5.2](https://github.com/skalenetwork/skale-network/tree/master/releases/mainnet/skale-manager/1.5.2)

**Skaled version**: [1.46-stable.0](https://github.com/skalenetwork/skaled/releases/tag/1.46-stable.0)

**Skale Admin version**: [1.0.0-stable.0](https://github.com/skalenetwork/skale-admin/releases/tag/1.0.0-stable.0)

**Transaction Manager version**: [1.0.0-stable.0](https://github.com/skalenetwork/transaction-manager/releases/tag/1.0.0-stable.0)

**Skale Sla version**: [1.0.2-stable.0](https://github.com/skalenetwork/sla-agent/releases/tag/1.0.2-stable.0)

**Skale Bounty version**: [1.0.0-stable.0](https://github.com/skalenetwork/bounty-agent/releases/tag/1.0.0-stable.0)

**docker lvmpy**: [1.0.0](https://github.com/skalenetwork/docker-lvmpy/releases/tag/1.0.0)

**watchdog**: [1.0.0-stable.0](https://github.com/skalenetwork/skale-watchdog/releases/tag/1.0.0-stable.0)

#### Mainnet Environment Variables

```bash
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.0
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/mainnet/skale-manager/1.5.2/skale-manager-1.5.2-mainnet-abi.json
IMA_CONTRACTS_ABI_URL=https://skale-contracts.nyc3.digitaloceanspaces.com/mainnet-ima/ima.json
CONTAINER_CONFIGS_STREAM=1.1.0
FILEBEAT_HOST=3.17.12.121:5000
SGX_SERVER_URL=[By validator, setup SGX wallet first]
DISK_MOUNTPOINT=[By validator, your attached storage /dev/sda or /dev/xvdd (this is an example. You just need to use your 2TB block volume mount point)]
DB_PORT=[By validator]
DB_ROOT_PASSWORD=[By validator]
DB_PASSWORD=[By validator]
DB_USER=[by validator]
IMA_ENDPOINT=[by validator, GETH NODE ENDPOINT ]
ENDPOINT=[by validator, GETH NODE ENDPOINT]
```
---
