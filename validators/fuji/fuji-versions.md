## SKALE Fuji TestNet 3

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### **Prerequisites**

-   A Linux x86_64 machine
-   SGX-enabled Intel processor
-   Ports 3009, 8080, 443, 9100, and 10000–18192, and ICMP IPv4 should not be closed by external firewall
-   Ubuntu 18.04
-   200GB devnet
-   8 core
-   32GB RAM
-   16GB swap
-   docker
-   docker-compose -> `1.27.4`
-   iptables-persistent, btrfs-progs, lsof, lvm2, psmisc apt packages 
-   geth node with `1.10.2` version
-   live-restore enable in docker-config ([docker docs](https://docs.docker.com/config/containers/live-restore/))

**Important notes:**  

1.  Ports `3009`, `8080`, `443`, `9100`, and `10000–18192`, and ICMP IPv4 should not be closed by external firewall.
If you're using `ufw` or `iptables` for configuring your own rules, please, do not open any of this ports.

2.  Make sure that other network nodes receives packets from your node with source IP address that is equal to IP address that you provided during node registration (it can be found in `skale node info` output).

3.  Please, don't forget to check your SSL certificate using `skale ssl check` command.

* * *

### TestNet Phase 3.2 Versions - SKALE chain creation hotfix

**Validator CLI version**: 1.2.0-beta.12

**Node CLI version**: 1.1.1-beta.1

**SGX version: sgxwallet**: skalenetwork/sgxwallet_release:1.70.0-stable.0

**SKALE Manager version**: 1.8.0-beta.1

**Skaled version**: 3.5.14-beta.6

**Skale Admin version**: 1.1.0-beta.57

**Transaction Manager version**: 1.1.0-beta.16

**Skale Bounty version**: 1.1.1-beta.8

**docker-lvmpy**: 1.0.1-beta.2

**skale-node**: 1.7.3-testnet

**watchdog**: 1.1.3-beta.9

TestNet Environment Variables: 

```shell
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.1-beta.2
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.8.0/skale-manager-1.8.0-beta.1-rinkeby-abi.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/IMA/1.0.0-beta.2/abi.json
CONTAINER_CONFIGS_STREAM=1.7.3-testnet
ENV_TYPE=testnet
FILEBEAT_HOST=filebeat.testnet.skalenodes.com:5001
SGX_SERVER_URL=[By validator, setup SGX wallet first]
DISK_MOUNTPOINT=[By validator, your attached storage /dev/sda or /dev/xvdd (this is an example. You just need to use your 2TB block volume mount point)]
DB_PORT=[By validator]
DB_ROOT_PASSWORD=[By validator]
DB_PASSWORD=[By validator]
DB_USER=[by validator]
IMA_ENDPOINT=[by validator, GETH NODE ENDPOINT Rinkeby ]
ENDPOINT=[by validator, GETH NODE ENDPOINT Rinkeby]
```

> Soft update steps are described in TestNet Soft Update section
