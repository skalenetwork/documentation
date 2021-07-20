## SKALE Denali V2 Update

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### **Prerequisites**

-   A Linux x86_64 machine
-   SGX-enabled Intel processor
-   Ports 80, 443, 3009, 8080, 9100, and 10000–18192, and ICMP IPv4 should not be closed by external firewall
-   Ubuntu 18.04
-   2TB attached storage
-   100Gb root storage
-   32GB RAM
-   16GB swap
-   docker
-   docker-compose -> `1.27.4`
-   iptables-persistent, btrfs-progs, lsof, lvm2, psmisc apt packages
-   geth node with `1.10.5` version
-   live-restore enable in docker-config ([docker docs](https://docs.docker.com/config/containers/live-restore/))

**Important notes:**

1.  Make sure `DISABLE_IMA` .env option set to `False`.

2.  Ports `3009`, `80`, `8080`, `443`, `9100`, and `10000–18192`, and ICMP IPv4 should not be closed by external firewall.
If you're using `ufw` or `iptables` for configuring your own rules, please, do not open any of this ports.

3.  Node should be able to access `1031` SGX port.

4.  Make sure that other network nodes receives packets from your node with source IP address that is equal to IP address that you provided during node registration (it can be found in `skale node info` output).

5.  Please, don't forget to check your SSL certificate using `skale ssl check` command.

* * *

### Mainnet Versions for set up

**Validator CLI version**: 1.3.0

**Node CLI version**: 2.0.1

**SGX version: sgxwallet**: skalenetwork/sgxwallet_release:1.77.0-stable.0

**SKALE Manager version**: 1.8.1-stable.0

**Skaled version**: 3.7.3-stable.0

**Skale Admin version**: 2.0.1

**Transaction Manager version**: 2.0.1

**Skale Bounty version**: 2.0.1-stable.0

**docker-lvmpy**: 1.0.1-stable.3

**skale-node**: 2.0.0

**watchdog**: 2.0.0-stable.0

Mainnet environment variables:

```shell
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.1-stable.3
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/mainnet/skale-manager/1.8.1/skale-manager-1.8.1-mainnet-abi.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/mainnet/IMA/1.0.0/IMA-1.0.0-mainnet-abi.json
CONTAINER_CONFIGS_STREAM=2.0.0
ENV_TYPE=mainnet
FILEBEAT_HOST=filebeat.mainnet.skalenodes.com:5000
DISABLE_IMA=False
SGX_SERVER_URL=[By validator, setup SGX wallet first]
DISK_MOUNTPOINT=[By validator, your attached storage /dev/sda or /dev/xvdd (this is an example. You just need to use your 2TB block volume mount point)]
DB_PORT=[By validator]
DB_ROOT_PASSWORD=[By validator]
DB_PASSWORD=[By validator]
DB_USER=[by validator]
IMA_ENDPOINT=[by validator, MAINNET GETH NODE ENDPOINT]
ENDPOINT=[by validator, MAINNET GETH NODE ENDPOINT]
```

> Soft update steps are described in Denali V2 Upgrade Steps section
