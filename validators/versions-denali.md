## SKALE Mainnet Versions

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### Prerequisites

#### Node machine
-   A Linux x86_64 machine
-   SGX-enabled Intel processor (for SGXWallet machine)
-   Ports 22, 3009, 8080, 9100, and 10000–18192, and ICMP IPv4 open for all
-   Ubuntu 18.04
-   2TB attached storage
-   8 core
-   32GB RAM
-   16GB swap

### Mainnet Versions for Set up

**Node CLI**: [1.1.0](https://github.com/skalenetwork/node-cli/releases/download/1.1.0/skale-1.1.0-Linux-x86_64) 

**Validator CLI**:  [1.2.0](https://github.com/skalenetwork/validator-cli/releases/tag/1.2.0)

**SGX Wallet**: [1.70.0-stable.0](https://github.com/skalenetwork/sgxwallet/releases/tag/1.70.0-stable.0) Container: `skalenetwork/sgxwallet_release:1.70.0-stable.0`

**Skale node**: [1.2.2](https://github.com/skalenetwork/skale-node/releases/tag/1.2.2)

**Skaled**: [3.5.12-stable.1](https://github.com/skalenetwork/skaled/releases/tag/3.5.12-stable.1)

**Docker lvmpy**: [1.0.1-stable.1](https://github.com/skalenetwork/docker-lvmpy/releases/tag/1.0.1-stable.1)

**Transaction manager**: [1.1.0-stable.0](https://github.com/skalenetwork/transaction-manager/releases/tag/1.1.0-stable.0)

**Skale admin**: [1.1.0-stable.1](https://github.com/skalenetwork/skale-admin/releases/tag/1.1.0-stable.1)

**Bounty agent**: [1.1.1-stable.0](https://github.com/skalenetwork/bounty-agent/releases/tag/1.1.1-stable.0)

**Skale watchdog**: [1.1.3-stable.0](https://github.com/skalenetwork/skale-watchdog/releases/tag/1.1.3-stable.0)


### Mainnet Versions for Review

**SKALE Manager version**: [1.7.2](https://github.com/skalenetwork/skale-network/tree/master/releases/mainnet/skale-manager/1.7.2)

**Node CLI**: [1.0.0](https://github.com/skalenetwork/node-cli/releases/download/1.0.0/skale-1.0.0-Linux-x86_64) 

**Validator CLI**:  [1.1.2](https://github.com/skalenetwork/validator-cli/releases/tag/1.1.2)

**Skaled version**: [1.46-stable.0](https://github.com/skalenetwork/skaled/releases/tag/1.46-stable.0)

**Skale Admin version**: [1.0.0-stable.1](https://github.com/skalenetwork/skale-admin/releases/tag/1.0.0-stable.1)

**Transaction Manager version**: [1.0.0-stable.0](https://github.com/skalenetwork/transaction-manager/releases/tag/1.0.0-stable.0)

**Skale Sla version**: [1.0.2-stable.0](https://github.com/skalenetwork/sla-agent/releases/tag/1.0.2-stable.0)

**Skale Bounty version**: [1.1.0-stable.0](https://github.com/skalenetwork/bounty-agent/releases/tag/1.1.0-stable.0)

**docker lvmpy**: [1.0.0](https://github.com/skalenetwork/docker-lvmpy/releases/tag/1.0.0)

**watchdog**: [1.0.0-stable.0](https://github.com/skalenetwork/skale-watchdog/releases/tag/1.0.0-stable.0)

#### Mainnet Environment Variables to set

```shell
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.1-stable.1
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/mainnet/skale-manager/1.8.0/skale-manager-1.8.0-mainnet-abi.json
IMA_CONTRACTS_ABI_URL=https://skale-contracts.nyc3.digitaloceanspaces.com/mainnet-ima/ima.json
CONTAINER_CONFIGS_STREAM=1.2.2
FILEBEAT_HOST=filebeat.mainnet.skalenodes.com:5000
DISABLE_IMA=True
ENV_TYPE=mainnet
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
