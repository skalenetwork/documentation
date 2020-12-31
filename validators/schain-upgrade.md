## FUJI Upgrade for SKALE Chain Creation

### Step 1 - TestNet Phase 3.0 - Versions for setting up with the current Mainnet environment  

### TestNet Phase 3.0 Versions - Mainnet version

**Node CLI version**: 1.0.0
**Validator CLI version**:  1.1.1
**SGX Wallet**: 1.58.5-stable.1

### Versions for Review

**SKALE Manager version**: 1.5.2

**Skaled version**: 1.46-stable.0

**Skale Admin version**: 1.0.0-stable.0

**Transaction Manager version**: 1.0.0-stable.0

**Skale Sla version**: 1.0.2-stable.0

**Skale Bounty version**: 1.1.0-stable.0

**docker lvmpy**: 1.0.0

**watchdog**: 1.0.0-stable.0

#### Mainnet Environment Variables

```bash
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.0
MANAGER_CONTRACTS_ABI_URL=https://skale-se.sfo2.digitaloceanspaces.com/manager-abi-1.5.2.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/IMA/1.0.0-develop.38/abi.json
CONTAINER_CONFIGS_STREAM=1.1.1
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
---

#### Back up SGX after node set up 
 [How to back up SGX](https://skale.network/docs/documentation/sgxwallet/docs/backup-procedure)

### Step 2 - TestNet Phase 3.1 Versions for SKALE Chain creation

#### Important Notes - Before Update

This update includes changes to docker-compose option:

with the update, validators would need to support docker-compose themselves: setup and update it if necessary. 

Installing docker-compose during SKALE node init is now disabled.

Consensus: the build introduces BLAKE3 hash and consensus DB changes (for better performance). Should not impact update process

#### Important

1. Validators need to update docker-compose version on their machines to 1.27.4, because we started using new docker-compose syntax (cpu_shares functionality in particular).
2. Validators need to remove .skale/node_data/skale.db before skale node update , because we updated db schema and until we have the migration ready we need to fast through this step by removing the folder.
3. Resource allocation file should be re-created on all nodes - this should be done automatically during node update :
    - Why resource allocation should be updated?
      - In this update, we’re adding CPU and memory limits for the IMA container (this will also affect sChain container allocation)
      - We’re changing the approach to estimating available memory on the machine
      - The resource allocation file generation procedure and structure were revised
4. Ensure that the `live-restore` option is enabled in `/etc/docker/daemon.json`. 
See more info in the [docker docs](https://docs.docker.com/config/containers/live-restore/)
5. Ensure that lvm2 package is installed on your system (`dpkg -l | grep lvm2`)
6. If there is any docker daemon failures please take a look to the service logs using `journalctl -u docker.service`. Also it's better to save them to share with the team to troubleshoot an issue. See more info in the [docker docs]('https://docs.docker.com/config/daemon/')

**Note:** If DISK_MOUNTPOINT was changed in .env it’s required to do skale resources-allocation generate before update.

4. Validators' Ledger devices: make sure the contract_data is ALLOWED (this can be set to Not Allowed after Ledger software update)
5. Due to Secure Enclave changes introduced for the SGX Wallet release candidate, validators will need a backup key for the update

#### Use these Versions for set up

**Validator CLI version**: 1.2.0-beta.1

**Node CLI version**: 1.1.0-beta.4

**SGX version: sgxwallet**: 1.59.1-stable.6

**SKALE Manager version**: 1.6.2-develop.0

**Skaled version**: 2.0.4-develop.3

**Skale Admin version**: 1.1.0-develop.17

**Transaction Manager version**: 1.0.0-develop.8

**Skale Sla version**: 1.0.0-develop.0

**Skale Bounty version**: 1.1.0-stable.0

**docker-lvmpy**: 1.0.1

**skale-admin**: 1.1.0-develop.21

**sla-agent**: 1.0.2-beta.1

**skale-node**: 1.2.2 Testnet

**watchdog**: 1.0.0-stable.0 

#### Step 2.1 Update SGX

 1. Find your SGX back up key from the previous set up
 2. From sgx folder do : docker-compose down 
 3. Perform `git pull`
 4. Check-out to sgx version tag: `git checkout tags/1.58.7-develop.1`
 5. Make sure `image` is skalenetwork/sgxwallet:1.58.7-develop.1 in docker-compose:
 6. [Recover from back up] (https://skale.network/docs/documentation/sgxwallet/docs/backup-procedure)
 
#### Step 2.2 Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Make sure th `VERSION_NUM` is the 1.1.0-beta.3

**Terminal Command:**

```bash
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/skale-node-cli/releases/download/$VERSION_NUM/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale

```

Required options for the `skale node update` command in environment file:

```bash
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.1
MANAGER_CONTRACTS_ABI_URL=https://skale-se.sfo2.digitaloceanspaces.com/skale-manager-upgrade-skale-chains.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/IMA/1.0.0-develop.38/abi.json
CONTAINER_CONFIGS_STREAM=1.2.2 Testnet
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

**Terminal Command:**

```bash

skale node update .env

```

### Step 3 - Download and reinitialize Validator CLI

With this current version there have been some bug fixes and new features added to SKALE validator CLI. 
Please follow your regular validator cli set up guidelines to upgrade validator-cli with version `1.2.0-beta.1`