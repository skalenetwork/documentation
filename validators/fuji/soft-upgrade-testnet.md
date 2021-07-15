## Testnet Soft Upgrade 

For SKALE Validator CLI initialization use SKALE Manager ABI:

`https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.8.1/skale-manager-1.8.1-beta.1-rinkeby-abi.json`

### Update sgx

Upgrade sgx wallet to `skalenetwork:sgxwallet_release:1.77.0-stable.0`.

Make sure `1031` port is exposed in docker-compose.yml (`git pull` in `sgxwallet` repo directory) and `-b` option is set. 

**Note:** node machine should be able to access `1031` sgx port.

[Upgrade guide](https://github.com/skalenetwork/sgxwallet/blob/develop/docs/run-in-hardware-mode.md#start-stop-and-upgrade-sgxwallet-containers)

### Update validator-cli

#### Download new Validator CLI binary

Make sure `VERSION_NUM` is `1.3.0-beta.1`

**Terminal Command:**

```shell
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/validator-cli/releases/download/$VERSION_NUM/sk-val-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/sk-val"
```

#### Apply executable permissions to the binary

**Terminal Command:**

```shell
chmod +x /usr/local/bin/sk-val
```

### Make sure 80 and 443 ports are open

Please make sure traffic to 80 and 443 ports is allowed by external software.
Do not modify anything if you're using `ufw` or `iptables` to configure firewall.

### Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Make sure `VERSION_NUM` is `2.0.1-beta.0`

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
DOCKER_LVMPY_STREAM=1.0.1-beta.3
CONTAINER_CONFIGS_STREAM=2.0.0-testnet.0
DISABLE_IMA=False
ENV_TYPE=testnet
MONITORING_CONTAINERS=True
DOCKER_LVMPY_STREAM=1.0.1-beta.3
MANAGER_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.8.1/skale-manager-1.8.1-beta.1-rinkeby-abi.json
IMA_CONTRACTS_ABI_URL=https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/IMA/1.0.0-beta.4/abi.json
CONTAINER_CONFIGS_STREAM=2.0.0-testnet.0
FILEBEAT_HOST=filebeat.testnet.skalenodes.com:5001
```

Also make sure `IMA_ENDPOINT` is a working geth node URL (e.g. the same as `ENDPOINT`).

#### Perform update

Run skale node update:
```shell
skale node update .env
```
