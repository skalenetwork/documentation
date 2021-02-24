## SKALE Fuji TestNet 2

You can find the compatible versions in this page. Set up requires only Validator-Cli, Node-Cli and SGX versions.

The rest of the versions were provided for docker containers and correspondent tags in their individual code repositories.

### **Prerequisites**

-   A Linux x86_64 machine
-   SGX-enabled Intel processor
-   Ports 22, 3009, 8080, 9100, and 10000–11500, and ICMP IPv4 open for all
-   Ubuntu 18.04
-   200GB devnet
-   8 core
-   32GB RAM
-   16GB swap
-   Install docker.io
-   Install docker-compose -> `1.27.4`
-   Install iptables-persistent - (for re-initializing base firewall rules after node machine was rebooted)
-   Make sure lvm2 package is installed (`dpkg -l | grep lvm2`)
-   Make sure lsof and psmisc packages are installed

**Important notes:**  

1.  Make sure you installed `1.27.4` docker-compose version. 

2.  After docker installation make sure that the `live-restore` option
    is enabled in `/etc/docker/daemon.json`. See more info in the [docker docs](https://docs.docker.com/config/containers/live-restore/).  

3.  If you have any issues you can save the logs using `skale logs dump` command.  
    It's also useful to check logs from node-cli `skale cli logs` from docker plugin `/var/log/docker-lvmpy/lvmpy.log` if there are any issues.

4.  You can install iptables-persistent using the following commands:
    ```
    echo iptables-persistent iptables-persistent/autosave_v4 boolean true | sudo debconf-set-selections
    echo iptables-persistent iptables-persistent/autosave_v6 boolean true | sudo debconf-set-selections
    sudo apt install iptables-persistent -y
    ```
5. You can install lsof, psmisc and lvm2 packages using the following commands:
    ```
    sudo apt install lsof psmisc lvm2
    ```
5.  You should run skale commands as superuser.

6.  skale_sla container will be removed because it's deprecated for now.

7.  Logs from removed containers are placed inside `.skale/log/.removed_containers` 

8.  Before `skale node update` make sure that your attached storage isn't mounted.

* * *

### TestNet Phase 3.1 Versions - SKALE chain creation

Schains launch, IMA beta version

**Validator CLI version**: 1.2.0-beta.7

**Node CLI version**: 1.1.0-beta.15

**SGX version: sgxwallet**: 1.66.1-beta.0

**SKALE Manager version**: 1.8.0-develop.8

**Skaled version**: 3.5.2-develop.0

**IMA version**: 1.0.0-beta.2

**Skale Admin version**: 1.1.0-beta.33

**Transaction Manager version**: 1.1.0-beta.7

**Skale Bounty version**: 1.1.1-beta.3

**docker-lvmpy**: 1.0.2-beta.0

**skale-node**: 1.5.0-testnet

**watchdog**: 1.1.3-beta.1

TestNet Environment Variables: 

```shell
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.2-beta.0
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.8.0/skale-manager-1.8.0-rinkeby-abi.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/IMA/1.0.0-beta.2/abi.json
CONTAINER_CONFIGS_STREAM=1.5.0-testnet
FILEBEAT_HOST=3.17.12.121:5000
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
