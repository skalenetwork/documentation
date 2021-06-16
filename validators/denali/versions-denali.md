## SKALE Mainnet Versions

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### Prerequisites

#### Node machine
-  A Linux x86_64 machine
-  SGX-enabled Intel processor
-  Ports 3009, 8080, 443, 9100, and 10000–18192, and ICMP IPv4 should not be closed by external firewall
-  Ubuntu 18.04
-  100GB root storage
-  2TB attached storage
-  8 core
-  32GB RAM
-  16GB swap
-  docker
-  docker-compose -> `1.27.4`
-  iptables-persistent, btrfs-progs, lsof, lvm2, psmisc apt packages 
-  geth node with `1.10.2` version
-  live-restore enable in docker-config ([docker docs](https://docs.docker.com/config/containers/live-restore/))

**Important notes:**  

1.  Ports `3009`, `8080`, `443`, `9100`, and `10000–18192`, and ICMP IPv4 should not be closed by external firewall.
If you're using `ufw` or `iptables` for configuring your own rules, please, do not open any of this ports.

2.  Make sure that other network nodes receives packets from your node with source IP address that is equal to IP address that you provided during node registration (it can be found in `skale node info` output).

3.  Please, don't forget to check your SSL certificate using `skale ssl check` command.

### Mainnet Versions for Set up

**Node CLI**: [1.1.1](https://github.com/skalenetwork/node-cli/releases/download/1.1.1/skale-1.1.1-Linux-x86_64) 

**Validator CLI**:  [1.2.1](https://github.com/skalenetwork/validator-cli/releases/tag/1.2.1)

**SGX Wallet**: [1.70.0-stable.0](https://github.com/skalenetwork/sgxwallet/releases/tag/1.70.0-stable.0) Container: `skalenetwork/sgxwallet_release:1.70.0-stable.0`

**Skale node**: [1.2.3](https://github.com/skalenetwork/skale-node/releases/tag/1.2.3)

**Skaled**: [3.5.14-stable.0](https://github.com/skalenetwork/skaled/releases/tag/3.5.14-stable.0)

**Docker lvmpy**: [1.0.1-stable.2](https://github.com/skalenetwork/docker-lvmpy/releases/tag/1.0.1-stable.2)

**Transaction manager**: [1.1.0-stable.1](https://github.com/skalenetwork/transaction-manager/releases/tag/1.1.0-stable.1)

**Skale admin**: [1.1.0-stable.2](https://github.com/skalenetwork/skale-admin/releases/tag/1.1.0-stable.2)

**Bounty agent**: [1.1.1-stable.1](https://github.com/skalenetwork/bounty-agent/releases/tag/1.1.1-stable.1)

**Skale watchdog**: [1.1.3-stable.1](https://github.com/skalenetwork/skale-watchdog/releases/tag/1.1.3-stable.1)


### Mainnet Versions for Review

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

#### Mainnet Environment Variables to set

```shell
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.1-stable.2
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/mainnet/skale-manager/1.8.1/skale-manager-1.8.1-mainnet-abi.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/mainnet/IMA/1.0.0/abi.json
CONTAINER_CONFIGS_STREAM=1.2.3
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

> Soft update steps are described in Mainnet Soft Update section
