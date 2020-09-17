## SKALE Mainnet Versions

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### Mainnet Versions for Set up


| Component   | Version | Tag |
|----------|-------------|------|
| Node CLI version | [1.0.0](https://github.com/skalenetwork/skale-node-cli/releases/download/1.0.0/skale-1.0.0-Linux-x86_64) | [`1.0.0`](https://github.com/skalenetwork/skale-node-cli/releases/download/1.0.0/skale-1.0.0-Linux-x86_64)|[`1.0.0`](https://github.com/skalenetwork/skale-node-cli/releases/tag/1.0.0) |
| Validator CLI version | [1.0.0](https://github.com/skalenetwork/validator-cli/releases/download/1.0.0/sk-val-1.0.0-Linux-x86_64) | [`1.0.0`](https://github.com/skalenetwork/validator-cli/releases/tag/1.0.0) |
| SKALE Manager version | 1.58.5 | 1.58.5-stable.1 |
| SKALE Node | 1.1.0  | 1.5.2-stable.0 |
| docker-lvmpy | 0.1.0  | 1.5.2-stable.0 |


#### Mainnet Environment Variables

```bash
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=0.1.0-stable.0
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
