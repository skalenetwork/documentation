## FUJI Upgrade Node for SKALE Chain Launch 

PLEASE DON'T USE Mainnet SGX or SKALE Node for Testnet! 

### Step 1 - Set up node with v1.0.0

**Node CLI version**: 1.0.0

**Validator CLI version**:  1.1.1

**SGX Wallet**: 1.58.5-stable.1

### These versions are provided only for reviewing:

**SKALE Manager version**: 1.5.2

**Skaled version**: 1.46-stable.0

**Skale Admin version**: 1.0.0-stable.0

**Transaction Manager version**: 1.0.0-stable.0

**Skale Sla version**: 1.0.2-stable.0

**Skale Bounty version**: 1.1.0-stable.0

**docker lvmpy**: 1.0.0

**watchdog**: 1.0.0-stable.0

#### Environment Variables

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

#### Back up SGX after node set up :
 [How to back up SGX](https://skale.network/docs/documentation/sgxwallet/docs/backup-procedure)

### Step 2 - Upgrade TestNet node to 1.4.1-testnet version for SKALE Chain creation

#### Prerequisites

This update includes changes to docker-compose option:

With the update, validators would need to support docker-compose themselves: setup and update it if necessary. 
Installing docker-compose during SKALE node init is now disabled.

Consensus: the build introduces BLAKE3 hash and consensus DB changes (for better performance). Should not impact update process

#### Important notes:

1.  Validators need to update docker-compose version on their machines to 1.27.4, because we started using new docker-compose syntax (cpu shares functionality in particular).

2.  Resource allocation file should be re-created on all nodes - this should be done automatically during node update :
    -   Why resource allocation should be updated?
      -   In this update, we’re adding CPU and memory limits for the IMA container (this will also affect sChain container allocation)
      -   We’re changing the approach to estimating available memory on the machine
      -   The resource allocation file generation procedure and structure were revised
      -   **Note:** If DISK_MOUNTPOINT was changed in .env it’s required to do skale resources-allocation generate before update.

3.  Ensure that the `live-restore` option is enabled in `/etc/docker/daemon.json`. 
See more info in the [docker docs](https://docs.docker.com/config/containers/live-restore/)

4.  Ensure that lvm2 package is installed on your system (`dpkg -l | grep lvm2`)

5.  Ensure that iptables-persistent is installed on your system (`dpkg -l | grep iptables-persistent`)

6.  If there is any docker daemon failures please take a look to the service logs using `journalctl -u docker.service`. Also it's better to save them to share with the team to troubleshoot an issue. See more info in the [docker docs]('https://docs.docker.com/config/daemon/')

7.  Validators' Ledger devices: make sure the contract_data is ALLOWED (this can be set to Not Allowed after Ledger software update)

8.  Due to Secure Enclave changes introduced for the SGX Wallet release candidate, validators will need a backup key for the update

#### Use these Versions for set up

**Validator CLI version**: 1.2.0-beta.5

**Node CLI version**: 1.1.0-beta.15

**SGX version: sgxwallet**: 1.66.1-beta.0

**Skaled version**: 3.5.0-develop.0

**IMA version**: 1.0.0-develop.133

**Skale Admin version**: 1.1.0-beta.10

**Transaction Manager version**: 1.1.0-beta.6

**Skale Bounty version**: 1.1.1-beta.2

**docker-lvmpy**: 1.0.2-beta.0

**skale-node**: 1.4.1-testnet

**watchdog**: 1.1.3-beta.1

#### Step 2 Update SGX

1.  Find your SGX back up key from the previous set up

2.  From sgx folder do : docker-compose down 

3.  Perform `git pull`

4.  Check-out to sgx version tag: `git checkout tags/1.66.1-beta.0`

5.  Make sure `image` is skalenetwork/sgxwallet:1.66.1-beta.0 in docker-compose:
.  [Recover from back up](https://skale.network/docs/documentation/sgxwallet/docs/backup-procedure)


### Step 3 - Recharge validator wallet

#### Download and reinitialize Validator CLI

Make sure th `VERSION_NUM` is the 1.2.0-beta.5

**Terminal Command:**

```bash
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/validator-cli/releases/download/$VERSION_NUM/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/sk-val"

```

#### Make the Validator CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/sk-val

```
#### Get SKALE Manager contracts info and set the endpoint

**Terminal Command:**

```shell
sk-val init -e [ENDPOINT] -c [ABI] --wallet [software/ledger]
```

Required arguments:

-   `--endpoint/-e` - RPC endpoint of the node in the network where SKALE manager is deployed (`http` or `https`)
                    Example: <https://rinkeby.infura.io/v3/..>.

-   `--contracts-url/-c` - URL to SKALE Manager contracts ABI and addresses

-   `-w/--wallet` - Type of the wallet that will be used for signing transactions (software or ledger)

#### Setup wallet

##### Software wallet

If you want to use software wallet you need to save private key into a file.

Replace `[YOUR PRIVATE KEY]` with your wallet private key

**Terminal Command:**

```shell
echo [YOUR PRIVATE KEY] > ./pk.txt
```

##### Ledger wallet

If you want to use ledger you should install ETH ledger application and  initilize device with `setup-ledger` command.

**Terminal Command:**

```shell
sk-val wallet setup-ledger --address-index [ADDRESS_INDEX] --keys-type [KEYS_TYPE]
```

Required arguments:

-   `--address-index` - Index of the address to use (starting from `0`)
-   `--keys-type` - Type of the Ledger keys (live or legacy)

> Make sure you enabled contracts data sending on ETH application. Otherwise transactions won't work


#### Recharge wallet

For more information visit `Self recharging validator wallet section`

`ETH_AMOUNT` should not be less than `0.5`


Using ledger wallet:

``` bash
sk-val srw recharge ETH_AMOUNT
```

Using software wallet:

``` bash
sk-val srw recharge ETH_AMOUNT --pk-file PATH_TO_PK
```

#### Step 4 Install SKALE Node

#### Download new SKALE Node CLI binary

Make sure th `VERSION_NUM` is the 1.1.0-beta.15

**Terminal Command:**

```bash
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/node-cli/releases/download/$VERSION_NUM/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale

```
#### Perform skale node update

Required options for the `skale node update` command in environment file:

```bash
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.2-beta.0
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.7.0/skale-manager-1.7.0-rinkeby-abi.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/IMA/1.0.0-beta.0/abi.json
CONTAINER_CONFIGS_STREAM=1.4.1-testnet
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


#### Setup SSL certs

##### Set domain name

``` bash
skale node set-domain -d DOMAIN_NAME --yes
```

##### Upload SSL

``` bash
skale ssl upload -c PATH_TO_CERT_FILE -k PATH_TO_KEY_FILE
```
