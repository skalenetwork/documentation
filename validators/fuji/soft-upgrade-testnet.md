## Testnet Soft Upgrade 

For SKALE Validator CLI initialization use SKALE Manager ABI:

`https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.8.0/skale-manager-1.8.0-beta.1-rinkeby-abi.json`


### Update geth node

Make sure you updated geth node to 1.10.1 version with Berlin hard-fork support

### Recharge validator wallet

#### Download new Validator CLI binary

Make sure `VERSION_NUM` is `1.2.0-beta.11`

**Terminal Command:**

```shell
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/validator-cli/releases/download/$VERSION_NUM/sk-val-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/sk-val"
```

#### Apply executable permissions to the binary

**Terminal Command:**

```shell
chmod +x /usr/local/bin/sk-val
```

#### Get SKALE Manager contracts info and set the endpoint

NOTE: Be sure to setup Geth with the following JSON-RPC transports: `geth --http --http.api eth,web3`

**Terminal Command:**

```shell
sk-val init -e [ENDPOINT] -c [ABI] --wallet [software/ledger]
```

Required arguments:

-   `--endpoint/-e` - RPC endpoint of the node in the network where SKALE manager is deployed (`http` or `https`)
                    Example: <https://my.geth.node/..>.

-   `--contracts-url/-c` - URL to SKALE Manager contracts ABI and addresses

-   `-w/--wallet` - Type of the wallet that will be used for signing transactions (software or ledger)

#### Setup wallet

##### Software wallet

If you want to use software wallet you need to save the private key into a file.

Replace `[YOUR PRIVATE KEY]` with your wallet private key

**Terminal Command:**

```shell
echo [YOUR PRIVATE KEY] > ./pk.txt
```

##### Ledger wallet

If you want to use Ledger you should install the ETH ledger application and initialize the device with `setup-ledger` command.

**Terminal Command:**

```shell
sk-val wallet setup-ledger --address-index [ADDRESS_INDEX] --keys-type [KEYS_TYPE]
```

Required arguments:

-   `--address-index` - Index of the address to use (starting from `0`)
-   `--keys-type` - Type of the Ledger keys (live or legacy)

> Make sure that you enabled contracts data sending on ETH application. Otherwise transactions won't work

#### Recharge wallet

For more information visit [Self recharging wallet](/validators/self-recharging-wallets)

`ETH_AMOUNT` shouldn't be less than `0.1` multiplied by the number of nodes that your validator has

Using ledger wallet:

```shell
sk-val srw recharge ETH_AMOUNT
```

Using software wallet:

```shell
sk-val srw recharge ETH_AMOUNT --pk-file PATH_TO_PK
```

### Update sgx wallet

Update your sgx wallet to 1.70.0-beta.1 using regular update procedure

### Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Make sure `VERSION_NUM` is `1.1.0-beta.26`

**Terminal Command:**

```shell
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/skale-node-cli/releases/download/$VERSION_NUM/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```shell
sudo chmod +x /usr/local/bin/skale
```

### Update node using skale node update

#### Change directory
```shell
cd  ~ && vi .env
```

#### Update .env

Make sure the following options are set

```shell
DOCKER_LVMPY_STREAM=1.0.1-beta.1
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.8.0/skale-manager-1.8.0-beta.1-rinkeby-abi.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/IMA/1.0.0-beta.2/abi.json
CONTAINER_CONFIGS_STREAM=1.6.3-testnet
FILEBEAT_HOST=filebeat.testnet.skalenodes.com:5001
DISABLE_IMA=True
ENV_TYPE=testnet
```

#### Ensure packages

Make sure the btrfs-progs, iptables-persistent, lsof, lvm2, psmisc package are installed on your machine

```shell
dpkg -l | grep btrfs-progs
dpkg -l | grep iptables-persistent
dpkg -l | grep lsof
dpkg -l | grep lvm2
dpkg -l | grep psmisc

```

Make sure docker-compose version is `1.27.4`

```shell
docker-compose --version
```

Also make sure your attached storage specified by `DISK_MOUNTPOINT` isn't mounted

#### Perform update

Run skale node update:
```shell
skale node update .env
```

#### Setup SSL certs

##### Set domain name

```shell
skale node set-domain -d DOMAIN_NAME --yes
```

##### Upload SSL

```shell
skale ssl upload -c PATH_TO_CERT_FILE -k PATH_TO_KEY_FILE
```
