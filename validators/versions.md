## SKALE Mainnet Versions

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### Mainnet Versions

**Validator CLI version**: 1.0.0

**Node CLI version**: 1.0.0

**SKALE Node**: 1.1.0

**SKALE Manager version**: 1.5.2

#### Mainnet Environment Variables

```bash
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=0.1.0-stable.0
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/mainnet/skale-manager/1.5.2/skale-manager-1.5.2-mainnet-abi.json
IMA_CONTRACTS_ABI_URL=[Will be available after Sept16]
CONTAINER_CONFIGS_STREAM=[Will be available after Sept16]
FILEBEAT_HOST=127.0.0.1:3031
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
