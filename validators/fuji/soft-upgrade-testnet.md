## Testnet Soft Upgrade 

> Upgrading node-cli, api, admin and watchdog base containers as well as new skaled, ima and sgx versions. 

> Added new healthchecks for nodes. Fixed some issues in skaled, sgx and ima containers. 

### Update SGX 

1.  Find your SGX back up key 

2.  From sgx folder do : `docker-compose down` 

3.  Perform `git pull`

4.  Check-out to sgx version tag: `git checkout tags/1.66.1-beta.0`

5.  Make sure `image` is skalenetwork/sgxwallet:1.66.1-beta.0 in docker-compose:
.  [Recover from back up](https://skale.network/docs/documentation/sgxwallet/docs/backup-procedure)


### Recharge validator wallet

#### Downaload new Validator CLI binary

Make sure the `VERSION_NUM` is the 1.2.0-beta.5

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


### Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Make sure th `VERSION_NUM` is the 1.1.0-beta.15

**Terminal Command:**

```bash
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/skale-node-cli/releases/download/$VERSION_NUM/skale-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/skale"

```

#### Make the SKALE Node CLI binary executable

**Terminal Command:**

```bash
sudo chmod +x /usr/local/bin/skale
```

### Update node using skale node update

#### Change directory
```bash
cd  ~ && vi .env
```

#### Update CONTAINER_CONFIGS_STREAM option
Make sure `CONTAINER_CONFIGS_STREAM` in .env file is `1.4.1-testnet`

```bash
CONTAINER_CONFIGS_STREAM=1.4.1-testnet
```
#### Ensure iptables-persistent package 

Make sure the iptables-persistent package is installed on your machine

``` bash
dpkg -l | grep iptables-persistent
```

#### Perform update

Run skale node update:
```bash
skale node update .env
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
