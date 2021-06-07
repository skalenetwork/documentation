## Testnet Soft Upgrade 

For SKALE Validator CLI initialization use SKALE Manager ABI:

`https://raw.githubusercontent.com/skalenetwork/skale-network/master/releases/rinkeby/skale-manager/1.8.0/skale-manager-1.8.0-beta.1-rinkeby-abi.json`

### Update validator-cli

#### Download new Validator CLI binary

Make sure `VERSION_NUM` is `1.2.0-beta.12`

**Terminal Command:**

```shell
VERSION_NUM=[VERSION_NUM] && sudo -E bash -c "curl -L https://github.com/skalenetwork/validator-cli/releases/download/$VERSION_NUM/sk-val-$VERSION_NUM-`uname -s`-`uname -m` >  /usr/local/bin/sk-val"
```

#### Apply executable permissions to the binary

**Terminal Command:**

```shell
chmod +x /usr/local/bin/sk-val
```

### Install SKALE Node CLI

#### Download the SKALE Node CLI binary

Make sure `VERSION_NUM` is `1.1.1-beta.1`

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
DOCKER_LVMPY_STREAM=1.0.1-beta.2
CONTAINER_CONFIGS_STREAM=1.7.3-testnet
FILEBEAT_HOST=filebeat.testnet.skalenodes.com:5001
DISABLE_IMA=True
ENV_TYPE=testnet
```

#### Perform update

Run skale node update:
```shell
skale node update .env
```

#### Check your SSL certificate

Certificate file should be in `PEM` format and contain full certificate chain

##### Run skale ssl check to make sure your ssl certificate is valid

```shell
skale ssl check
```

More info: https://github.com/skalenetwork/node-cli/tree/beta#check-ssl-certificate 
